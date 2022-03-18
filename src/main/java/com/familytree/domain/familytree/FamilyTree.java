package com.familytree.domain.familytree;

import com.familytree.domain.subscription.Subscription;
import com.familytree.domain.util.AbstractAuditingEntity;
import com.familytree.domain.util.Lookup;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "family_tree")
public class FamilyTree extends AbstractAuditingEntity implements Serializable {

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

    @Column(name = "head_person_id")
    private Long headPersonId;

    @NotNull
    @Column(name = "record_activity", nullable = false)
    private Boolean recordActivity = true;

    @OneToMany(mappedBy = "familyTree", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FamilyTreeUser> familyTreeUsers = new ArrayList<>();

    @OneToMany(mappedBy = "familyTree", cascade = CascadeType.ALL, orphanRemoval = true)
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

    public List<FamilyTreeUser> getFamilyTreeUsers() {
        return familyTreeUsers;
    }

    public void setFamilyTreeUsers(List<FamilyTreeUser> familyTreeUsers) {
        this.familyTreeUsers = familyTreeUsers;
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

    public Long getHeadPersonId() {
        return headPersonId;
    }

    public void setHeadPersonId(Long headPersonId) {
        this.headPersonId = headPersonId;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FamilyTree)) {
            return false;
        }
        return id != null && id.equals(((FamilyTree) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return (
            "FamilyTree{" +
            "id=" +
            id +
            ", nameAr='" +
            nameAr +
            '\'' +
            ", headPersonId='" +
            headPersonId +
            '\'' +
            ", recordActivity=" +
            recordActivity +
            '}'
        );
    }
}
