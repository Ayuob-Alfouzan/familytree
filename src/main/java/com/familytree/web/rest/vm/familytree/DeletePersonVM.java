package com.familytree.web.rest.vm.familytree;

import javax.validation.constraints.NotNull;

public class DeletePersonVM {

    @NotNull
    private Long familyTreeId;

    @NotNull
    private Long id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getFamilyTreeId() {
        return familyTreeId;
    }

    public void setFamilyTreeId(Long familyTreeId) {
        this.familyTreeId = familyTreeId;
    }

    @Override
    public String toString() {
        return "DeletePersonVM{" + "familyTreeId=" + familyTreeId + ", id=" + id + '}';
    }
}
