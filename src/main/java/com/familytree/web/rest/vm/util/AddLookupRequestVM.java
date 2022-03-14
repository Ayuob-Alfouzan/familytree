package com.familytree.web.rest.vm.util;

import javax.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

public class AddLookupRequestVM {

    @NotNull
    private String category;

    @NotNull
    @Length(min = 1, max = 50)
    private String code;

    @NotNull
    @Length(min = 1, max = 255)
    private String ar;

    @NotNull
    @Length(min = 1, max = 255)
    private String en;

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getAr() {
        return ar;
    }

    public void setAr(String ar) {
        this.ar = ar;
    }

    public String getEn() {
        return en;
    }

    public void setEn(String en) {
        this.en = en;
    }

    @Override
    public String toString() {
        return (
            "AddLookupRequestVM{" +
            "category='" +
            category +
            '\'' +
            ", code='" +
            code +
            '\'' +
            ", ar='" +
            ar +
            '\'' +
            ", en='" +
            en +
            '\'' +
            '}'
        );
    }
}
