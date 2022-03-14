package com.familytree.domain.familytree;

import com.familytree.domain.account.User;
import com.familytree.domain.util.AbstractAuditingEntity;
import com.familytree.domain.util.Lookup;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "family_tree_user")
public class FamilyTreeUser extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "family_tree_id", nullable = false)
    private FamilyTree familyTree;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "type_id", nullable = false)
    private Lookup type;

    @NotNull
    @Column(name = "record_activity", nullable = false)
    private Boolean recordActivity = true;

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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public Lookup getType() {
        return type;
    }

    public void setType(Lookup type) {
        this.type = type;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FamilyTreeUser)) {
            return false;
        }
        return id != null && id.equals(((FamilyTreeUser) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "FamilyTreeUser{" +
            "id=" + id +
            ", user=" + user +
            ", recordActivity=" + recordActivity +
            '}';
    }
}
