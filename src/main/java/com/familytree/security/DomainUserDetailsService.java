package com.familytree.security;

import com.familytree.domain.account.User;
import com.familytree.repository.account.UserRepository;
import com.familytree.service.util.exception.BadRequestException;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Authenticate a user from the database.
 */
@Component("userDetailsService")
public class DomainUserDetailsService implements UserDetailsService {

    private final Logger log = LoggerFactory.getLogger(DomainUserDetailsService.class);

    private final UserRepository userRepository;

    public DomainUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(final String email) {
        log.debug("Authenticating {}", email);

        String lowercaseEmail = email.toLowerCase(Locale.ENGLISH);
        return userRepository
            .findOneByEmailIgnoreCaseAndRecordActivityIsTrue(lowercaseEmail)
            .map(user -> createSpringSecurityUser(lowercaseEmail, user))
            .orElseThrow(() -> new BadRequestException("login.invalid_credentials"));
    }

    private DetailedUser createSpringSecurityUser(String lowercaseEmail, User user) {
        if (!user.isActivated()) {
            throw new BadRequestException("login.user_not_activated");
        }

        List<GrantedAuthority> grantedAuthorities = AuthoritiesConstants.getAuthorities(user.getType());

        return new DetailedUser(user.getEmail(), user.getPassword(), grantedAuthorities, user.getId());
    }
}
