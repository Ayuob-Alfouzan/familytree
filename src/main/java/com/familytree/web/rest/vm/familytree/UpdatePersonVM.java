package com.familytree.web.rest.vm.familytree;

import com.familytree.domain.enumeration.Gender;
import com.familytree.domain.enumeration.LifeStatus;
import javax.validation.constraints.NotNull;

public class UpdatePersonVM {

    @NotNull
    private Long id;

    @NotNull
    private String name;

    @NotNull
    private String dateOfBirth;

    @NotNull
    private Gender gender;

    @NotNull
    private LifeStatus status;

    private String description;
    private String mobileNumber;
    private String job;
    private String imageUrl;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(String dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
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

    @Override
    public String toString() {
        return (
            "UpdatePersonVM{" +
            "id=" +
            id +
            ", name='" +
            name +
            '\'' +
            ", dateOfBirth='" +
            dateOfBirth +
            '\'' +
            ", gender=" +
            gender +
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
            '}'
        );
    }
}
