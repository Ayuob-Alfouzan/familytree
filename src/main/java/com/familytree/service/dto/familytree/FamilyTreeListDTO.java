package com.familytree.service.dto.familytree;

import com.familytree.service.dto.util.LookupDTO;

public class FamilyTreeListDTO {

    private Long id;
    private LookupDTO type;
    private String nameAr;
    private String nameEn;
    private String location;
    private Boolean recordActivity;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LookupDTO getType() {
        return type;
    }

    public void setType(LookupDTO type) {
        this.type = type;
    }

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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Boolean getRecordActivity() {
        return recordActivity;
    }

    public void setRecordActivity(Boolean recordActivity) {
        this.recordActivity = recordActivity;
    }

    @Override
    public String toString() {
        return (
            "FamilyTreeListDTO{" +
            "id=" +
            id +
            ", type=" +
            type +
            ", nameAr='" +
            nameAr +
            '\'' +
            ", nameEn='" +
            nameEn +
            '\'' +
            ", location='" +
            location +
            '\'' +
            ", recordActivity=" +
            recordActivity +
            '}'
        );
    }
}
