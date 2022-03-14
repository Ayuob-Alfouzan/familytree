package com.familytree.service.lookup;

public enum LookupCategory {
    FarmType("FARM_TYPE"),
    FarmUserType("FARM_USER_TYPE"),
    PigeonStatus("PIGEON_STATUS"),
    EggStatus("EGG_STATUS"),
    ChickStatus("CHICK_STATUS"),
    TreatmentType("TREATMENT_TYPE"),
    FinancialTransactionType("FINANCIAL_TRANSACTION_TYPE"),
    IncomeType("INCOME_TYPE"),
    ExpenseType("EXPENSE_TYPE"),
    SubscriptionStatus("SUBSCRIPTION_STATUS"),
    InvoiceStatus("INVOICE_STATUS"),
    InvoiceType("INVOICE_TYPE"),
    SheepCategory("SHEEP_CATEGORY"),
    SheepType("SHEEP_TYPE"),
    SheepStatus("SHEEP_STATUS"),
    SheepGender("SHEEP_GENDER"),
    GestationStatus("GESTATION_STATUS"),
    CopulationStatus("COPULATION_STATUS"),
    SheepVaccinationType("SHEEP_VACCINATION_TYPE"),
    SheepTreatmentType("SHEEP_TREATMENT_TYPE"),
    SheepTreatmentDoseType("SHEEP_TREATMENT_DOSE_TYPE");

    private String index;

    LookupCategory(String index) {
        this.index = index;
    }

    public String value() {
        return index;
    }
}
