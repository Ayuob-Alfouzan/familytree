package com.familytree.service.lookup;

public enum SheepTypeEnum {
    Ewe("EWE"),
    Pregnant("PREGNANT"),
    Lambed("LAMBED"),
    Lamb("LAMB"),
    SpringLamb("SPRING_LAMB"),
    SixToTwelve("6-12"),
    Ram("Ram");

    private String index;

    SheepTypeEnum(String index) {
        this.index = index;
    }

    public String value() {
        return index;
    }
}
