package com.familytree.service.dto.subscription;

import com.familytree.service.dto.util.LookupDTO;

public class PackageDTO {

    private Long id;
    private LookupDTO familyTreeType;
    private String nameAr;
    private String nameEn;
    private String descriptionAr;
    private String descriptionEn;
    private Long rangeStart;
    private Long rangeEnd;
    private Double cost;
    private Long duration;
    private Boolean recordActivity;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LookupDTO getFamilyTreeType() {
        return familyTreeType;
    }

    public void setFamilyTreeType(LookupDTO familyTreeType) {
        this.familyTreeType = familyTreeType;
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

    public String getDescriptionAr() {
        return descriptionAr;
    }

    public void setDescriptionAr(String descriptionAr) {
        this.descriptionAr = descriptionAr;
    }

    public String getDescriptionEn() {
        return descriptionEn;
    }

    public void setDescriptionEn(String descriptionEn) {
        this.descriptionEn = descriptionEn;
    }

    public Long getRangeStart() {
        return rangeStart;
    }

    public void setRangeStart(Long rangeStart) {
        this.rangeStart = rangeStart;
    }

    public Long getRangeEnd() {
        return rangeEnd;
    }

    public void setRangeEnd(Long rangeEnd) {
        this.rangeEnd = rangeEnd;
    }

    public Double getCost() {
        return cost;
    }

    public void setCost(Double cost) {
        this.cost = cost;
    }

    public Long getDuration() {
        return duration;
    }

    public void setDuration(Long duration) {
        this.duration = duration;
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
            "PackageDTO{" +
            "id=" +
            id +
            ", familyTreeType=" +
            familyTreeType +
            ", nameAr='" +
            nameAr +
            '\'' +
            ", nameEn='" +
            nameEn +
            '\'' +
            ", descriptionAr='" +
            descriptionAr +
            '\'' +
            ", descriptionEn='" +
            descriptionEn +
            '\'' +
            ", rangeStart=" +
            rangeStart +
            ", rangeEnd=" +
            rangeEnd +
            ", cost=" +
            cost +
            ", duration=" +
            duration +
            ", recordActivity=" +
            recordActivity +
            '}'
        );
    }
}
