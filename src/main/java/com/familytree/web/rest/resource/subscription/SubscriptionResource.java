package com.familytree.web.rest.resource.subscription;

import com.familytree.security.AuthoritiesConstants;
import com.familytree.service.dto.subscription.*;
import com.familytree.service.subscription.SubscriptionService;
import com.familytree.web.rest.vm.subscription.SubscriptionActionResponseVM;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subscription")
public class SubscriptionResource {

    private final Logger log = LoggerFactory.getLogger(SubscriptionResource.class);

    private final SubscriptionService subscriptionService;

    public SubscriptionResource(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @PostMapping("/list")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<Page<SubscriptionDTO>> list(@RequestBody SubscriptionCriteria criteria, Pageable pageable) {
        return ResponseEntity.ok(subscriptionService.list(criteria, pageable));
    }

    @GetMapping("/get-current/{familyTreeId}")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<SubscriptionDTO> getActive(@PathVariable Long familyTreeId) {
        return ResponseEntity.ok(subscriptionService.getCurrentSubscription(familyTreeId));
    }

    @GetMapping("/get/{familyTreeId}/{subscriptionId}")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<SubscriptionDTO> get(@PathVariable Long familyTreeId, @PathVariable Long subscriptionId) {
        return ResponseEntity.ok(subscriptionService.get(familyTreeId, subscriptionId));
    }

    @PostMapping("/add/{familyTreeId}/{packageId}")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<SubscriptionDTO> add(@PathVariable Long familyTreeId, @PathVariable Long packageId) {
        return ResponseEntity.ok(subscriptionService.create(familyTreeId, packageId));
    }

    @GetMapping("/subscription-action/{familyTreeId}")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<SubscriptionActionResponseVM> canSubscribe(@PathVariable Long familyTreeId) {
        return ResponseEntity.ok(subscriptionService.subscriptionAction(familyTreeId));
    }

    @PostMapping("/cancel/{familyTreeId}/{subscriptionId}")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<SubscriptionDTO> cancel(@PathVariable Long familyTreeId, @PathVariable Long subscriptionId) {
        return ResponseEntity.ok(subscriptionService.cancel(familyTreeId, subscriptionId));
    }

    @PostMapping("/upgrade/{familyTreeId}/{subscriptionId}/{packageId}")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<SubscriptionDTO> upgrade(
        @PathVariable Long familyTreeId,
        @PathVariable Long subscriptionId,
        @PathVariable Long packageId
    ) {
        return ResponseEntity.ok(subscriptionService.upgrade(familyTreeId, subscriptionId, packageId));
    }

    @PostMapping("/cancel-upgrade/{familyTreeId}/{subscriptionUpgradeRequestId}")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<SubscriptionUpgradeRequestDTO> cancelUpgrade(
        @PathVariable Long familyTreeId,
        @PathVariable Long subscriptionUpgradeRequestId
    ) {
        return ResponseEntity.ok(subscriptionService.cancelUpgrade(familyTreeId, subscriptionUpgradeRequestId));
    }

    @PostMapping("/renew/{familyTreeId}/{subscriptionId}")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<SubscriptionDTO> renew(@PathVariable Long familyTreeId, @PathVariable Long subscriptionId) {
        return ResponseEntity.ok(subscriptionService.renew(familyTreeId, subscriptionId));
    }
}
