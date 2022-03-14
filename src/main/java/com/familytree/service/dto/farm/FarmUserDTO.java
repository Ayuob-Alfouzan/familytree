package com.familytree.service.dto.farm;

import com.familytree.service.dto.util.LookupDTO;

public class FarmUserDTO {

    private Long id;
    private Long farmId;
    private String farmNameAr;
    private String farmNameEn;
    private LookupDTO farmType;
    private Long userId;
    private String userFirstName;
    private String userLastName;
    private String userEmail;
    private LookupDTO type;
    private Boolean recordActivity;

    public LookupDTO getFarmType() {
        return farmType;
    }

    public void setFarmType(LookupDTO farmType) {
        this.farmType = farmType;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getFarmId() {
        return farmId;
    }

    public void setFarmId(Long farmId) {
        this.farmId = farmId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LookupDTO getType() {
        return type;
    }

    public void setType(LookupDTO type) {
        this.type = type;
    }

    public Boolean getRecordActivity() {
        return recordActivity;
    }

    public void setRecordActivity(Boolean recordActivity) {
        this.recordActivity = recordActivity;
    }

    public String getFarmNameAr() {
        return farmNameAr;
    }

    public void setFarmNameAr(String farmNameAr) {
        this.farmNameAr = farmNameAr;
    }

    public String getFarmNameEn() {
        return farmNameEn;
    }

    public void setFarmNameEn(String farmNameEn) {
        this.farmNameEn = farmNameEn;
    }

    public String getUserFirstName() {
        return userFirstName;
    }

    public void setUserFirstName(String userFirstName) {
        this.userFirstName = userFirstName;
    }

    public String getUserLastName() {
        return userLastName;
    }

    public void setUserLastName(String userLastName) {
        this.userLastName = userLastName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    @Override
    public String toString() {
        return (
            "FarmUserDTO{" +
            "id=" +
            id +
            ", farmId=" +
            farmId +
            ", farmNameAr='" +
            farmNameAr +
            '\'' +
            ", farmNameEn='" +
            farmNameEn +
            '\'' +
            ", farmType='" +
            farmType +
            '\'' +
            ", userId=" +
            userId +
            ", userFirstName='" +
            userFirstName +
            '\'' +
            ", userLastName='" +
            userLastName +
            '\'' +
            ", userEmail='" +
            userEmail +
            '\'' +
            ", type=" +
            type +
            ", recordActivity=" +
            recordActivity +
            '}'
        );
    }
}
