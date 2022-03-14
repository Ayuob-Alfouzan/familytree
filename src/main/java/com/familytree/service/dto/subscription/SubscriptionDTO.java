package com.familytree.service.dto.subscription;

import com.familytree.service.dto.util.LookupDTO;
import java.time.Instant;
import java.util.List;

public class SubscriptionDTO {

    private Long id;
    private Long familyTreeId;
    private Long invoiceId;
    private InvoiceDTO invoice;
    private LookupDTO status;
    private PackageDTO packageDTO;
    private Instant startDate;
    private Instant endDate;
    private Long rangeStart;
    private Long rangeEnd;
    private Boolean recordActivity;
    private Boolean canUpgrade;
    private List<SubscriptionUpgradeRequestDTO> subscriptionUpgradeRequests;

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

    public Long getInvoiceId() {
        return invoiceId;
    }

    public void setInvoiceId(Long invoiceId) {
        this.invoiceId = invoiceId;
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

    public Instant getStartDate() {
        return startDate;
    }

    public void setStartDate(Instant startDate) {
        this.startDate = startDate;
    }

    public Instant getEndDate() {
        return endDate;
    }

    public void setEndDate(Instant endDate) {
        this.endDate = endDate;
    }

    public Long getRangeStart() {
        return rangeStart;
    }

    public void setRangeStart(Long rangeStart) {
        this.rangeStart = rangeStart;
    }

    public Long getRangeEnd() {
        return rangeEnd;
    }

    public void setRangeEnd(Long rangeEnd) {
        this.rangeEnd = rangeEnd;
    }

    public Boolean getRecordActivity() {
        return recordActivity;
    }

    public void setRecordActivity(Boolean recordActivity) {
        this.recordActivity = recordActivity;
    }

    public Boolean getCanUpgrade() {
        return canUpgrade;
    }

    public void setCanUpgrade(Boolean canUpgrade) {
        this.canUpgrade = canUpgrade;
    }

    public InvoiceDTO getInvoice() {
        return invoice;
    }

    public void setInvoice(InvoiceDTO invoice) {
        this.invoice = invoice;
    }

    public List<SubscriptionUpgradeRequestDTO> getSubscriptionUpgradeRequests() {
        return subscriptionUpgradeRequests;
    }

    public void setSubscriptionUpgradeRequests(List<SubscriptionUpgradeRequestDTO> subscriptionUpgradeRequests) {
        this.subscriptionUpgradeRequests = subscriptionUpgradeRequests;
    }

    @Override
    public String toString() {
        return "SubscriptionDTO{" +
            "id=" + id +
            ", familyTreeId=" + familyTreeId +
            ", invoiceId=" + invoiceId +
            ", invoice=" + invoice +
            ", status=" + status +
            ", packageDTO=" + packageDTO +
            ", startDate=" + startDate +
            ", endDate=" + endDate +
            ", rangeStart=" + rangeStart +
            ", rangeEnd=" + rangeEnd +
            ", recordActivity=" + recordActivity +
            ", canUpgrade=" + canUpgrade +
            ", subscriptionUpgradeRequests=" + subscriptionUpgradeRequests +
            '}';
    }
}
