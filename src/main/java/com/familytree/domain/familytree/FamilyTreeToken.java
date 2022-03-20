package com.familytree.domain.familytree;

import com.familytree.domain.account.User;
import com.familytree.domain.util.AbstractAuditingEntity;
import com.familytree.domain.util.Lookup;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "family_tree_token")
public class FamilyTreeToken extends AbstractAuditingEntity implements Serializable {

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

    @NotNull
    @Column(name = "token", nullable = false)
    private String token;

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

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FamilyTreeToken)) {
            return false;
        }
        return id != null && id.equals(((FamilyTreeToken) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "FamilyTreeToken{" + "id=" + id + ", token='" + token + '\'' + ", recordActivity=" + recordActivity + '}';
    }
}
