package com.familytree.web.rest.resource.subscription;

import com.familytree.security.AuthoritiesConstants;
import com.familytree.service.dto.subscription.PackageDTO;
import com.familytree.service.mapper.subscription.PackageMapper;
import com.familytree.service.subscription.PackageService;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/package")
public class PackageResource {

    private final Logger log = LoggerFactory.getLogger(PackageResource.class);

    private final PackageService packageService;

    private final PackageMapper packageMapper;

    public PackageResource(PackageService packageService, PackageMapper packageMapper) {
        this.packageService = packageService;
        this.packageMapper = packageMapper;
    }

    @GetMapping("/list/{familyTreeTypeCode}")
    public ResponseEntity<List<PackageDTO>> list(@PathVariable String familyTreeTypeCode) {
        return ResponseEntity.ok(packageService.listPackagesByFamilyTreeType(familyTreeTypeCode));
    }

    @GetMapping("/list-suitable/{familyTreeId}")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<List<PackageDTO>> listSuitable(@PathVariable Long familyTreeId) {
        return ResponseEntity.ok(packageService.listSuitable(familyTreeId));
    }

    @GetMapping("/list-suitable-for-upgrade/{familyTreeId}/{subscriptionId}")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<List<PackageDTO>> listSuitableForUpgrade(@PathVariable Long familyTreeId, @PathVariable Long subscriptionId) {
        return ResponseEntity.ok(packageService.listSuitableForUpgrade(familyTreeId, subscriptionId));
    }

    @GetMapping("/suitable-for-renew/{familyTreeId}/{subscriptionId}")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<PackageDTO> suitableForRenew(@PathVariable Long familyTreeId, @PathVariable Long subscriptionId) {
        return ResponseEntity.ok(packageMapper.toDto(packageService.suitableForRenew(familyTreeId, subscriptionId)));
    }
}
