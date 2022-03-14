package com.familytree.service.dto.financialTransaction;

import com.familytree.service.dto.util.LookupDTO;
import java.time.Instant;

public class FinancialTransactionDTO {

    private Long id;
    private LookupDTO type;
    private LookupDTO specificType;
    private Double amount;
    private String description;
    private Boolean recordActivity;
    private Instant createdDate;

    public Instant getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LookupDTO getType() {
        return type;
    }

    public void setType(LookupDTO type) {
        this.type = type;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getRecordActivity() {
        return recordActivity;
    }

    public void setRecordActivity(Boolean recordActivity) {
        this.recordActivity = recordActivity;
    }

    public LookupDTO getSpecificType() {
        return specificType;
    }

    public void setSpecificType(LookupDTO specificType) {
        this.specificType = specificType;
    }

    @Override
    public String toString() {
        return (
            "FinancialTransactionDTO{" +
            "id=" +
            id +
            ", type=" +
            type +
            ", specificType=" +
            specificType +
            ", amount=" +
            amount +
            ", description='" +
            description +
            '\'' +
            ", recordActivity=" +
            recordActivity +
            ", createdDate=" +
            createdDate +
            '}'
        );
    }
}
