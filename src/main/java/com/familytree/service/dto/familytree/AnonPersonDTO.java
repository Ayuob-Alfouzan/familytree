package com.familytree.service.dto.familytree;

import com.familytree.domain.enumeration.Gender;
import com.familytree.domain.enumeration.LifeStatus;
import java.time.Instant;
import java.util.List;

public class AnonPersonDTO {

    private Long id;
    private Long familyTreeId;
    private String name;
    private Gender gender;
    private Instant dateOfBirth;
    private Boolean recordActivity;
    private LifeStatus status;
    private List<AnonPersonDTO> children;
    private List<AnonPersonDTO> wives;

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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public Boolean getRecordActivity() {
        return recordActivity;
    }

    public void setRecordActivity(Boolean recordActivity) {
        this.recordActivity = recordActivity;
    }

    public LifeStatus getStatus() {
        return status;
    }

    public void setStatus(LifeStatus status) {
        this.status = status;
    }

    public List<AnonPersonDTO> getChildren() {
        return children;
    }

    public void setChildren(List<AnonPersonDTO> children) {
        this.children = children;
    }

    public List<AnonPersonDTO> getWives() {
        return wives;
    }

    public void setWives(List<AnonPersonDTO> wives) {
        this.wives = wives;
    }

    public Instant getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(Instant dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    @Override
    public String toString() {
        return (
            "AnonPersonDTO{" +
            "id=" +
            id +
            ", familyTreeId=" +
            familyTreeId +
            ", name='" +
            name +
            '\'' +
            ", gender=" +
            gender +
            ", dateOfBirth=" +
            dateOfBirth +
            ", recordActivity=" +
            recordActivity +
            ", status=" +
            status +
            ", children=" +
            children +
            ", wives=" +
            wives +
            '}'
        );
    }
}
