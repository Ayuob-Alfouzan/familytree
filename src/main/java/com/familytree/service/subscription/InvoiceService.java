package com.familytree.service.subscription;

import com.familytree.config.ApplicationProperties;
import com.familytree.domain.familytree.*;
import com.familytree.domain.subscription.Invoice;
import com.familytree.domain.subscription.Invoice_;
import com.familytree.domain.subscription.Subscription;
import com.familytree.domain.subscription.SubscriptionUpgradeRequest;
import com.familytree.domain.util.Lookup;
import com.familytree.domain.util.Lookup_;
import com.familytree.repository.subscription.InvoiceRepository;
import com.familytree.repository.subscription.SubscriptionRepository;
import com.familytree.repository.subscription.SubscriptionUpgradeRequestRepository;
import com.familytree.security.AuthoritiesConstants;
import com.familytree.security.SecurityUtils;
import com.familytree.service.dto.subscription.InvoiceCriteria;
import com.familytree.service.dto.subscription.InvoiceDTO;
import com.familytree.service.dto.subscription.InvoiceItemDTO;
import com.familytree.service.familytree.OwnershipService;
import com.familytree.service.lookup.*;
import com.familytree.service.mapper.subscription.InvoiceMapper;
import com.familytree.service.util.CommonUtil;
import com.familytree.service.util.exception.BadRequestException;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.export.JRPdfExporter;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.service.QueryService;
import tech.jhipster.service.filter.BooleanFilter;

@Service
public class InvoiceService extends QueryService<Invoice> {

    private final Logger log = LoggerFactory.getLogger(InvoiceService.class);

    private final ApplicationProperties applicationProperties;

    private final OwnershipService ownershipService;

    private final InvoiceRepository invoiceRepository;

    private final InvoiceMapper invoiceMapper;

    private final LookupService lookupService;

    private final SubscriptionRepository subscriptionRepository;

    private final SubscriptionUpgradeRequestRepository subscriptionUpgradeRequestRepository;

    public InvoiceService(
        ApplicationProperties applicationProperties,
        OwnershipService ownershipService,
        InvoiceRepository invoiceRepository,
        InvoiceMapper invoiceMapper,
        LookupService lookupService,
        SubscriptionRepository subscriptionRepository,
        SubscriptionUpgradeRequestRepository subscriptionUpgradeRequestRepository
    ) {
        this.applicationProperties = applicationProperties;
        this.ownershipService = ownershipService;
        this.invoiceRepository = invoiceRepository;
        this.invoiceMapper = invoiceMapper;
        this.lookupService = lookupService;
        this.subscriptionRepository = subscriptionRepository;
        this.subscriptionUpgradeRequestRepository = subscriptionUpgradeRequestRepository;
    }

    @Transactional(readOnly = true)
    public Page<InvoiceDTO> list(InvoiceCriteria invoiceCriteria, Pageable pageable) {
        FamilyTree familyTree = ownershipService.getToWriteByFamilyTreeId(invoiceCriteria.getFamilyTreeId().getEquals());

        Specification<Invoice> specification = createSpecification(invoiceCriteria);
        Page<Invoice> all = invoiceRepository.findAll(specification, pageable);
        return all.map(invoiceMapper::toDto);
    }

    @Transactional(readOnly = true)
    public InvoiceDTO get(Long familyTreeId, Long invoiceId) {
        FamilyTree familyTree = ownershipService.getToWriteByFamilyTreeId(familyTreeId);
        return invoiceRepository
            .findByIdAndFamilyTree_IdAndRecordActivityIsTrue(invoiceId, familyTree.getId())
            .map(invoiceMapper::toDto)
            .orElseThrow(() -> new BadRequestException("not_found"));
    }

    @Transactional(readOnly = true)
    public byte[] print(Long familyTreeId, Long invoiceId) {
        FamilyTree familyTree = ownershipService.getToWriteByFamilyTreeId(familyTreeId);
        return invoiceRepository
            .findByIdAndFamilyTree_IdAndRecordActivityIsTrue(invoiceId, familyTree.getId())
            .map(this::generatePrintInvoice)
            .orElseThrow(() -> new BadRequestException("not_found"));
    }

    private byte[] generatePrintInvoice(Invoice invoice) {
        InputStream jasper = getClass().getResourceAsStream("/pdf/invoice/invoice.jasper");
        JRBeanCollectionDataSource data = new JRBeanCollectionDataSource(getInvoiceItems(invoice));
        Map<String, Object> parameters = getParams(invoice);

        try {
            JasperPrint print = JasperFillManager.fillReport(jasper, parameters, data);

            List<JasperPrint> jasperPrintList = new ArrayList<JasperPrint>();

            jasperPrintList.add(print);

            JRPdfExporter exporter = new JRPdfExporter();
            exporter.setExporterInput(SimpleExporterInput.getInstance(jasperPrintList));

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            SimpleOutputStreamExporterOutput simpleOutputStreamExporterOutput = new SimpleOutputStreamExporterOutput(out);
            exporter.setExporterOutput(simpleOutputStreamExporterOutput);
            exporter.exportReport();

            return out.toByteArray();
        } catch (JRException e) {
            throw new RuntimeException();
        }
    }

    private Map<String, Object> getParams(Invoice invoice) {
        Map<String, Object> parameters = new HashMap<>();

        parameters.put("customerName", invoice.getCustomerName());
        parameters.put("customerAddress", invoice.getCustomerAddress());
        parameters.put("invoiceDate", CommonUtil.formatDate(invoice.getCreationDate(), "yyyy/MM/dd"));
        parameters.put("totalVat", String.format("%.2f", invoice.getAmountVat()));
        parameters.put("totalAmount", String.format("%.2f", invoice.getAmount()));

        if (invoice.getStatus().getCode().equalsIgnoreCase(InvoiceStatusEnum.Paid.value()) && invoice.getPaymentDate() != null) {
            parameters.put("invoiceNumber", String.valueOf(invoice.getInvoiceNumber()));
            parameters.put("paymentDate", CommonUtil.formatDate(invoice.getPaymentDate(), "yyyy/MM/dd"));
        }

        if (invoice.getVatNumber() != null && !invoice.getVatNumber().isEmpty()) {
            parameters.put("vatNumber", invoice.getVatNumber());
        }

        if (applicationProperties.getSubscription().getAddress() != null) {
            parameters.put("address", applicationProperties.getSubscription().getAddress());
        }

        if (invoice.getCustomerVatNumber() != null && !invoice.getCustomerVatNumber().isEmpty()) {
            parameters.put("customerVatNumber", invoice.getCustomerVatNumber());
        }

        return parameters;
    }

    private List<InvoiceItemDTO> getInvoiceItems(Invoice invoice) {
        InvoiceItemDTO item = new InvoiceItemDTO();
        item.setNumber("1");

        if (invoice.getType().getCode().equalsIgnoreCase(InvoiceTypeEnum.Subscription.value())) {
            item.setItemAr(" اشتراك في باقة: " + invoice.getSubscription().getaPackage().getNameAr());
        } else if (invoice.getType().getCode().equalsIgnoreCase(InvoiceTypeEnum.SubscriptionUpgrade.value())) {
            item.setItemAr(" ترقية اشتراك لباقة: " + invoice.getSubscriptionUpgradeRequest().getaPackage().getNameAr());
        }

        try {
            item.setAmount(String.format("%.2f", invoice.getAmount() - invoice.getAmountVat()));
            item.setVat(String.format("%.2f", invoice.getAmountVat()));
            item.setTotal(String.format("%.2f", invoice.getAmount()));
        } catch (Exception ignore) {}

        return Collections.singletonList(item);
    }

    @Transactional
    public Invoice create(FamilyTree familyTree, Double amount, Lookup type) {
        Lookup status = lookupService.getEntityByCodeAndCategory(InvoiceStatusEnum.Unpaid.value(), LookupCategory.InvoiceStatus.value());

        Invoice invoice = new Invoice();
        invoice.setFamilyTree(familyTree);
        invoice.setStatus(status);
        invoice.setType(type);
        invoice.setAmount(amount + ((applicationProperties.getSubscription().getVatPercentage() / 100) * amount));
        invoice.setAmountVat(((applicationProperties.getSubscription().getVatPercentage() / 100) * amount));
        invoice.setVatPercentage(applicationProperties.getSubscription().getVatPercentage());
        invoice.setCreationDate(Instant.now());
        invoice.setCustomerName(familyTree.getNameAr());
        invoice.setCustomerAddress("");
        invoice.setCustomerVatNumber("");
        invoice.setVatNumber(applicationProperties.getSubscription().getVatNumber());
        return invoice;
    }

    @Transactional
    public void markAsPaid(Long invoiceId, Instant paymentDate) {
        Lookup unpaidStatus = lookupService.getEntityByCodeAndCategory(
            InvoiceStatusEnum.Unpaid.value(),
            LookupCategory.InvoiceStatus.value()
        );
        Lookup paidStatus = lookupService.getEntityByCodeAndCategory(InvoiceStatusEnum.Paid.value(), LookupCategory.InvoiceStatus.value());

        Invoice invoice = invoiceRepository
            .findByIdAndRecordActivityIsTrueAndStatus_Code(invoiceId, InvoiceStatusEnum.Unpaid.value())
            .orElseThrow(() -> new BadRequestException("not_found"));

        if (invoice.getType().getCode().equalsIgnoreCase(InvoiceTypeEnum.Subscription.value())) {
            activateSubscription(invoiceId);
        } else if (invoice.getType().getCode().equalsIgnoreCase(InvoiceTypeEnum.SubscriptionUpgrade.value())) {
            upgradeSubscription(invoiceId);
        }

        invoiceRepository.markAsPaid(invoiceId, paymentDate, unpaidStatus.getId(), paidStatus.getId());
    }

    private void activateSubscription(Long invoiceId) {
        Lookup activeStatus = lookupService.getEntityByCodeAndCategory(
            SubscriptionStatusEnum.Active.value(),
            LookupCategory.SubscriptionStatus.value()
        );

        Subscription subscription = subscriptionRepository
            .findByInvoice_IdAndRecordActivityIsTrueAndStatus_Code(invoiceId, SubscriptionStatusEnum.WaitingForPayment.value())
            .orElseThrow(() -> new BadRequestException("not_found"));

        Optional<Subscription> activeSubscription = subscriptionRepository.findActiveSubscription(subscription.getFamilyTree().getId());

        if (activeSubscription.isPresent()) {
            Instant endDate = activeSubscription.get().getEndDate();
            subscription.setStartDate(endDate);
            subscription.setEndDate(endDate.plus(subscription.getaPackage().getDuration(), ChronoUnit.DAYS));
        } else {
            subscription.setStartDate(Instant.now());
            subscription.setEndDate(Instant.now().plus(subscription.getaPackage().getDuration(), ChronoUnit.DAYS));
        }
        subscription.setStatus(activeStatus);

        subscriptionRepository.save(subscription);
    }

    private void upgradeSubscription(Long invoiceId) {
        Lookup activeStatus = lookupService.getEntityByCodeAndCategory(
            SubscriptionStatusEnum.Active.value(),
            LookupCategory.SubscriptionStatus.value()
        );

        SubscriptionUpgradeRequest subscriptionUpgradeRequest = subscriptionUpgradeRequestRepository
            .findByInvoice_IdAndRecordActivityIsTrueAndStatus_Code(invoiceId, SubscriptionStatusEnum.WaitingForPayment.value())
            .orElseThrow(() -> new BadRequestException("not_found"));

        subscriptionUpgradeRequest.getSubscription().setRangeStart(subscriptionUpgradeRequest.getaPackage().getRangeStart());
        subscriptionUpgradeRequest.getSubscription().setRangeEnd(subscriptionUpgradeRequest.getaPackage().getRangeEnd());
        subscriptionUpgradeRequest.getSubscription().setaPackage(subscriptionUpgradeRequest.getaPackage());
        subscriptionUpgradeRequest.setStatus(activeStatus);

        subscriptionUpgradeRequestRepository.save(subscriptionUpgradeRequest);
    }

    @Transactional
    public void markAsCancelled(Long invoiceId) {
        Lookup unpaidStatus = lookupService.getEntityByCodeAndCategory(
            InvoiceStatusEnum.Unpaid.value(),
            LookupCategory.InvoiceStatus.value()
        );
        Lookup cancelledStatus = lookupService.getEntityByCodeAndCategory(
            InvoiceStatusEnum.Cancelled.value(),
            LookupCategory.InvoiceStatus.value()
        );

        invoiceRepository.markAsCancelled(invoiceId, unpaidStatus.getId(), cancelledStatus.getId());
    }

    private Specification<Invoice> createSpecification(InvoiceCriteria criteria) {
        Specification<Invoice> specification = Specification.where(null);

        specification = specification.and(buildReferringEntitySpecification(criteria.getFamilyTreeId(), Invoice_.familyTree, FamilyTree_.id));

        if (criteria.getInvoiceNumber() != null) {
            specification = specification.and(buildSpecification(criteria.getInvoiceNumber(), Invoice_.invoiceNumber));
        }

        if (criteria.getCreationDate() != null) {
            specification = specification.and(buildRangeSpecification(criteria.getCreationDate(), Invoice_.creationDate));
        }

        if (criteria.getStatusCode() != null) {
            specification = specification.and(buildReferringEntitySpecification(criteria.getStatusCode(), Invoice_.status, Lookup_.code));
        }

        if (!SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.ADMIN)) {
            BooleanFilter active = new BooleanFilter();
            active.setEquals(true);

            specification = specification.and(buildSpecification(active, Invoice_.recordActivity));
        }

        return specification;
    }
}
