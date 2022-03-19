package com.familytree.web.rest.vm.familytree;

import com.familytree.domain.familytree.Person;
import javax.validation.constraints.NotNull;

public class AddChildVM extends PersonVM {

    @NotNull
    private Long familyTreeId;

    @NotNull
    private Long fatherId;

    public Person toEntity() {
        Person person = new Person();
        person.setFamilyTreeId(getFamilyTreeId());
        person.setName(getName());
        person.setDateOfBirth(getDateOfBirth());
        person.setGender(getGender());
        person.setStatus(getStatus());
        person.setDescription(getDescription());
        person.setMobileNumber(getMobileNumber());
        person.setJob(getJob());
        return person;
    }

    public Long getFatherId() {
        return fatherId;
    }

    public void setFatherId(Long fatherId) {
        this.fatherId = fatherId;
    }

    public Long getFamilyTreeId() {
        return familyTreeId;
    }

    public void setFamilyTreeId(Long familyTreeId) {
        this.familyTreeId = familyTreeId;
    }

    @Override
    public String toString() {
        return "AddChildVM{" + "familyTreeId=" + familyTreeId + ", fatherId=" + fatherId + ", person=" + super.toString() + '}';
    }
}
