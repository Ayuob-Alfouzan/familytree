package com.familytree.service.dto.familytree;

import com.familytree.service.dto.util.LookupDTO;

public class FamilyTreeUserDTO {

    private Long id;
    private Long familyTreeId;
    private String familyTreeNameAr;
    private LookupDTO familyTreeType;
    private Long userId;
    private String userFirstName;
    private String userLastName;
    private String userEmail;
    private LookupDTO type;
    private Boolean recordActivity;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getFamilyTreeId() {
        return familyTreeId;
    }

    public void setFamilyTreeId(Long familyTreeId) {
        this.familyTreeId = familyTreeId;
    }

    public String getFamilyTreeNameAr() {
        return familyTreeNameAr;
    }

    public void setFamilyTreeNameAr(String familyTreeNameAr) {
        this.familyTreeNameAr = familyTreeNameAr;
    }

    public LookupDTO getFamilyTreeType() {
        return familyTreeType;
    }

    public void setFamilyTreeType(LookupDTO familyTreeType) {
        this.familyTreeType = familyTreeType;
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
        return "FamilyTreeUserDTO{" +
            "id=" + id +
            ", familyTreeId=" + familyTreeId +
            ", familyTreeNameAr='" + familyTreeNameAr + '\'' +
            ", familyTreeType=" + familyTreeType +
            ", userId=" + userId +
            ", userFirstName='" + userFirstName + '\'' +
            ", userLastName='" + userLastName + '\'' +
            ", userEmail='" + userEmail + '\'' +
            ", type=" + type +
            ", recordActivity=" + recordActivity +
            '}';
    }
}
