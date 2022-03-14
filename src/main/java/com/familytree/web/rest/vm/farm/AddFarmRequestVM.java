package com.familytree.web.rest.vm.farm;

import static com.familytree.config.Constants.*;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import org.hibernate.validator.constraints.Length;

public class AddFarmRequestVM {

    @NotNull
    @Length(min = 1, max = 255)
    private String nameAr;

    @NotNull
    @Length(min = 1, max = 255)
    private String nameEn;

    @NotNull
    @NotEmpty
    private String type;

    @NotNull
    @Length(min = 1, max = 100)
    private String location;

    @Pattern(regexp = VAT_NUMBER_REGEX)
    private String vatNumber;

    public String getNameAr() {
        return nameAr;
    }

    public void setNameAr(String nameAr) {
        this.nameAr = nameAr;
    }

    public String getNameEn() {
        return nameEn;
    }

    public void setNameEn(String nameEn) {
        this.nameEn = nameEn;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getVatNumber() {
        return vatNumber;
    }

    public void setVatNumber(String vatNumber) {
        this.vatNumber = vatNumber;
    }

    @Override
    public String toString() {
        return (
            "AddFarmRequestVM{" +
            "nameAr='" +
            nameAr +
            '\'' +
            ", nameEn='" +
            nameEn +
            '\'' +
            ", type='" +
            type +
            '\'' +
            ", location='" +
            location +
            '\'' +
            ", vatNumber=" +
            vatNumber +
            '}'
        );
    }
}
