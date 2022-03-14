package com.familytree.web.rest.vm.account;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

public class ForgotPasswordVM {

    @NotNull
    @Email
    @Length(max = 255)
    private String email;

    @NotNull
    @NotEmpty
    private String captchaResponse;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCaptchaResponse() {
        return captchaResponse;
    }

    public void setCaptchaResponse(String captchaResponse) {
        this.captchaResponse = captchaResponse;
    }

    @Override
    public String toString() {
        return "ForgotPasswordVM{" + "email='" + email + '\'' + ", captchaResponse='" + captchaResponse + '\'' + '}';
    }
}
