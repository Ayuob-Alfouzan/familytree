package com.familytree.domain.subscription;

import com.familytree.domain.util.AbstractAuditingEntity;
import com.familytree.domain.util.Lookup;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

@Entity
@Table(name = "package")
public class Package extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "farm_type_id", nullable = false)
    private Lookup farmType;

    @Column(name = "name_ar")
    @Length(max = 50)
    private String nameAr;

    @Column(name = "name_en")
    @Length(max = 50)
    private String nameEn;

    @Column(name = "name_ur")
    @Length(max = 50)
    private String nameUr;

    @Column(name = "description_ar")
    @Length(max = 50)
    private String descriptionAr;

    @Column(name = "description_en")
    @Length(max = 50)
    private String descriptionEn;

    @Column(name = "description_ur")
    @Length(max = 50)
    private String descriptionUr;

    @Column(name = "range_start")
    private Long rangeStart;

    @Column(name = "range_end")
    private Long rangeEnd;

    @Column(name = "cost")
    private Double cost;

    @Column(name = "duration")
    private Long duration;

    @NotNull
    @Column(name = "can_renew", nullable = false)
    private Boolean canRenew = true;

    @NotNull
    @Column(name = "record_activity", nullable = false)
    private Boolean recordActivity = true;

    @OneToMany(mappedBy = "aPackage", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Subscription> subscriptions = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Lookup getFarmType() {
        return farmType;
    }

    public void setFarmType(Lookup farmType) {
        this.farmType = farmType;
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

    public String getNameUr() {
        return nameUr;
    }

    public void setNameUr(String nameUr) {
        this.nameUr = nameUr;
    }

    public String getDescriptionAr() {
        return descriptionAr;
    }

    public void setDescriptionAr(String descriptionAr) {
        this.descriptionAr = descriptionAr;
    }

    public String getDescriptionEn() {
        return descriptionEn;
    }

    public void setDescriptionEn(String descriptionEn) {
        this.descriptionEn = descriptionEn;
    }

    public String getDescriptionUr() {
        return descriptionUr;
    }

    public void setDescriptionUr(String descriptionUr) {
        this.descriptionUr = descriptionUr;
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

    public Double getCost() {
        return cost;
    }

    public void setCost(Double cost) {
        this.cost = cost;
    }

    public Long getDuration() {
        return duration;
    }

    public void setDuration(Long duration) {
        this.duration = duration;
    }

    public List<Subscription> getSubscriptions() {
        return subscriptions;
    }

    public void setSubscriptions(List<Subscription> subscriptions) {
        this.subscriptions = subscriptions;
    }

    public Boolean getRecordActivity() {
        return recordActivity;
    }

    public void setRecordActivity(Boolean recordActivity) {
        this.recordActivity = recordActivity;
    }

    public Boolean getCanRenew() {
        return canRenew;
    }

    public void setCanRenew(Boolean canRenew) {
        this.canRenew = canRenew;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Package)) {
            return false;
        }
        return id != null && id.equals(((Package) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return (
            "Package{" +
            "id=" +
            id +
            ", nameAr='" +
            nameAr +
            '\'' +
            ", nameEn='" +
            nameEn +
            '\'' +
            ", nameUr='" +
            nameUr +
            '\'' +
            ", descriptionAr='" +
            descriptionAr +
            '\'' +
            ", descriptionEn='" +
            descriptionEn +
            '\'' +
            ", descriptionUr='" +
            descriptionUr +
            '\'' +
            ", rangeStart=" +
            rangeStart +
            ", rangeEnd=" +
            rangeEnd +
            ", cost=" +
            cost +
            ", duration=" +
            duration +
            ", canRenew=" +
            canRenew +
            ", recordActivity=" +
            recordActivity +
            '}'
        );
    }
}
