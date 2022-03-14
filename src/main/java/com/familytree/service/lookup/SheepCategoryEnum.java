package com.familytree.service.lookup;

public enum SheepCategoryEnum {
    Naimi("NAIMI"),
    Najdi("NAJDI"),
    Harrey("HARREY");

    private String index;

    SheepCategoryEnum(String index) {
        this.index = index;
    }

    public String value() {
        return index;
    }
}
