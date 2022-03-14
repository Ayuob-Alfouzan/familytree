package com.familytree.service.lookup;

public enum LookupCategory {
    FamilyTreeType("FAMILY_TREE_TYPE"),
    FamilyTreeUserType("FAMILY_TREE_USER_TYPE"),
    SubscriptionStatus("SUBSCRIPTION_STATUS"),
    InvoiceStatus("INVOICE_STATUS"),
    InvoiceType("INVOICE_TYPE");

    private String index;

    LookupCategory(String index) {
        this.index = index;
    }

    public String value() {
        return index;
    }
}
