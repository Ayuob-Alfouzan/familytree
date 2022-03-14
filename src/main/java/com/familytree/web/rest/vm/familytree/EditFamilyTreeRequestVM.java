package com.familytree.web.rest.vm.familytree;

import static com.familytree.config.Constants.VAT_NUMBER_REGEX;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import org.hibernate.validator.constraints.Length;

public class EditFamilyTreeRequestVM {

    @NotNull
    private Long id;

    @NotNull
    @Length(min = 1, max = 255)
    private String nameAr;

    public String getNameAr() {
        return nameAr;
    }

    public void setNameAr(String nameAr) {
        this.nameAr = nameAr;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public String toString() {
        return "EditFamilyTreeRequestVM{" +
            "id=" + id +
            ", nameAr='" + nameAr + '\'' +
            '}';
    }
}
