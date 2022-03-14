package com.familytree.service.lookup;

public enum SubscriptionStatusEnum {
    WaitingForPayment("WAITING_FOR_PAYMENT"),
    Active("ACTIVE"),
    Expired("EXPIRED"),
    Cancelled("CANCELLED");

    private String index;

    SubscriptionStatusEnum(String index) {
        this.index = index;
    }

    public String value() {
        return index;
    }
}
