package com.familytree.web.rest.vm.account;

import static com.familytree.config.Constants.LANGUAGE_REGEX;
import static com.familytree.config.Constants.PASSWORD_REGEX;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import org.hibernate.validator.constraints.Length;

public class RegisterVM {

    @NotNull
    @Length(min = 1, max = 15)
    private String firstName;

    @NotNull
    @Length(min = 1, max = 15)
    private String lastName;

    @NotNull
    @Email
    @Length(max = 255)
    private String email;

    @NotNull
    @NotEmpty
    @Length(min = 8)
    @Pattern(regexp = PASSWORD_REGEX)
    private String password;

    @NotNull
    @NotEmpty
    @Pattern(regexp = LANGUAGE_REGEX)
    private String language;

    @NotNull
    @NotEmpty
    private String captchaResponse;

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getCaptchaResponse() {
        return captchaResponse;
    }

    public void setCaptchaResponse(String captchaResponse) {
        this.captchaResponse = captchaResponse;
    }

    @Override
    public String toString() {
        return (
            "RegisterVM{" +
            "firstName='" +
            firstName +
            '\'' +
            ", lastName='" +
            lastName +
            '\'' +
            ", email='" +
            email +
            '\'' +
            ", password='" +
            password +
            '\'' +
            ", language='" +
            language +
            '\'' +
            ", captchaResponse='" +
            captchaResponse +
            '\'' +
            '}'
        );
    }
}
