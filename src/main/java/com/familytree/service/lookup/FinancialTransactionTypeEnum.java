package com.familytree.service.lookup;

public enum FinancialTransactionTypeEnum {
    Expense("EXPENSE"),
    Income("INCOME");

    private String index;

    FinancialTransactionTypeEnum(String index) {
        this.index = index;
    }

    public String value() {
        return index;
    }
}
