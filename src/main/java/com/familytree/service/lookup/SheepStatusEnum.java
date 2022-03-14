package com.familytree.service.lookup;

public enum SheepStatusEnum {
    Hale("HALE"),
    Sick("SICK"),
    Dead("DEAD");

    private String index;

    SheepStatusEnum(String index) {
        this.index = index;
    }

    public String value() {
        return index;
    }
}
