package com.familytree.web.rest.vm.subscription;

public class SubscriptionActionResponseVM {

    private Boolean canSubscribe;
    private Boolean canRenew;
    private Long renewSubscriptionId;

    public SubscriptionActionResponseVM() {
        this.canSubscribe = false;
        this.canRenew = false;
    }

    public SubscriptionActionResponseVM(Boolean canSubscribe, Long subscriptionId) {
        this.canSubscribe = canSubscribe;
        this.canRenew = true;
        this.renewSubscriptionId = subscriptionId;
    }

    public SubscriptionActionResponseVM(Boolean canSubscribe) {
        this.canSubscribe = canSubscribe;
        this.canRenew = false;
    }

    public Boolean getCanSubscribe() {
        return canSubscribe;
    }

    public void setCanSubscribe(Boolean canSubscribe) {
        this.canSubscribe = canSubscribe;
    }

    public Boolean getCanRenew() {
        return canRenew;
    }

    public void setCanRenew(Boolean canRenew) {
        this.canRenew = canRenew;
    }

    public Long getRenewSubscriptionId() {
        return renewSubscriptionId;
    }

    public void setRenewSubscriptionId(Long renewSubscriptionId) {
        this.renewSubscriptionId = renewSubscriptionId;
    }

    @Override
    public String toString() {
        return (
            "SubscriptionActionResponseVM{" +
            "canSubscribe=" +
            canSubscribe +
            ", canRenew=" +
            canRenew +
            ", renewSubscriptionId=" +
            renewSubscriptionId +
            '}'
        );
    }
}
