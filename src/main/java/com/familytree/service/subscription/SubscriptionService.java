package com.familytree.service.subscription;

import com.familytree.config.ApplicationProperties;
import com.familytree.domain.farm.Farm;
import com.familytree.domain.farm.Farm_;
import com.familytree.domain.subscription.Package;
import com.familytree.domain.subscription.Subscription;
import com.familytree.domain.subscription.SubscriptionUpgradeRequest;
import com.familytree.domain.subscription.Subscription_;
import com.familytree.domain.util.Lookup;
import com.familytree.domain.util.Lookup_;
import com.familytree.repository.subscription.SubscriptionRepository;
import com.familytree.repository.subscription.SubscriptionUpgradeRequestRepository;
import com.familytree.security.AuthoritiesConstants;
import com.familytree.security.SecurityUtils;
import com.familytree.service.dto.subscription.*;
import com.familytree.service.farm.OwnershipService;
import com.familytree.service.lookup.InvoiceTypeEnum;
import com.familytree.service.lookup.LookupCategory;
import com.familytree.service.lookup.LookupService;
import com.familytree.service.lookup.SubscriptionStatusEnum;
import com.familytree.service.mapper.subscription.SubscriptionMapper;
import com.familytree.service.mapper.subscription.SubscriptionUpgradeRequestMapper;
import com.familytree.service.util.exception.BadRequestException;
import com.familytree.web.rest.vm.subscription.SubscriptionActionResponseVM;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
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
public class SubscriptionService extends QueryService<Subscription> {

    private final Logger log = LoggerFactory.getLogger(SubscriptionService.class);

    private final ApplicationProperties applicationProperties;

    private final OwnershipService ownershipService;

    private final SubscriptionRepository subscriptionRepository;

    private final SubscriptionMapper subscriptionMapper;

    private final SubscriptionUpgradeRequestMapper subscriptionUpgradeRequestMapper;

    private final LookupService lookupService;

    private final PackageService packageService;

    private final InvoiceService invoiceService;

    private final SubscriptionUpgradeRequestRepository subscriptionUpgradeRequestRepository;

    public SubscriptionService(
        ApplicationProperties applicationProperties,
        OwnershipService ownershipService,
        SubscriptionRepository subscriptionRepository,
        SubscriptionMapper subscriptionMapper,
        SubscriptionUpgradeRequestMapper subscriptionUpgradeRequestMapper,
        LookupService lookupService,
        PackageService packageService,
        InvoiceService invoiceService,
        SubscriptionUpgradeRequestRepository subscriptionUpgradeRequestRepository
    ) {
        this.applicationProperties = applicationProperties;
        this.ownershipService = ownershipService;
        this.subscriptionRepository = subscriptionRepository;
        this.subscriptionMapper = subscriptionMapper;
        this.subscriptionUpgradeRequestMapper = subscriptionUpgradeRequestMapper;
        this.lookupService = lookupService;
        this.packageService = packageService;
        this.invoiceService = invoiceService;
        this.subscriptionUpgradeRequestRepository = subscriptionUpgradeRequestRepository;
    }

    @Transactional(readOnly = true)
    public Page<SubscriptionDTO> list(SubscriptionCriteria subscriptionCriteria, Pageable pageable) {
        Farm farm = ownershipService.getToWriteByFarmId(subscriptionCriteria.getFarmId().getEquals());

        Specification<Subscription> specification = createSpecification(subscriptionCriteria);
        Page<Subscription> all = subscriptionRepository.findAll(specification, pageable);
        return all.map(subscriptionMapper::toDto);
    }

    @Transactional(readOnly = true)
    public SubscriptionDTO getCurrentSubscription(Long farmId) {
        Farm farm = ownershipService.getToWriteByFarmId(farmId);
        return subscriptionRepository
            .findActiveSubscription(farm.getId())
            .map(subscriptionMapper::toDto)
            .orElseThrow(() -> new BadRequestException("subscription.does_not_have_active_subscription"));
    }

    @Transactional(readOnly = true)
    public SubscriptionDTO get(Long farmId, Long subscriptionId) {
        Farm farm = ownershipService.getToWriteByFarmId(farmId);
        return subscriptionRepository
            .findByIdAndFarm_IdAndRecordActivityIsTrue(subscriptionId, farm.getId())
            .map(subscriptionMapper::toDtoWithInvoice)
            .orElseThrow(() -> new BadRequestException("not_found"));
    }

    @Transactional(readOnly = true)
    public SubscriptionActionResponseVM subscriptionAction(Long farmId) {
        Farm farm = ownershipService.getToWriteByFarmId(farmId);

        boolean hasWaitingForPayment = subscriptionRepository.existsByFarm_IdAndStatus_CodeInAndRecordActivityIsTrue(
            farmId,
            Collections.singletonList(SubscriptionStatusEnum.WaitingForPayment.value())
        );

        if (hasWaitingForPayment) {
            return new SubscriptionActionResponseVM();
        }

        boolean canSubscribe = !subscriptionRepository.existsByFarm_IdAndStatus_CodeInAndRecordActivityIsTrue(
            farm.getId(),
            Arrays.asList(SubscriptionStatusEnum.Active.value(), SubscriptionStatusEnum.WaitingForPayment.value())
        );

        List<Subscription> subscriptions = subscriptionRepository.findByFarm_IdAndRecordActivityIsTrueAndStatus_CodeIn(
            farm.getId(),
            Collections.singletonList(SubscriptionStatusEnum.Active.value())
        );

        if (!canSubscribe && subscriptions.size() == 1 && canRenew(subscriptions.get(0))) {
            return new SubscriptionActionResponseVM(canSubscribe, subscriptions.get(0).getId());
        } else {
            return new SubscriptionActionResponseVM(canSubscribe);
        }
    }

    @Transactional
    public SubscriptionDTO create(Long farmId, Long packageId) {
        Farm farm = ownershipService.getToWriteByFarmId(farmId);
        Package aPackage = packageService.isSuitable(farm, packageId);

        //Lookup status = lookupService.getEntityByCodeAndCategory(SubscriptionStatusEnum.WaitingForPayment.value(), LookupCategory.SubscriptionStatus.value()); // TODO return after completing payment
        Lookup status = lookupService.getEntityByCodeAndCategory(
            SubscriptionStatusEnum.Active.value(),
            LookupCategory.SubscriptionStatus.value()
        ); // TODO remove after completing payment
        Lookup type = lookupService.getEntityByCodeAndCategory(InvoiceTypeEnum.Subscription.value(), LookupCategory.InvoiceType.value());

        Subscription subscription = new Subscription();
        subscription.setFarm(farm);
        //        subscription.setInvoice(invoiceService.create(farm, aPackage.getCost(), type)); // TODO return after completing payment
        subscription.setStatus(status);
        subscription.setaPackage(aPackage);
        subscription.setRangeStart(aPackage.getRangeStart());
        subscription.setRangeEnd(aPackage.getRangeEnd());

        // TODO remove following 9 lines after completing payment
        Optional<Subscription> activeSubscription = subscriptionRepository.findActiveSubscription(subscription.getFarm().getId());
        if (activeSubscription.isPresent()) {
            Instant endDate = activeSubscription.get().getEndDate();
            subscription.setStartDate(endDate);
            subscription.setEndDate(endDate.plus(subscription.getaPackage().getDuration(), ChronoUnit.DAYS));
        } else {
            subscription.setStartDate(Instant.now());
            subscription.setEndDate(Instant.now().plus(subscription.getaPackage().getDuration(), ChronoUnit.DAYS));
        }

        return subscriptionMapper.toDtoWithInvoice(subscriptionRepository.save(subscription));
    }

    @Transactional
    public SubscriptionDTO renew(Long farmId, Long subscriptionId) {
        Farm farm = ownershipService.getToWriteByFarmId(farmId);
        Package aPackage = packageService.suitableForRenew(farmId, subscriptionId);

        //Lookup status = lookupService.getEntityByCodeAndCategory(SubscriptionStatusEnum.WaitingForPayment.value(), LookupCategory.SubscriptionStatus.value()); // TODO return after completing payment
        Lookup status = lookupService.getEntityByCodeAndCategory(
            SubscriptionStatusEnum.Active.value(),
            LookupCategory.SubscriptionStatus.value()
        ); // TODO remove after completing payment
        Lookup type = lookupService.getEntityByCodeAndCategory(InvoiceTypeEnum.Subscription.value(), LookupCategory.InvoiceType.value());

        Subscription subscription = new Subscription();
        subscription.setFarm(farm);
        //        subscription.setInvoice(invoiceService.create(farm, aPackage.getCost(), type)); // TODO return after completing payment
        subscription.setStatus(status);
        subscription.setaPackage(aPackage);
        subscription.setRangeStart(aPackage.getRangeStart());
        subscription.setRangeEnd(aPackage.getRangeEnd());

        // TODO remove following 9 lines after completing payment
        Optional<Subscription> activeSubscription = subscriptionRepository.findActiveSubscription(subscription.getFarm().getId());
        if (activeSubscription.isPresent()) {
            Instant endDate = activeSubscription.get().getEndDate();
            subscription.setStartDate(endDate);
            subscription.setEndDate(endDate.plus(subscription.getaPackage().getDuration(), ChronoUnit.DAYS));
        } else {
            subscription.setStartDate(Instant.now());
            subscription.setEndDate(Instant.now().plus(subscription.getaPackage().getDuration(), ChronoUnit.DAYS));
        }

        return subscriptionMapper.toDtoWithInvoice(subscriptionRepository.save(subscription));
    }

    @Transactional
    public Subscription createTrail(Farm farm) {
        Package aPackage = packageService.getTrialPackage(farm.getType().getCode());

        Lookup status = lookupService.getEntityByCodeAndCategory(
            SubscriptionStatusEnum.Active.value(),
            LookupCategory.SubscriptionStatus.value()
        );

        Subscription subscription = new Subscription();
        subscription.setFarm(farm);
        subscription.setInvoice(null);
        subscription.setStatus(status);
        subscription.setaPackage(aPackage);
        subscription.setRangeStart(aPackage.getRangeStart());
        subscription.setRangeEnd(aPackage.getRangeEnd());
        subscription.setStartDate(Instant.now());
        subscription.setEndDate(Instant.now().plus(aPackage.getDuration(), ChronoUnit.DAYS));

        return subscription;
    }

    @Transactional
    public SubscriptionDTO upgrade(Long farmId, Long subscriptionId, Long packageId) {
        Farm farm = ownershipService.getToWriteByFarmId(farmId);
        Subscription subscription = subscriptionRepository
            .findByIdAndFarm_IdAndRecordActivityIsTrueAndStatus_CodeIn(
                subscriptionId,
                farm.getId(),
                Collections.singletonList(SubscriptionStatusEnum.Active.value())
            )
            .orElseThrow(() -> new BadRequestException("not_found"));
        Package aPackage = packageService.isSuitableForUpgrade(subscription, packageId);

        //Lookup status = lookupService.getEntityByCodeAndCategory(SubscriptionStatusEnum.WaitingForPayment.value(), LookupCategory.SubscriptionStatus.value()); // TODO return after completing payment
        Lookup status = lookupService.getEntityByCodeAndCategory(
            SubscriptionStatusEnum.Active.value(),
            LookupCategory.SubscriptionStatus.value()
        ); // TODO remove after completing payment
        Lookup type = lookupService.getEntityByCodeAndCategory(
            InvoiceTypeEnum.SubscriptionUpgrade.value(),
            LookupCategory.InvoiceType.value()
        );

        long remainingDays = Duration.between(Instant.now(), subscription.getEndDate()).toDays() + 1;

        if (remainingDays > 365L) {
            remainingDays = 365L;
        }

        Double oldPackageCost = subscription.getaPackage().getCost();
        Double newPackageCost = aPackage.getCost();

        double oldPackageDailyPrice = oldPackageCost / subscription.getaPackage().getDuration();
        double newPackageDailyPrice = newPackageCost / aPackage.getDuration();

        double cost = (newPackageDailyPrice - oldPackageDailyPrice) * remainingDays;

        SubscriptionUpgradeRequest subscriptionUpgradeRequest = new SubscriptionUpgradeRequest();
        subscriptionUpgradeRequest.setFarm(farm);
        subscriptionUpgradeRequest.setSubscription(subscription);
        //subscriptionUpgradeRequest.setInvoice(invoiceService.create(farm, cost, type)); // TODO return after completing payment
        subscriptionUpgradeRequest.setaPackage(aPackage);
        subscriptionUpgradeRequest.setStatus(status);

        // TODO remove following 3 lines after completing payment
        subscription.setRangeStart(subscriptionUpgradeRequest.getaPackage().getRangeStart());
        subscription.setRangeEnd(subscriptionUpgradeRequest.getaPackage().getRangeEnd());
        subscription.setaPackage(subscriptionUpgradeRequest.getaPackage());

        subscription.getSubscriptionUpgradeRequests().add(subscriptionUpgradeRequest);

        return subscriptionMapper.toDtoWithInvoice(subscriptionRepository.save(subscription));
    }

    @Transactional
    public SubscriptionDTO cancel(Long farmId, Long subscriptionId) {
        Farm farm = ownershipService.getToWriteByFarmId(farmId);
        Subscription subscription = subscriptionRepository
            .findByIdAndFarm_IdAndRecordActivityIsTrueAndStatus_CodeIn(
                subscriptionId,
                farm.getId(),
                Arrays.asList(SubscriptionStatusEnum.WaitingForPayment.value(), SubscriptionStatusEnum.Active.value())
            )
            .orElseThrow(() -> new BadRequestException("not_found"));

        Lookup status = lookupService.getEntityByCodeAndCategory(
            SubscriptionStatusEnum.Cancelled.value(),
            LookupCategory.SubscriptionStatus.value()
        );

        if (subscription.getSubscriptionUpgradeRequests() != null && subscription.getSubscriptionUpgradeRequests().size() > 0) {
            List<SubscriptionUpgradeRequest> requests = subscription
                .getSubscriptionUpgradeRequests()
                .stream()
                .filter(it -> it.getStatus().getCode().equalsIgnoreCase(SubscriptionStatusEnum.WaitingForPayment.value()))
                .collect(Collectors.toList());

            requests.forEach(
                it -> {
                    invoiceService.markAsCancelled(it.getInvoice().getId());
                    it.setStatus(status);
                }
            );
        }

        if (subscription.getStatus().getCode().equalsIgnoreCase(SubscriptionStatusEnum.WaitingForPayment.value())) {
            invoiceService.markAsCancelled(subscription.getInvoice().getId());
        }

        subscription.setStatus(status);

        return subscriptionMapper.toDto(subscriptionRepository.save(subscription));
    }

    @Transactional
    public SubscriptionUpgradeRequestDTO cancelUpgrade(Long farmId, Long subscriptionUpgradeRequestId) {
        Farm farm = ownershipService.getToWriteByFarmId(farmId);

        SubscriptionUpgradeRequest subscriptionUpgradeRequest = subscriptionUpgradeRequestRepository
            .findByIdAndFarm_IdAndRecordActivityIsTrueAndStatus_Code(
                subscriptionUpgradeRequestId,
                farm.getId(),
                SubscriptionStatusEnum.WaitingForPayment.value()
            )
            .orElseThrow(() -> new BadRequestException("not_found"));

        Lookup status = lookupService.getEntityByCodeAndCategory(
            SubscriptionStatusEnum.Cancelled.value(),
            LookupCategory.SubscriptionStatus.value()
        );

        if (subscriptionUpgradeRequest.getStatus().getCode().equalsIgnoreCase(SubscriptionStatusEnum.WaitingForPayment.value())) {
            invoiceService.markAsCancelled(subscriptionUpgradeRequest.getInvoice().getId());
        }

        subscriptionUpgradeRequest.setStatus(status);

        return subscriptionUpgradeRequestMapper.toDto(subscriptionUpgradeRequestRepository.save(subscriptionUpgradeRequest));
    }

    @Transactional
    public void expireSubscriptions() {
        subscriptionRepository.expireSubscriptions();
    }

    private Specification<Subscription> createSpecification(SubscriptionCriteria criteria) {
        Specification<Subscription> specification = Specification.where(null);

        specification = specification.and(buildReferringEntitySpecification(criteria.getFarmId(), Subscription_.farm, Farm_.id));

        if (criteria.getStatusCode() != null) {
            specification =
                specification.and(buildReferringEntitySpecification(criteria.getStatusCode(), Subscription_.status, Lookup_.code));
        }

        if (!SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.ADMIN)) {
            BooleanFilter active = new BooleanFilter();
            active.setEquals(true);

            specification = specification.and(buildSpecification(active, Subscription_.recordActivity));
        }

        return specification;
    }

    private Boolean canRenew(Subscription subscription) {
        return (
            subscription != null &&
            subscription.getaPackage().getCanRenew() &&
            subscription.getaPackage().getRecordActivity() &&
            subscription
                .getEndDate()
                .isBefore(Instant.now().plus(applicationProperties.getSubscription().getCanRenewBeforeDays(), ChronoUnit.DAYS))
        );
    }
}
