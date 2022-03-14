package com.familytree.service.dto.subscription;

import java.time.Instant;
import tech.jhipster.service.filter.LongFilter;
import tech.jhipster.service.filter.RangeFilter;
import tech.jhipster.service.filter.StringFilter;

public class InvoiceCriteria {

    private LongFilter familyTreeId;
    private StringFilter statusCode;
    private LongFilter invoiceNumber;
    private RangeFilter<Instant> creationDate;

    public LongFilter getFamilyTreeId() {
        return familyTreeId;
    }

    public void setFamilyTreeId(LongFilter familyTreeId) {
        this.familyTreeId = familyTreeId;
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
        return "InvoiceCriteria{" +
            "familyTreeId=" + familyTreeId +
            ", statusCode=" + statusCode +
            ", invoiceNumber=" + invoiceNumber +
            ", creationDate=" + creationDate +
            '}';
    }
}
