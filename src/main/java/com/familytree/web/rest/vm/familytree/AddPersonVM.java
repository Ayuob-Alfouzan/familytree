package com.familytree.web.rest.vm.familytree;

import com.familytree.domain.enumeration.Gender;
import com.familytree.domain.enumeration.LifeStatus;
import com.familytree.domain.familytree.Person;
import javax.validation.constraints.NotNull;

public class AddPersonVM {

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

    private Long headOfHousehold;
    private Long spouse;

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

    public Person toEntity() {
        Person person = new Person();
        person.setFamilyTreeId(1L);
        person.setName(getName());
        person.setDateOfBirth(getDateOfBirth());
        person.setGender(getGender());
        person.setStatus(getStatus());
        person.setDescription(getDescription());
        person.setMobileNumber(getMobileNumber());
        person.setJob(getJob());
        person.setImageUrl(getImageUrl());
        return person;
    }

    public Long getHeadOfHousehold() {
        return headOfHousehold;
    }

    public void setHeadOfHousehold(Long headOfHousehold) {
        this.headOfHousehold = headOfHousehold;
    }

    public Long getSpouse() {
        return spouse;
    }

    public void setSpouse(Long spouse) {
        this.spouse = spouse;
    }

    @Override
    public String toString() {
        return (
            "AddPersonVM{" +
            "name='" +
            name +
            '\'' +
            ", dateOfBirth=" +
            dateOfBirth +
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
            ", headOfHousehold=" +
            headOfHousehold +
            ", spouse=" +
            spouse +
            '}'
        );
    }
}
