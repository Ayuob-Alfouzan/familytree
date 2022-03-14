package com.familytree.service.dto.farm;

import tech.jhipster.service.filter.StringFilter;

public class FarmCriteria {

    private StringFilter name;

    public StringFilter getName() {
        return name;
    }

    public void setName(StringFilter name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "FarmCriteria{" + "name=" + name + '}';
    }
}
