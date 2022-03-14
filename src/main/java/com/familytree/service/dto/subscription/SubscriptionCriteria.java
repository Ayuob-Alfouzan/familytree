package com.familytree.service.dto.subscription;

import tech.jhipster.service.filter.LongFilter;
import tech.jhipster.service.filter.StringFilter;

public class SubscriptionCriteria {

    private LongFilter farmId;
    private StringFilter statusCode;

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

    @Override
    public String toString() {
        return "SubscriptionCriteria{" + "farmId=" + farmId + ", statusCode=" + statusCode + '}';
    }
}
