package com.familytree.service.dto.subscription;

import tech.jhipster.service.filter.LongFilter;
import tech.jhipster.service.filter.StringFilter;

public class SubscriptionCriteria {

    private LongFilter familyTreeId;
    private StringFilter statusCode;

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

    @Override
    public String toString() {
        return "SubscriptionCriteria{" + "familyTreeId=" + familyTreeId + ", statusCode=" + statusCode + '}';
    }
}
