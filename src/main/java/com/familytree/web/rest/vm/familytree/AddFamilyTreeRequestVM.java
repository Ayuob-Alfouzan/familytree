package com.familytree.web.rest.vm.familytree;

import static com.familytree.config.Constants.*;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import org.hibernate.validator.constraints.Length;

public class AddFamilyTreeRequestVM {

    @NotNull
    @Length(min = 1, max = 255)
    private String nameAr;

    @NotNull
    @NotEmpty
    private String type;

    public String getNameAr() {
        return nameAr;
    }

    public void setNameAr(String nameAr) {
        this.nameAr = nameAr;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "AddFamilyTreeRequestVM{" + "nameAr='" + nameAr + '\'' + ", type='" + type + '\'' + '}';
    }
}
