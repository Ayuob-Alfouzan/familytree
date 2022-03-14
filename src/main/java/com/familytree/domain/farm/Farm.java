package com.familytree.domain.farm;

import com.familytree.domain.subscription.Subscription;
import com.familytree.domain.util.AbstractAuditingEntity;
import com.familytree.domain.util.Lookup;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "farm")
public class Farm extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "type_id", nullable = false)
    private Lookup type;

    @Column(name = "name_ar")
    private String nameAr;

    @Column(name = "name_en")
    private String nameEn;

    @Column(name = "location")
    private String location;

    @Column(name = "vat_number", length = 50)
    private String vatNumber;

    @NotNull
    @Column(name = "record_activity", nullable = false)
    private Boolean recordActivity = true;

    @OneToMany(mappedBy = "farm", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FarmUser> farmUsers = new ArrayList<>();

    @OneToMany(mappedBy = "farm", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Subscription> subscriptions = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Lookup getType() {
        return type;
    }

    public List<FarmUser> getFarmUsers() {
        return farmUsers;
    }

    public void setFarmUsers(List<FarmUser> farmUsers) {
        this.farmUsers = farmUsers;
    }

    public void setType(Lookup type) {
        this.type = type;
    }

    public String getNameAr() {
        return nameAr;
    }

    public void setNameAr(String nameAr) {
        this.nameAr = nameAr;
    }

    public String getNameEn() {
        return nameEn;
    }

    public void setNameEn(String nameEn) {
        this.nameEn = nameEn;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Boolean getRecordActivity() {
        return recordActivity;
    }

    public Boolean isRecordActivity() {
        return recordActivity;
    }

    public void setRecordActivity(Boolean recordActivity) {
        this.recordActivity = recordActivity;
    }

    public List<Subscription> getSubscriptions() {
        return subscriptions;
    }

    public void setSubscriptions(List<Subscription> subscriptions) {
        this.subscriptions = subscriptions;
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
        if (!(o instanceof Farm)) {
            return false;
        }
        return id != null && id.equals(((Farm) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return (
            "Farm{" +
            "id=" +
            id +
            ", nameAr='" +
            nameAr +
            '\'' +
            ", nameEn='" +
            nameEn +
            '\'' +
            ", location='" +
            location +
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
