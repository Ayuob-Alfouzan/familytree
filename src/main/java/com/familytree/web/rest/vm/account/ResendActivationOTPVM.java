package com.familytree.web.rest.vm.account;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

public class ResendActivationOTPVM {

    @NotNull
    @Email
    @Length(min = 5, max = 255)
    private String email;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public String toString() {
        return "ResendActivationOTPVM{" + "email='" + email + '\'' + '}';
    }
}
