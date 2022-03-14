package com.familytree.web.rest.vm.account;

import javax.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

public class FindSuitableUserRequestVM {

    @NotNull
    private Long farmId;

    @NotNull
    @Length(min = 7)
    private String email;

    public Long getFarmId() {
        return farmId;
    }

    public void setFarmId(Long farmId) {
        this.farmId = farmId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public String toString() {
        return "FindSuitableUserRequestVM{" + "farmId=" + farmId + ", email='" + email + '\'' + '}';
    }
}
