package com.familytree.web.rest.vm.familytree;

import com.familytree.domain.enumeration.Gender;
import com.familytree.domain.familytree.Person;
import javax.validation.constraints.NotNull;

public class AddFatherVM extends PersonVM {

    @NotNull
    private Long familyTreeId;

    @NotNull
    private Long childId;

    public Person toEntity() {
        Person person = new Person();
        person.setFamilyTreeId(getFamilyTreeId());
        person.setName(getName());
        person.setDateOfBirth(getDateOfBirth());
        person.setGender(Gender.MALE);
        person.setStatus(getStatus());
        person.setDescription(getDescription());
        person.setMobileNumber(getMobileNumber());
        person.setJob(getJob());
        return person;
    }

    public Long getChildId() {
        return childId;
    }

    public void setChildId(Long childId) {
        this.childId = childId;
    }

    public Long getFamilyTreeId() {
        return familyTreeId;
    }

    public void setFamilyTreeId(Long familyTreeId) {
        this.familyTreeId = familyTreeId;
    }

    @Override
    public String toString() {
        return "AddParentVM{" + "familyTreeId=" + familyTreeId + ", childId=" + childId + ", person=" + super.toString() + '}';
    }
}
