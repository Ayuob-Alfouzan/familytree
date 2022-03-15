package com.familytree.domain.enumeration;

public enum Gender {
    MALE(1),
    FEMALE(2);

    private final int value;

    public int getValue() {
        return value;
    }

    Gender(int value) {
        this.value = value;
    }
}
