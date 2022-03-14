package com.familytree.web.rest.vm.farm;

import static com.familytree.config.Constants.VAT_NUMBER_REGEX;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import org.hibernate.validator.constraints.Length;

public class EditFarmRequestVM {

    @NotNull
    private Long id;

    @NotNull
    @Length(min = 1, max = 255)
    private String nameAr;

    @NotNull
    @Length(min = 1, max = 255)
    private String nameEn;

    @NotNull
    @Length(min = 1, max = 255)
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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
            "EditFarmRequestVM{" +
            "id=" +
            id +
            ", nameAr='" +
            nameAr +
            '\'' +
            ", nameEn='" +
            nameEn +
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
