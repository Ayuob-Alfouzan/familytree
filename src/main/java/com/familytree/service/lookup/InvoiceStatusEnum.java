package com.familytree.service.lookup;

public enum InvoiceStatusEnum {
    Unpaid("UNPAID"),
    Paid("PAID"),
    Cancelled("CANCELLED"),
    Expired("EXPIRED");

    private String index;

    InvoiceStatusEnum(String index) {
        this.index = index;
    }

    public String value() {
        return index;
    }
}
