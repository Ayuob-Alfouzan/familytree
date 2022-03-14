package com.familytree.service.dto.farm;

import com.familytree.service.dto.util.LookupDTO;
import java.util.List;

public class FarmDTO {

    private Long id;
    private LookupDTO type;
    private String nameAr;
    private String nameEn;
    private String location;
    private String vatNumber;
    private Boolean recordActivity;
    private List<FarmUserDTO> farmUsers;

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

    public List<FarmUserDTO> getFarmUsers() {
        return farmUsers;
    }

    public void setFarmUsers(List<FarmUserDTO> farmUsers) {
        this.farmUsers = farmUsers;
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
            "FarmDTO{" +
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
            ", vatNumber='" +
            vatNumber +
            '\'' +
            ", recordActivity=" +
            recordActivity +
            ", farmUsers=" +
            farmUsers +
            '}'
        );
    }
}
