package com.familytree.service.dto.subscription;

import java.time.Instant;
import tech.jhipster.service.filter.LongFilter;
import tech.jhipster.service.filter.RangeFilter;
import tech.jhipster.service.filter.StringFilter;

public class InvoiceCriteria {

    private LongFilter farmId;
    private StringFilter statusCode;
    private LongFilter invoiceNumber;
    private RangeFilter<Instant> creationDate;

    public LongFilter getFarmId() {
        return farmId;
    }

    public void setFarmId(LongFilter farmId) {
        this.farmId = farmId;
    }

    public StringFilter getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(StringFilter statusCode) {
        this.statusCode = statusCode;
    }

    public LongFilter getInvoiceNumber() {
        return invoiceNumber;
    }

    public void setInvoiceNumber(LongFilter invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }

    public RangeFilter<Instant> getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(RangeFilter<Instant> creationDate) {
        this.creationDate = creationDate;
    }

    @Override
    public String toString() {
        return (
            "InvoiceCriteria{" +
            "farmId=" +
            farmId +
            ", statusCode=" +
            statusCode +
            ", invoiceNumber=" +
            invoiceNumber +
            ", creationDate=" +
            creationDate +
            '}'
        );
    }
}
