package com.familytree.service.dto.financialTransaction;

import java.time.Instant;

import tech.jhipster.service.filter.LongFilter;
import tech.jhipster.service.filter.RangeFilter;
import tech.jhipster.service.filter.StringFilter;

public class FinancialTransactionCriteria {

    private LongFilter farmId;
    private StringFilter type;
    private StringFilter specificType;
    private RangeFilter<Instant> createdDate;

    public LongFilter getFarmId() {
        return farmId;
    }

    public void setFarmId(LongFilter farmId) {
        this.farmId = farmId;
    }

    public StringFilter getType() {
        return type;
    }

    public void setType(StringFilter type) {
        this.type = type;
    }

    public RangeFilter<Instant> getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(RangeFilter<Instant> createdDate) {
        this.createdDate = createdDate;
    }

    public StringFilter getSpecificType() {
        return specificType;
    }

    public void setSpecificType(StringFilter specificType) {
        this.specificType = specificType;
    }

    @Override
    public String toString() {
        return (
            "FinancialTransactionCriteria{" +
            "farmId=" +
            farmId +
            ", type=" +
            type +
            ", specificType=" +
            specificType +
            ", createdDate=" +
            createdDate +
            '}'
        );
    }
}
