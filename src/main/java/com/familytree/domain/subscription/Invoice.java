package com.familytree.domain.subscription;

import com.familytree.domain.farm.Farm;
import com.familytree.domain.util.AbstractAuditingEntity;
import com.familytree.domain.util.Lookup;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "invoice")
public class Invoice extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "farm_id", nullable = false)
    private Farm farm;

    @ManyToOne
    @JoinColumn(name = "status_id", nullable = false)
    private Lookup status;

    @ManyToOne
    @JoinColumn(name = "type_id", nullable = false)
    private Lookup type;

    @Column(name = "invoice_number")
    private Long invoiceNumber;

    @Column(name = "amount")
    private Double amount;

    @Column(name = "amount_vat")
    private Double amountVat;

    @Column(name = "vatPercentage")
    private Double vatPercentage;

    @Column(name = "creation_date")
    private Instant creationDate;

    @Column(name = "payment_date")
    private Instant paymentDate;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "customer_address")
    private String customerAddress;

    @Column(name = "customer_vat_number")
    private String customerVatNumber;

    @Column(name = "vat_number")
    private String vatNumber;

    @NotNull
    @Column(name = "record_activity", nullable = false)
    private Boolean recordActivity = true;

    @OneToOne(mappedBy = "invoice")
    private Subscription subscription;

    @OneToOne(mappedBy = "invoice")
    private SubscriptionUpgradeRequest subscriptionUpgradeRequest;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Farm getFarm() {
        return farm;
    }

    public void setFarm(Farm farm) {
        this.farm = farm;
    }

    public Lookup getStatus() {
        return status;
    }

    public void setStatus(Lookup status) {
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

    public SubscriptionUpgradeRequest getSubscriptionUpgradeRequest() {
        return subscriptionUpgradeRequest;
    }

    public void setSubscriptionUpgradeRequest(SubscriptionUpgradeRequest subscriptionUpgradeRequest) {
        this.subscriptionUpgradeRequest = subscriptionUpgradeRequest;
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

    public Subscription getSubscription() {
        return subscription;
    }

    public void setSubscription(Subscription subscription) {
        this.subscription = subscription;
    }

    public Boolean getRecordActivity() {
        return recordActivity;
    }

    public void setRecordActivity(Boolean recordActivity) {
        this.recordActivity = recordActivity;
    }

    public Lookup getType() {
        return type;
    }

    public void setType(Lookup type) {
        this.type = type;
    }

    public String getCustomerAddress() {
        return customerAddress;
    }

    public void setCustomerAddress(String customerAddress) {
        this.customerAddress = customerAddress;
    }

    public String getCustomerVatNumber() {
        return customerVatNumber;
    }

    public void setCustomerVatNumber(String customerVatNumber) {
        this.customerVatNumber = customerVatNumber;
    }

    public String getVatNumber() {
        return vatNumber;
    }

    public void setVatNumber(String vatNumber) {
        this.vatNumber = vatNumber;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Invoice)) {
            return false;
        }
        return id != null && id.equals(((Invoice) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return (
            "Invoice{" +
            "id=" +
            id +
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
            ", customerAddress='" +
            customerAddress +
            '\'' +
            ", customerVatNumber='" +
            customerVatNumber +
            '\'' +
            ", vatNumber='" +
            vatNumber +
            '\'' +
            ", recordActivity=" +
            recordActivity +
            '}'
        );
    }
}
