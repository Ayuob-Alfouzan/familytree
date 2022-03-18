package com.familytree.domain.familytree;

import com.familytree.domain.enumeration.Gender;
import com.familytree.domain.enumeration.LifeStatus;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import javax.validation.constraints.NotNull;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

@Node
public class Person {

    @Id
    @GeneratedValue
    private Long id;

    @NotNull
    private Long familyTreeId;

    @NotNull
    private String name;

    @NotNull
    private Instant dateOfBirth;

    @NotNull
    private Gender gender;

    @NotNull
    private Boolean recordActivity = true;

    @NotNull
    private LifeStatus status;

    private String description;
    private String mobileNumber;
    private String job;
    private String imageUrl;

    @Relationship(type = "CHILDREN", direction = Relationship.Direction.OUTGOING)
    private List<Person> children = new ArrayList<>();

    @Relationship(type = "WIVES", direction = Relationship.Direction.OUTGOING)
    private List<Person> wives = new ArrayList<>();

    public Person() {}

    public List<Person> getWives() {
        return wives;
    }

    public void setWives(List<Person> wives) {
        this.wives = wives;
    }

    public List<Person> getChildren() {
        return children;
    }

    public void setChildren(List<Person> children) {
        this.children = children;
    }

    public Boolean getRecordActivity() {
        return recordActivity;
    }

    public void setRecordActivity(Boolean recordActivity) {
        this.recordActivity = recordActivity;
    }

    public void addChild(Person child) {
        this.children.add(child);
    }

    public void removeChild(Person child) {
        this.children.remove(child);
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Gender getGender() {
        return gender;
    }

    public LifeStatus getStatus() {
        return status;
    }

    public String getDescription() {
        return description;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public String getJob() {
        return job;
    }

    public String getImageUrl() {
        return imageUrl;
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

    public void setName(String name) {
        this.name = name;
    }

    public Instant getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(Instant dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public void setStatus(LifeStatus status) {
        this.status = status;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public void setJob(String job) {
        this.job = job;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
