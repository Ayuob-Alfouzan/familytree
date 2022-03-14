package com.familytree.web.rest.vm.account;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

public class VerifyActivationOTPVM {

    @NotNull
    @Email
    @Length(min = 5, max = 255)
    private String email;

    @NotNull
    @NotEmpty
    @Length(min = 6, max = 6)
    private String otp;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    @Override
    public String toString() {
        return "VerifyActivationOTPVM{" + "email='" + email + '\'' + ", otp='" + otp + '\'' + '}';
    }
}
