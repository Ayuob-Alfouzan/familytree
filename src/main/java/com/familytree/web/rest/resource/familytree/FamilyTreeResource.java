package com.familytree.web.rest.resource.familytree;

import com.familytree.domain.familytree.FamilyTree;
import com.familytree.security.AuthoritiesConstants;
import com.familytree.service.dto.familytree.FamilyTreeCriteria;
import com.familytree.service.dto.familytree.FamilyTreeDTO;
import com.familytree.service.dto.familytree.FamilyTreeListDTO;
import com.familytree.service.familytree.*;
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
@RequestMapping("/api/family-tree")
public class FamilyTreeResource {

    private final Logger log = LoggerFactory.getLogger(FamilyTreeResource.class);

    private final FamilyTreeService familyTreeService;
    private final FamilyTreeUserService familyTreeUserService;
    private final OwnershipService ownershipService;

    public FamilyTreeResource(
        FamilyTreeService familyTreeService,
        FamilyTreeUserService familyTreeUserService,
        OwnershipService ownershipService
    ) {
        this.familyTreeService = familyTreeService;
        this.familyTreeUserService = familyTreeUserService;
        this.ownershipService = ownershipService;
    }

    @PostMapping("/list-owned")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<Page<FamilyTreeListDTO>> listOwned(@RequestBody FamilyTreeCriteria criteria, Pageable pageable) {
        return ResponseEntity.ok(familyTreeUserService.listOwned(criteria, pageable));
    }

    @PostMapping("/list")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<Page<FamilyTreeListDTO>> list(@RequestBody FamilyTreeCriteria criteria, Pageable pageable) {
        return ResponseEntity.ok(familyTreeUserService.list(criteria, pageable));
    }

    @GetMapping("/get/{id}")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<FamilyTreeDTO> get(@PathVariable("id") Long id) {
        return ResponseEntity.ok(familyTreeService.get(id));
    }

    @PostMapping("/add")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<FamilyTreeDTO> add(@Valid @RequestBody AddFamilyTreeRequestVM requestVM) {
        return ResponseEntity.ok(familyTreeService.add(requestVM));
    }

    @PostMapping("/edit")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<FamilyTreeDTO> edit(@Valid @RequestBody EditFamilyTreeRequestVM requestVM) {
        return ResponseEntity.ok(familyTreeService.edit(requestVM));
    }

    @PostMapping("/delete/{id}")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<FamilyTreeDTO> delete(@PathVariable("id") Long id) {
        return ResponseEntity.ok(familyTreeService.delete(id));
    }

    @PostMapping("/add-user")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<FamilyTreeDTO> addUser(@Valid @RequestBody AddUserRequestVM requestVM) {
        return ResponseEntity.ok(familyTreeService.addUser(requestVM));
    }

    @PostMapping("/remove-user")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<FamilyTreeDTO> removeUser(@Valid @RequestBody RemoveUserRequestVM requestVM) {
        return ResponseEntity.ok(familyTreeService.removeUser(requestVM));
    }

    @PostMapping("/remove/{id}")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public void remove(@PathVariable("id") Long id) {
        familyTreeService.remove(id);
    }

    @GetMapping("/dashboard/{id}")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<FamilyTreeDashboardResponseVM> dashboard(@PathVariable("id") Long id) {
        FamilyTree familyTree = ownershipService.getToViewByFamilyTreeId(id);

        FamilyTreeDashboardResponseVM responseVM = new FamilyTreeDashboardResponseVM();
        responseVM.setNumberOfUsers(familyTreeService.dashboardData(id));

        return ResponseEntity.ok(responseVM);
    }

    @GetMapping("/global-dashboard")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<GlobalFamilyTreeDashboardResponseVM> globalDashboard() {
        GlobalFamilyTreeDashboardResponseVM responseVM = new GlobalFamilyTreeDashboardResponseVM();
        responseVM.setNumberOfOwnedFamilyTrees(familyTreeService.numberOfOwnedFamilyTrees());
        responseVM.setNumberOfFamilyTrees(familyTreeService.numberOfFamilyTrees());
        return ResponseEntity.ok(responseVM);
    }
}
