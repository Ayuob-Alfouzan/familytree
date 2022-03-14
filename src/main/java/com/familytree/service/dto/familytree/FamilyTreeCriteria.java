package com.familytree.service.dto.familytree;

import tech.jhipster.service.filter.StringFilter;

public class FamilyTreeCriteria {

    private StringFilter name;

    public StringFilter getName() {
        return name;
    }

    public void setName(StringFilter name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "FamilyTreeCriteria{" + "name=" + name + '}';
    }
}
