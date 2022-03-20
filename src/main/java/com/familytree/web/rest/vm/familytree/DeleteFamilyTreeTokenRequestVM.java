package com.familytree.web.rest.vm.familytree;

import javax.validation.constraints.NotNull;

public class DeleteFamilyTreeTokenRequestVM {

    @NotNull
    private Long familyTreeId;

    @NotNull
    private Long id;

    public Long getFamilyTreeId() {
        return familyTreeId;
    }

    public void setFamilyTreeId(Long familyTreeId) {
        this.familyTreeId = familyTreeId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public String toString() {
        return "DeleteFamilyTreeTokenRequestVM{" + "familyTreeId=" + familyTreeId + ", id=" + id + '}';
    }
}
