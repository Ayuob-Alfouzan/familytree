package com.familytree.web.rest.vm.familytree;

import javax.validation.constraints.NotNull;

public class DeleteFamilyTreeRequestVM {

    @NotNull
    private Long id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public String toString() {
        return "DeleteFamilyTreeRequestVM{" + "id=" + id + '}';
    }
}
