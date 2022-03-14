package com.familytree.service.lookup;

public enum InvoiceTypeEnum {
    Subscription("SUBSCRIPTION"),
    SubscriptionUpgrade("SUBSCRIPTION_UPGRADE");

    private String index;

    InvoiceTypeEnum(String index) {
        this.index = index;
    }

    public String value() {
        return index;
    }
}
