package com.familytree.web.rest.vm.familytree;

import javax.validation.constraints.NotNull;

public class RemoveUserRequestVM {

    @NotNull
    private Long id;

    @NotNull
    private Long userId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    @Override
    public String toString() {
        return "RemoveUserRequestVM{" + "id=" + id + ", userId=" + userId + '}';
    }
}
