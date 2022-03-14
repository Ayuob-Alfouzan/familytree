package com.familytree.service.dto.subscription;

import com.familytree.service.dto.util.LookupDTO;
import java.time.Instant;

public class SubscriptionUpgradeRequestDTO {

    private Long id;
    private Long familyTreeId;
    private InvoiceDTO invoice;
    private LookupDTO status;
    private PackageDTO packageDTO;
    private Instant createdDate;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getFamilyTreeId() {
        return familyTreeId;
    }

    public void setFamilyTreeId(Long familyTreeId) {
        this.familyTreeId = familyTreeId;
    }

    public LookupDTO getStatus() {
        return status;
    }

    public void setStatus(LookupDTO status) {
        this.status = status;
    }

    public PackageDTO getPackageDTO() {
        return packageDTO;
    }

    public void setPackageDTO(PackageDTO packageDTO) {
        this.packageDTO = packageDTO;
    }

    public InvoiceDTO getInvoice() {
        return invoice;
    }

    public void setInvoice(InvoiceDTO invoice) {
        this.invoice = invoice;
    }

    public Instant getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }

    @Override
    public String toString() {
        return (
            "SubscriptionUpgradeRequestDTO{" +
            "id=" +
            id +
            ", familyTreeId=" + familyTreeId +
            ", invoice=" +
            invoice +
            ", status=" +
            status +
            ", packageDTO=" +
            packageDTO +
            ", createdDate=" +
            createdDate +
            '}'
        );
    }
}
