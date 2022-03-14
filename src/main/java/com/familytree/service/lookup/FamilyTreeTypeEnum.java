package com.familytree.service.lookup;

public enum FamilyTreeTypeEnum {
    Pigeon("PIGEON"),
    Sheep("SHEEP");

    private String index;

    FamilyTreeTypeEnum(String index) {
        this.index = index;
    }

    public String value() {
        return index;
    }
}
