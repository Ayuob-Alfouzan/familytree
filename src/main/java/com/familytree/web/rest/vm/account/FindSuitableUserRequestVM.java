package com.familytree.web.rest.vm.account;

import javax.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

public class FindSuitableUserRequestVM {

    @NotNull
    private Long familyTreeId;

    @NotNull
    @Length(min = 7)
    private String email;

    public Long getFamilyTreeId() {
        return familyTreeId;
    }

    public void setFamilyTreeId(Long familyTreeId) {
        this.familyTreeId = familyTreeId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public String toString() {
        return "FindSuitableUserRequestVM{" +
            "familyTreeId=" + familyTreeId +
            ", email='" + email + '\'' +
            '}';
    }
}
