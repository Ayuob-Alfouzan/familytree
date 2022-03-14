package com.familytree.service.lookup;

public enum SheepGenderEnum {
    Male("MALE"),
    Female("FEMALE");

    private String index;

    SheepGenderEnum(String index) {
        this.index = index;
    }

    public String value() {
        return index;
    }
}
