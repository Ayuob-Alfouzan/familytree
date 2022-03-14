package com.familytree.web.rest.vm.account;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * View Model object for storing a user's credentials.
 */
public class LoginVM {

    @NotNull
    @Size(max = 50)
    @Email
    private String email;

    @NotNull
    @NotEmpty
    private String password;

    private Boolean rememberMe;

    @NotNull
    @NotEmpty
    private String captchaResponse;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Boolean getRememberMe() {
        return rememberMe;
    }

    public void setRememberMe(Boolean rememberMe) {
        this.rememberMe = rememberMe;
    }

    public String getCaptchaResponse() {
        return captchaResponse;
    }

    public void setCaptchaResponse(String captchaResponse) {
        this.captchaResponse = captchaResponse;
    }

    @Override
    public String toString() {
        return "LoginVM{" + "email='" + email + '\'' + ", rememberMe=" + rememberMe + '}';
    }
}
