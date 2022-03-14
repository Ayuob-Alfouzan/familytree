package com.familytree.service.dto.subscription;

import com.familytree.service.dto.util.LookupDTO;
import java.time.Instant;

public class InvoiceDTO {

    private Long id;
    private Long farmId;
    private LookupDTO status;
    private LookupDTO type;
    private Long invoiceNumber;
    private Double amount;
    private Double amountVat;
    private Double vatPercentage;
    private Instant creationDate;
    private Instant paymentDate;
    private String customerName;
    private Boolean recordActivity;
    private Long subscriptionId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getFarmId() {
        return farmId;
    }

    public void setFarmId(Long farmId) {
        this.farmId = farmId;
    }

    public LookupDTO getStatus() {
        return status;
    }

    public void setStatus(LookupDTO status) {
        this.status = status;
    }

    public Long getInvoiceNumber() {
        return invoiceNumber;
    }

    public void setInvoiceNumber(Long invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Double getAmountVat() {
        return amountVat;
    }

    public void setAmountVat(Double amountVat) {
        this.amountVat = amountVat;
    }

    public Double getVatPercentage() {
        return vatPercentage;
    }

    public void setVatPercentage(Double vatPercentage) {
        this.vatPercentage = vatPercentage;
    }

    public Instant getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Instant creationDate) {
        this.creationDate = creationDate;
    }

    public Instant getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(Instant paymentDate) {
        this.paymentDate = paymentDate;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public Boolean getRecordActivity() {
        return recordActivity;
    }

    public void setRecordActivity(Boolean recordActivity) {
        this.recordActivity = recordActivity;
    }

    public Long getSubscriptionId() {
        return subscriptionId;
    }

    public void setSubscriptionId(Long subscriptionId) {
        this.subscriptionId = subscriptionId;
    }

    public LookupDTO getType() {
        return type;
    }

    public void setType(LookupDTO type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return (
            "InvoiceDTO{" +
            "id=" +
            id +
            ", farmId=" +
            farmId +
            ", status=" +
            status +
            ", type=" +
            type +
            ", invoiceNumber=" +
            invoiceNumber +
            ", amount=" +
            amount +
            ", amountVat=" +
            amountVat +
            ", vatPercentage=" +
            vatPercentage +
            ", creationDate=" +
            creationDate +
            ", paymentDate=" +
            paymentDate +
            ", customerName='" +
            customerName +
            '\'' +
            ", recordActivity=" +
            recordActivity +
            ", subscriptionId=" +
            subscriptionId +
            '}'
        );
    }
}
