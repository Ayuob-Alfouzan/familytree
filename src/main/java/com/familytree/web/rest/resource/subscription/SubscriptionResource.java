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

    @GetMapping("/get-current/{farmId}")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<SubscriptionDTO> getActive(@PathVariable Long farmId) {
        return ResponseEntity.ok(subscriptionService.getCurrentSubscription(farmId));
    }

    @GetMapping("/get/{farmId}/{subscriptionId}")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<SubscriptionDTO> get(@PathVariable Long farmId, @PathVariable Long subscriptionId) {
        return ResponseEntity.ok(subscriptionService.get(farmId, subscriptionId));
    }

    @PostMapping("/add/{farmId}/{packageId}")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<SubscriptionDTO> add(@PathVariable Long farmId, @PathVariable Long packageId) {
        return ResponseEntity.ok(subscriptionService.create(farmId, packageId));
    }

    @GetMapping("/subscription-action/{farmId}")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<SubscriptionActionResponseVM> canSubscribe(@PathVariable Long farmId) {
        return ResponseEntity.ok(subscriptionService.subscriptionAction(farmId));
    }

    @PostMapping("/cancel/{farmId}/{subscriptionId}")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<SubscriptionDTO> cancel(@PathVariable Long farmId, @PathVariable Long subscriptionId) {
        return ResponseEntity.ok(subscriptionService.cancel(farmId, subscriptionId));
    }

    @PostMapping("/upgrade/{farmId}/{subscriptionId}/{packageId}")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<SubscriptionDTO> upgrade(
        @PathVariable Long farmId,
        @PathVariable Long subscriptionId,
        @PathVariable Long packageId
    ) {
        return ResponseEntity.ok(subscriptionService.upgrade(farmId, subscriptionId, packageId));
    }

    @PostMapping("/cancel-upgrade/{farmId}/{subscriptionUpgradeRequestId}")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<SubscriptionUpgradeRequestDTO> cancelUpgrade(
        @PathVariable Long farmId,
        @PathVariable Long subscriptionUpgradeRequestId
    ) {
        return ResponseEntity.ok(subscriptionService.cancelUpgrade(farmId, subscriptionUpgradeRequestId));
    }

    @PostMapping("/renew/{farmId}/{subscriptionId}")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<SubscriptionDTO> renew(@PathVariable Long farmId, @PathVariable Long subscriptionId) {
        return ResponseEntity.ok(subscriptionService.renew(farmId, subscriptionId));
    }
}
