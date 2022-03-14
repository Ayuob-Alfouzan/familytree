package com.familytree.web.rest.vm.account;

import static com.familytree.config.Constants.PASSWORD_REGEX;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import org.hibernate.validator.constraints.Length;

public class ResetPasswordVM {

    @NotNull
    @Email
    @Length(min = 5, max = 255)
    private String email;

    @NotNull
    @NotEmpty
    @Length(min = 8)
    @Pattern(regexp = PASSWORD_REGEX)
    private String password;

    @NotNull
    @NotEmpty
    @Length(min = 4, max = 6)
    private String otp;

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

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    @Override
    public String toString() {
        return "ResetPasswordVM{" + "email='" + email + '\'' + ", otp='" + otp + '\'' + '}';
    }
}
