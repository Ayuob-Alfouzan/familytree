package com.familytree.web.rest.vm.familytree;

import javax.validation.constraints.NotNull;

public class DeletePersonVM {

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
        return "DeletePersonVM{" + "id=" + id + '}';
    }
}
