package com.familytree.security;

import java.util.Collection;
import java.util.Map;
import org.springframework.security.core.GrantedAuthority;

public class DetailedUser extends org.springframework.security.core.userdetails.User {

    private Long userId;
    private Map<String, Object> attributes;
    private String name;

    public DetailedUser(String username, String password, Collection<? extends GrantedAuthority> authorities, Long userId) {
        super(username, password, authorities);
        this.userId = userId;
    }

    public DetailedUser(
        String username,
        String password,
        Collection<? extends GrantedAuthority> authorities,
        Long userId,
        Map<String, Object> attributes,
        String name
    ) {
        super(username, password, authorities);
        this.userId = userId;
        this.attributes = attributes;
        this.name = name;
    }

    public DetailedUser(
        String username,
        String password,
        boolean enabled,
        boolean accountNonExpired,
        boolean credentialsNonExpired,
        boolean accountNonLocked,
        Collection<? extends GrantedAuthority> authorities,
        Long userId
    ) {
        super(username, password, enabled, accountNonExpired, credentialsNonExpired, accountNonLocked, authorities);
        this.userId = userId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    @Override
    public String toString() {
        return "DetailedUser{" + "userId=" + userId + "username=" + getUsername() + '}';
    }

    public Map<String, Object> getAttributes() {
        return this.attributes;
    }

    public String getName() {
        return this.name;
    }
}
