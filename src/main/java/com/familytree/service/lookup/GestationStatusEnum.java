package com.familytree.service.lookup;

public enum GestationStatusEnum {
    Hale("HALE"),
    Lambed("LAMBED"),
    Aborted("ABORTED");

    private String index;

    GestationStatusEnum(String index) {
        this.index = index;
    }

    public String value() {
        return index;
    }
}
