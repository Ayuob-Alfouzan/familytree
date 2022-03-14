package com.familytree.web.rest.vm.familytree;

public class GlobalFamilyTreeDashboardResponseVM {

    private Integer numberOfOwnedFamilyTrees;
    private Integer numberOfFamilyTrees;

    public Integer getNumberOfOwnedFamilyTrees() {
        return numberOfOwnedFamilyTrees;
    }

    public void setNumberOfOwnedFamilyTrees(Integer numberOfOwnedFamilyTrees) {
        this.numberOfOwnedFamilyTrees = numberOfOwnedFamilyTrees;
    }

    public Integer getNumberOfFamilyTrees() {
        return numberOfFamilyTrees;
    }

    public void setNumberOfFamilyTrees(Integer numberOfFamilyTrees) {
        this.numberOfFamilyTrees = numberOfFamilyTrees;
    }

    @Override
    public String toString() {
        return "GlobalFamilyTreeDashboardResponseVM{" +
            "numberOfOwnedFamilyTrees=" + numberOfOwnedFamilyTrees +
            ", numberOfFamilyTrees=" + numberOfFamilyTrees +
            '}';
    }
}
