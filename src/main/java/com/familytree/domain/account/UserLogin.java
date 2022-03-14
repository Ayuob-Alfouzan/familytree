package com.familytree.domain.account;

import com.familytree.domain.util.AbstractAuditingEntity;

import java.io.Serializable;
import javax.persistence.*;

/**
 * A user.
 */
@Entity
@Table(name = "user_login")
public class UserLogin extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserLogin)) {
            return false;
        }
        return id != null && id.equals(((UserLogin) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "UserLogin{" + "id=" + id + '}';
    }
}
