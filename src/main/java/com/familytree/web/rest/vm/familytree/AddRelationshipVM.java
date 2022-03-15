package com.familytree.web.rest.vm.familytree;

import javax.validation.constraints.NotNull;

public class AddRelationshipVM {

    @NotNull
    private Long id;

    private Long headOfHousehold;
    private Long spouse;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
        return "AddRelationshipVM{" + "id=" + id + ", headOfHousehold=" + headOfHousehold + ", spouse=" + spouse + '}';
    }
}
