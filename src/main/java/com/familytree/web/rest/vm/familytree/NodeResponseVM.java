package com.familytree.web.rest.vm.familytree;

import com.familytree.domain.familytree.Person;
import java.util.List;
import java.util.stream.Collectors;

public class NodeResponseVM {

    private String id;
    private String label;
    private String gender;
    private String description;
    private String mobileNumber;
    private String job;
    private String imageUrl;
    private String status;
    private String dateOfBirth;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(String dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public static NodeResponseVM fromEntity(Person it) {
        NodeResponseVM node = new NodeResponseVM();
        node.setId(it.getId().toString());
        node.setLabel(it.getName());
        node.setGender(it.getGender().name());
        node.setDescription(it.getDescription());
        node.setMobileNumber(it.getMobileNumber());
        node.setJob(it.getJob());
        node.setImageUrl(it.getImageUrl());
        node.setStatus(it.getStatus().name());
        node.setDateOfBirth(it.getDateOfBirth());
        return node;
    }

    public static List<NodeResponseVM> fromEntity(List<Person> it) {
        return it.stream().map(NodeResponseVM::fromEntity).collect(Collectors.toList());
    }

    @Override
    public String toString() {
        return (
            "NodeResponseVM{" +
            "id=" +
            id +
            ", name='" +
            label +
            '\'' +
            ", gender='" +
            gender +
            '\'' +
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
            ", status='" +
            status +
            '\'' +
            ", dateOfBirth=" +
            dateOfBirth +
            '}'
        );
    }
}
