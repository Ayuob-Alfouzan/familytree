package com.familytree.web.rest.vm.farm;

import com.familytree.service.util.CommonUtil;

public class FarmDashboardResponseVM {

    private Integer numberOfUsers;
    private Integer numberOfIncomeFinancialTransactions;
    private Integer numberOfExpenseFinancialTransactions;
    private Double financialStatus;
    private Integer numberOfWarehouses;
    private Integer numberOfSheep;
    private Integer numberOfSheepVaccinations;
    private Integer numberOfSheepTreatments;

    public FarmDashboardResponseVM() {}

    public Integer getNumberOfUsers() {
        return numberOfUsers;
    }

    public void setNumberOfUsers(Integer numberOfUsers) {
        this.numberOfUsers = numberOfUsers;
    }

    public Integer getNumberOfIncomeFinancialTransactions() {
        return numberOfIncomeFinancialTransactions;
    }

    public void setNumberOfIncomeFinancialTransactions(Integer numberOfIncomeFinancialTransactions) {
        this.numberOfIncomeFinancialTransactions = numberOfIncomeFinancialTransactions;
    }

    public Integer getNumberOfExpenseFinancialTransactions() {
        return numberOfExpenseFinancialTransactions;
    }

    public void setNumberOfExpenseFinancialTransactions(Integer numberOfExpenseFinancialTransactions) {
        this.numberOfExpenseFinancialTransactions = numberOfExpenseFinancialTransactions;
    }

    public Double getFinancialStatus() {
        return financialStatus;
    }

    public void setFinancialStatus(Double financialStatus) {
        this.financialStatus = CommonUtil.round(financialStatus, 2);
    }

    public Integer getNumberOfWarehouses() {
        return numberOfWarehouses;
    }

    public void setNumberOfWarehouses(Integer numberOfWarehouses) {
        this.numberOfWarehouses = numberOfWarehouses;
    }

    public Integer getNumberOfSheep() {
        return numberOfSheep;
    }

    public void setNumberOfSheep(Integer numberOfSheep) {
        this.numberOfSheep = numberOfSheep;
    }

    public Integer getNumberOfSheepVaccinations() {
        return numberOfSheepVaccinations;
    }

    public void setNumberOfSheepVaccinations(Integer numberOfSheepVaccinations) {
        this.numberOfSheepVaccinations = numberOfSheepVaccinations;
    }

    public Integer getNumberOfSheepTreatments() {
        return numberOfSheepTreatments;
    }

    public void setNumberOfSheepTreatments(Integer numberOfSheepTreatments) {
        this.numberOfSheepTreatments = numberOfSheepTreatments;
    }

    @Override
    public String toString() {
        return (
            "FarmDashboardResponseVM{" +
            "numberOfUsers=" +
            numberOfUsers +
            ", numberOfIncomeFinancialTransactions=" +
            numberOfIncomeFinancialTransactions +
            ", numberOfExpenseFinancialTransactions=" +
            numberOfExpenseFinancialTransactions +
            ", financialStatus=" +
            financialStatus +
            ", numberOfWarehouses=" +
            numberOfWarehouses +
            ", numberOfSheep=" +
            numberOfSheep +
            ", numberOfSheepVaccinations=" +
            numberOfSheepVaccinations +
            ", numberOfSheepTreatments=" +
            numberOfSheepTreatments +
            '}'
        );
    }
}
