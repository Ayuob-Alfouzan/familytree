package com.familytree.domain.enumeration;

public enum LifeStatus {
    ALIVE(1),
    DEAD(2);

    private final int value;

    public int getValue() {
        return value;
    }

    LifeStatus(int value) {
        this.value = value;
    }
}
