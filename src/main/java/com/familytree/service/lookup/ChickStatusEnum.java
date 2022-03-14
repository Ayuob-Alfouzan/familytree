package com.familytree.service.lookup;

public enum ChickStatusEnum {
    New("NEW"),
    Dead("DEAD"),
    Killed("KILLED"),
    Production("PRODUCTION");

    private String index;

    ChickStatusEnum(String index) {
        this.index = index;
    }

    public String value() {
        return index;
    }
}
