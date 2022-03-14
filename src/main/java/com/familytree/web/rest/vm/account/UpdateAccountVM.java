package com.familytree.web.rest.vm.account;

import com.familytree.config.Constants;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import org.hibernate.validator.constraints.Length;

public class UpdateAccountVM {

    @NotNull
    @Length(min = 1, max = 15)
    private String firstName;

    @NotNull
    @Length(min = 1, max = 15)
    private String lastName;

    @NotNull
    @Pattern(regexp = Constants.LANGUAGE_REGEX)
    private String langKey;

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

    public String getLangKey() {
        return langKey;
    }

    public void setLangKey(String langKey) {
        this.langKey = langKey;
    }

    @Override
    public String toString() {
        return (
            "UpdateAccountVM{" + "firstName='" + firstName + '\'' + ", lastName='" + lastName + '\'' + ", langKey='" + langKey + '\'' + '}'
        );
    }
}
