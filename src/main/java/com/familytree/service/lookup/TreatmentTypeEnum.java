package com.familytree.service.lookup;

public enum TreatmentTypeEnum {
    Vaccine("VACCINE"),
    Medicine("MEDICINE"),
    Vitamin("VITAMIN");

    private String index;

    TreatmentTypeEnum(String index) {
        this.index = index;
    }

    public String value() {
        return index;
    }
}
