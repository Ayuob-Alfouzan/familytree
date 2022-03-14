package com.familytree.web.rest.resource.util;

import com.familytree.config.ApplicationProperties;
import com.familytree.web.rest.vm.util.ConfigurationVM;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/configuration")
public class ConfigurationResource {
    private final ApplicationProperties applicationProperties;

    public ConfigurationResource(ApplicationProperties applicationProperties) {

        this.applicationProperties = applicationProperties;
    }

    @GetMapping
    public ResponseEntity<ConfigurationVM> get() {
        return ResponseEntity.ok(new ConfigurationVM(applicationProperties));
    }
}
