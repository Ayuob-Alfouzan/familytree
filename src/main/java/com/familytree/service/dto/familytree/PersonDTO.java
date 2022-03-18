package com.familytree.service.dto.familytree;

import com.familytree.domain.enumeration.Gender;
import com.familytree.domain.enumeration.LifeStatus;
import com.familytree.domain.familytree.Person;
import java.time.Instant;
import java.util.List;
import java.util.Set;
import javax.validation.constraints.NotNull;
import org.springframework.data.neo4j.core.schema.Relationship;

public class PersonDTO {

    private Long id;
    private Long familyTreeId;
    private String name;
    private Instant dateOfBirth;
    private Gender gender;
    private Boolean recordActivity;
    private LifeStatus status;
    private String description;
    private String mobileNumber;
    private String job;
    private String imageUrl;
    private List<Person> children;
    private List<Person> wives;

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

    public Instant getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(Instant dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getJob() {
        return job;
    }

    public void setJob(String job) {
        this.job = job;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public List<Person> getChildren() {
        return children;
    }

    public void setChildren(List<Person> children) {
        this.children = children;
    }

    public List<Person> getWives() {
        return wives;
    }

    public void setWives(List<Person> wives) {
        this.wives = wives;
    }

    @Override
    public String toString() {
        return (
            "PersonDTO{" +
            "id=" +
            id +
            ", familyTreeId=" +
            familyTreeId +
            ", name='" +
            name +
            '\'' +
            ", dateOfBirth='" +
            dateOfBirth +
            '\'' +
            ", gender=" +
            gender +
            ", recordActivity=" +
            recordActivity +
            ", status=" +
            status +
            ", description='" +
            description +
            '\'' +
            ", mobileNumber='" +
            mobileNumber +
            '\'' +
            ", job='" +
            job +
            '\'' +
            ", imageUrl='" +
            imageUrl +
            '\'' +
            ", children=" +
            children +
            ", wives=" +
            wives +
            '}'
        );
    }
}
