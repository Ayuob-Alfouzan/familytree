package com.familytree.service.dto.familytree;

import tech.jhipster.service.filter.LongFilter;
import tech.jhipster.service.filter.StringFilter;

public class FamilyTreeTokenCriteria {

    private LongFilter familyTreeId;
    private StringFilter token;

    public StringFilter getToken() {
        return token;
    }

    public void setToken(StringFilter token) {
        this.token = token;
    }

    public LongFilter getFamilyTreeId() {
        return familyTreeId;
    }

    public void setFamilyTreeId(LongFilter familyTreeId) {
        this.familyTreeId = familyTreeId;
    }

    @Override
    public String toString() {
        return "FamilyTreeTokenCriteria{" + "familyTreeId=" + familyTreeId + ", token=" + token + '}';
    }
}
