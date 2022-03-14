package com.familytree.web.rest.vm.farm;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

public class AddUserRequestVM {

    @NotNull
    private Long id;

    @NotNull
    @Email
    private String userEmail;

    @NotNull
    @NotEmpty
    private String farmUserType;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getFarmUserType() {
        return farmUserType;
    }

    public void setFarmUserType(String farmUserType) {
        this.farmUserType = farmUserType;
    }

    @Override
    public String toString() {
        return "AddUserRequestVM{" + "id=" + id + ", userEmail=" + userEmail + ", farmUserType='" + farmUserType + '\'' + '}';
    }
}
