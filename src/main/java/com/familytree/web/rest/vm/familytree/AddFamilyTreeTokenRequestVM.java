package com.familytree.web.rest.vm.familytree;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

public class AddFamilyTreeTokenRequestVM {

    @NotNull
    private Long familyTreeId;

    public Long getFamilyTreeId() {
        return familyTreeId;
    }

    public void setFamilyTreeId(Long familyTreeId) {
        this.familyTreeId = familyTreeId;
    }

    @Override
    public String toString() {
        return "AddFamilyTreeTokenRequestVM{" + "familyTreeId=" + familyTreeId + '}';
    }
}
