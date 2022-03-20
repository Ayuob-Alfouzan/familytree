package com.familytree.service.dto.familytree;

import com.familytree.service.dto.util.LookupDTO;

public class FamilyTreeTokenDTO {

    private Long id;
    private Long familyTreeId;
    private Long userId;
    private String token;
    private String url;
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

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Boolean getRecordActivity() {
        return recordActivity;
    }

    public void setRecordActivity(Boolean recordActivity) {
        this.recordActivity = recordActivity;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    @Override
    public String toString() {
        return (
            "FamilyTreeTokenDTO{" +
            "id=" +
            id +
            ", familyTreeId=" +
            familyTreeId +
            ", userId=" +
            userId +
            ", token='" +
            token +
            '\'' +
            ", url='" +
            url +
            '\'' +
            ", recordActivity=" +
            recordActivity +
            '}'
        );
    }
}
