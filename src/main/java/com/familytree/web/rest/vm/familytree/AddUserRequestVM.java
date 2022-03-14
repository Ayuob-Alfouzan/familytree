package com.familytree.web.rest.vm.familytree;

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
    private String familyTreeUserType;

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

    public String getFamilyTreeUserType() {
        return familyTreeUserType;
    }

    public void setFamilyTreeUserType(String familyTreeUserType) {
        this.familyTreeUserType = familyTreeUserType;
    }

    @Override
    public String toString() {
        return "AddUserRequestVM{" + "id=" + id + ", userEmail=" + userEmail + ", familyTreeUserType='" + familyTreeUserType + '\'' + '}';
    }
}
