package com.familytree.security;

import com.familytree.config.Constants;
import java.util.ArrayList;
import java.util.List;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

/**
 * Constants for Spring Security authorities.
 */
public final class AuthoritiesConstants {

    public static final String ANONYMOUS = "ROLE_ANONYMOUS";
    public static final String ADMIN = "ROLE_ADMIN";
    public static final String USER = "ROLE_USER";

    private AuthoritiesConstants() {}

    public static List<GrantedAuthority> getAuthorities(String type) {
        List<GrantedAuthority> grantedAuthorities = new ArrayList<>();

        if (type.equals(Constants.USER_KEY)) {
            grantedAuthorities.add(new SimpleGrantedAuthority(AuthoritiesConstants.USER));
        } else if (type.equals(Constants.ADMIN_KEY)) {
            grantedAuthorities.add(new SimpleGrantedAuthority(AuthoritiesConstants.ADMIN));
        }

        return grantedAuthorities;
    }
}
