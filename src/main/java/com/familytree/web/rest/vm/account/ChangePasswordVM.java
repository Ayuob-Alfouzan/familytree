package com.familytree.web.rest.vm.account;

import static com.familytree.config.Constants.PASSWORD_REGEX;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import org.hibernate.validator.constraints.Length;

public class ChangePasswordVM {

    @NotNull
    @NotEmpty
    @Length(min = 8)
    @Pattern(regexp = PASSWORD_REGEX)
    private String password;

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "ChangePasswordVM{}";
    }
}
