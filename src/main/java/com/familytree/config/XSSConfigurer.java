package com.familytree.config;

import com.familytree.security.jwt.JWTFilter;
import org.springframework.security.config.annotation.SecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.DefaultSecurityFilterChain;

public class XSSConfigurer extends SecurityConfigurerAdapter<DefaultSecurityFilterChain, HttpSecurity> {

    @Override
    public void configure(HttpSecurity http) {
        XSSFilter customFilter = new XSSFilter();
        http.addFilterBefore(customFilter, JWTFilter.class);
    }
}
