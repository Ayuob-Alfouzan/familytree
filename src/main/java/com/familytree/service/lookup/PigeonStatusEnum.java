package com.familytree.service.lookup;

public enum PigeonStatusEnum {
    Hale("HALE"),
    Sick("SICK"),
    Dead("DEAD");

    private String index;

    PigeonStatusEnum(String index) {
        this.index = index;
    }

    public String value() {
        return index;
    }
}
