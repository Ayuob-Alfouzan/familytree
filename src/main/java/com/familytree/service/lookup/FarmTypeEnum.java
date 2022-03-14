package com.familytree.service.lookup;

public enum FarmTypeEnum {
    Pigeon("PIGEON"),
    Sheep("SHEEP");

    private String index;

    FarmTypeEnum(String index) {
        this.index = index;
    }

    public String value() {
        return index;
    }
}
