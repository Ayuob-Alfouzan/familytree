package com.familytree.service.lookup;

public enum FamilyTreeUserTypeEnum {
    Main("MAIN"),
    Normal("NORMAL");

    private String index;

    FamilyTreeUserTypeEnum(String index) {
        this.index = index;
    }

    public String value() {
        return index;
    }
}
