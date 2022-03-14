package com.familytree.web.rest.resource.subscription;

import com.familytree.security.AuthoritiesConstants;
import com.familytree.service.dto.subscription.InvoiceCriteria;
import com.familytree.service.dto.subscription.InvoiceDTO;
import com.familytree.service.subscription.InvoiceService;
import com.familytree.web.rest.vm.subscription.MarkInvoiceAsPaidRequestVM;
import java.io.IOException;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invoice")
public class InvoiceResource {

    private final Logger log = LoggerFactory.getLogger(InvoiceResource.class);

    private final InvoiceService invoiceService;

    public InvoiceResource(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @PostMapping("/list")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<Page<InvoiceDTO>> list(@RequestBody InvoiceCriteria invoiceCriteria, Pageable pageable) {
        return ResponseEntity.ok(invoiceService.list(invoiceCriteria, pageable));
    }

    @GetMapping("/get/{farmId}/{invoiceId}")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<InvoiceDTO> get(@PathVariable Long farmId, @PathVariable Long invoiceId) {
        return ResponseEntity.ok(invoiceService.get(farmId, invoiceId));
    }

    @GetMapping("/print/{farmId}/{invoiceId}")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public void print(@PathVariable("farmId") Long farmId, @PathVariable("invoiceId") Long invoiceId, HttpServletResponse response)
        throws IOException {
        byte[] pdf = invoiceService.print(farmId, invoiceId);

        response.setHeader("Content-Type", "application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=invoice-" + invoiceId + ".pdf");

        response.getOutputStream().write(pdf);
    }

    @PostMapping("/mark-as-paid")
    public void markUsPaid(@Valid @RequestBody MarkInvoiceAsPaidRequestVM requestVM) {
        invoiceService.markAsPaid(requestVM.getInvoiceId(), requestVM.getPaymentDate());
    }
}
