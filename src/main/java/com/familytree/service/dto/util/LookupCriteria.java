package com.familytree.service.dto.util;

import tech.jhipster.service.filter.BooleanFilter;
import tech.jhipster.service.filter.StringFilter;

public class LookupCriteria {

    private StringFilter category;
    private StringFilter code;
    private StringFilter value;
    private BooleanFilter recordActivity;

    public StringFilter getCategory() {
        return category;
    }

    public void setCategory(StringFilter category) {
        this.category = category;
    }

    public StringFilter getCode() {
        return code;
    }

    public void setCode(StringFilter code) {
        this.code = code;
    }

    public StringFilter getValue() {
        return value;
    }

    public void setValue(StringFilter value) {
        this.value = value;
    }

    public BooleanFilter getRecordActivity() {
        return recordActivity;
    }

    public void setRecordActivity(BooleanFilter recordActivity) {
        this.recordActivity = recordActivity;
    }

    @Override
    public String toString() {
        return (
            "LookupCriteria{" + "category=" + category + ", code=" + code + ", value=" + value + ", recordActivity=" + recordActivity + '}'
        );
    }
}
