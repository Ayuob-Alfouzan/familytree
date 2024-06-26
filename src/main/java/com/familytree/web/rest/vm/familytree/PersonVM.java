package com.familytree.web.rest.vm.familytree;

import com.familytree.domain.enumeration.Gender;
import com.familytree.domain.enumeration.LifeStatus;
import com.familytree.domain.familytree.Person;
import java.time.Instant;
import javax.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

public class PersonVM {

    @NotNull
    @Length(min = 1, max = 20)
    private String name;

    @NotNull
    private Instant dateOfBirth;

    @NotNull
    private Gender gender;

    @NotNull
    private LifeStatus status;

    @Length(max = 30)
    private String description;

    @Length(max = 10)
    private String mobileNumber;

    @Length(max = 30)
    private String job;

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

    @Override
    public String toString() {
        return (
            "PersonVM{" +
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
            '}'
        );
    }
}
