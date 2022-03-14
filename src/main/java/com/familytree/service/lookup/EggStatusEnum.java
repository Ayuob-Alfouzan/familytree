package com.familytree.service.lookup;

public enum EggStatusEnum {
    New("NEW"),
    Hatch("HATCH"),
    Spoil("SPOIL"),
    Pulled("PULLED");

    private String index;

    EggStatusEnum(String index) {
        this.index = index;
    }

    public String value() {
        return index;
    }
}
