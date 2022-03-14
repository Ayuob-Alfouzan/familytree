package com.familytree.web.rest.vm.subscription;

import java.time.Instant;
import javax.validation.constraints.NotNull;

public class MarkInvoiceAsPaidRequestVM {

    @NotNull
    private Long invoiceId;

    @NotNull
    private Instant paymentDate;

    public Long getInvoiceId() {
        return invoiceId;
    }

    public void setInvoiceId(Long invoiceId) {
        this.invoiceId = invoiceId;
    }

    public Instant getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(Instant paymentDate) {
        this.paymentDate = paymentDate;
    }

    @Override
    public String toString() {
        return "MarkInvoiceAsPaidRequestVM{" + "invoiceId=" + invoiceId + ", paymentDate=" + paymentDate + '}';
    }
}
