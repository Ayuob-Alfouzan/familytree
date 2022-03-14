package com.familytree.domain.subscription;

import com.familytree.domain.familytree.FamilyTree;
import com.familytree.domain.util.AbstractAuditingEntity;
import com.familytree.domain.util.Lookup;
import java.io.Serializable;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "subscription")
public class Subscription extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "family_tree_id", nullable = false)
    private FamilyTree familyTree;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "invoice_id", referencedColumnName = "id")
    private Invoice invoice;

    @ManyToOne
    @JoinColumn(name = "status_id", nullable = false)
    private Lookup status;

    @ManyToOne
    @JoinColumn(name = "package_id", nullable = false)
    private Package aPackage;

    @Column(name = "start_date")
    private Instant startDate;

    @Column(name = "end_date")
    private Instant endDate;

    @Column(name = "range_start")
    private Long rangeStart;

    @Column(name = "range_end")
    private Long rangeEnd;

    @NotNull
    @Column(name = "record_activity", nullable = false)
    private Boolean recordActivity = true;

    @OneToMany(mappedBy = "subscription", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SubscriptionUpgradeRequest> subscriptionUpgradeRequests = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public FamilyTree getFamilyTree() {
        return familyTree;
    }

    public void setFamilyTree(FamilyTree familyTree) {
        this.familyTree = familyTree;
    }

    public Lookup getStatus() {
        return status;
    }

    public void setStatus(Lookup status) {
        this.status = status;
    }

    public Invoice getInvoice() {
        return invoice;
    }

    public void setInvoice(Invoice invoice) {
        this.invoice = invoice;
    }

    public Package getaPackage() {
        return aPackage;
    }

    public List<SubscriptionUpgradeRequest> getSubscriptionUpgradeRequests() {
        return subscriptionUpgradeRequests;
    }

    public void setSubscriptionUpgradeRequests(List<SubscriptionUpgradeRequest> subscriptionUpgradeRequests) {
        this.subscriptionUpgradeRequests = subscriptionUpgradeRequests;
    }

    public void setaPackage(Package aPackage) {
        this.aPackage = aPackage;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Subscription)) {
            return false;
        }
        return id != null && id.equals(((Subscription) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return (
            "Subscription{" +
            "id=" +
            id +
            ", startDate=" +
            startDate +
            ", endDate=" +
            endDate +
            ", rangeStart=" +
            rangeStart +
            ", rangeEnd=" +
            rangeEnd +
            ", recordActivity=" +
            recordActivity +
            '}'
        );
    }
}
