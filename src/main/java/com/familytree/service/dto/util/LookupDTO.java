package com.familytree.service.dto.util;

import com.familytree.domain.util.Lookup;

public class LookupDTO {

    private String code;
    private String ar;
    private String en;
    private String ur;
    private String category;
    private Boolean recordActivity;

    public LookupDTO() {}

    public LookupDTO(Lookup lookup) {
        this.code = lookup.getCode();
        this.ar = lookup.getAr();
        this.en = lookup.getEn();
        this.ur = lookup.getUr();
        this.category = lookup.getCategory();
    }

    public LookupDTO(String code, String ar, String en, String ur, String category) {
        this.code = code;
        this.ar = ar;
        this.en = en;
        this.ur = ur;
        this.category = category;
    }

    public Boolean getRecordActivity() {
        return recordActivity;
    }

    public void setRecordActivity(Boolean recordActivity) {
        this.recordActivity = recordActivity;
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getUr() {
        return ur;
    }

    public void setUr(String ur) {
        this.ur = ur;
    }

    @Override
    public String toString() {
        return (
            "LookupDTO{" +
            "code='" +
            code +
            '\'' +
            ", ar='" +
            ar +
            '\'' +
            ", en='" +
            en +
            '\'' +
            ", ur='" +
            ur +
            '\'' +
            ", category='" +
            category +
            '\'' +
            ", recordActivity=" +
            recordActivity +
            '}'
        );
    }
}
