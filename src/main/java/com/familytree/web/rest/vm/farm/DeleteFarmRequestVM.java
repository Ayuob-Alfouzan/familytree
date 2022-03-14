package com.familytree.web.rest.vm.farm;

import javax.validation.constraints.NotNull;

public class DeleteFarmRequestVM {

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
        return "DeleteFarmRequestVM{" + "id=" + id + '}';
    }
}
