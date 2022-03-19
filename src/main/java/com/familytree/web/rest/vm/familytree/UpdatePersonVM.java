package com.familytree.web.rest.vm.familytree;

import com.familytree.domain.enumeration.Gender;
import com.familytree.domain.enumeration.LifeStatus;
import java.time.Instant;
import javax.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

public class UpdatePersonVM extends PersonVM {

    @NotNull
    private Long familyTreeId;

    @NotNull
    private Long id;

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

    @Override
    public String toString() {
        return "UpdatePersonVM{" + "familyTreeId=" + familyTreeId + ", id=" + id + ", person=" + super.toString() + '}';
    }
}
