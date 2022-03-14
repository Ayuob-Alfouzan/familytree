package com.familytree.service.lookup;

public enum CopulationStatusEnum {
    New("NEW"),
    Confirmed("CONFIRMED"),
    False("FALSE");

    private String index;

    CopulationStatusEnum(String index) {
        this.index = index;
    }

    public String value() {
        return index;
    }
}
