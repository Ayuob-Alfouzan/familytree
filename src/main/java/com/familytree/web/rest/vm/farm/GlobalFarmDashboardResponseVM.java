package com.familytree.web.rest.vm.farm;

public class GlobalFarmDashboardResponseVM {

    private Integer numberOfOwnedFarms;
    private Integer numberOfFarms;

    public Integer getNumberOfOwnedFarms() {
        return numberOfOwnedFarms;
    }

    public void setNumberOfOwnedFarms(Integer numberOfOwnedFarms) {
        this.numberOfOwnedFarms = numberOfOwnedFarms;
    }

    public Integer getNumberOfFarms() {
        return numberOfFarms;
    }

    public void setNumberOfFarms(Integer numberOfFarms) {
        this.numberOfFarms = numberOfFarms;
    }

    @Override
    public String toString() {
        return "GlobalFarmDashboardResponseVM{" + "numberOfOwnedFarms=" + numberOfOwnedFarms + ", numberOfFarms=" + numberOfFarms + '}';
    }
}
