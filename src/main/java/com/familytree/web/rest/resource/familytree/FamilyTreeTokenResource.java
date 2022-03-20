package com.familytree.web.rest.resource.familytree;

import com.familytree.domain.familytree.FamilyTree;
import com.familytree.security.AuthoritiesConstants;
import com.familytree.service.dto.familytree.*;
import com.familytree.service.familytree.FamilyTreeTokenService;
import com.familytree.web.rest.vm.familytree.*;
import javax.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for managing registration services.
 */
@RestController
@RequestMapping("/api/family-tree-token")
public class FamilyTreeTokenResource {

    private final Logger log = LoggerFactory.getLogger(FamilyTreeTokenResource.class);

    private final FamilyTreeTokenService familyTreeTokenService;

    public FamilyTreeTokenResource(FamilyTreeTokenService familyTreeTokenService) {
        this.familyTreeTokenService = familyTreeTokenService;
    }

    @PostMapping("/list")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<Page<FamilyTreeTokenDTO>> list(@RequestBody FamilyTreeTokenCriteria criteria, Pageable pageable) {
        return ResponseEntity.ok(familyTreeTokenService.list(criteria, pageable));
    }

    @PostMapping("/add")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<FamilyTreeTokenDTO> add(@Valid @RequestBody AddFamilyTreeTokenRequestVM requestVM) {
        return ResponseEntity.ok(familyTreeTokenService.add(requestVM));
    }

    @PostMapping("/delete")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<FamilyTreeTokenDTO> delete(@Valid @RequestBody DeleteFamilyTreeTokenRequestVM requestVM) {
        return ResponseEntity.ok(familyTreeTokenService.delete(requestVM));
    }
}
