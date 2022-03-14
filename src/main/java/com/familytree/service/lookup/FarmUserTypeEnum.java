package com.familytree.service.lookup;

public enum FarmUserTypeEnum {
    Main("MAIN"),
    Normal("NORMAL");

    private String index;

    FarmUserTypeEnum(String index) {
        this.index = index;
    }

    public String value() {
        return index;
    }
}
