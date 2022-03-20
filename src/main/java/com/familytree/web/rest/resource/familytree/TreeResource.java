package com.familytree.web.rest.resource.familytree;

import com.familytree.security.AuthoritiesConstants;
import com.familytree.service.dto.familytree.AnonPersonDTO;
import com.familytree.service.dto.familytree.PersonDTO;
import com.familytree.service.familytree.TreeService;
import com.familytree.web.rest.vm.familytree.*;
import javax.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tree")
public class TreeResource {

    private final Logger log = LoggerFactory.getLogger(TreeResource.class);

    private final TreeService treeService;

    public TreeResource(TreeService treeService) {
        this.treeService = treeService;
    }

    @GetMapping("/get-family/{familyTreeId}")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<PersonDTO> getFamilyTree(@Valid @PathVariable Long familyTreeId) {
        return ResponseEntity.ok(treeService.getTree(familyTreeId));
    }

    @GetMapping("/get-family-anon/{token}")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<AnonPersonDTO> getFamilyTreeAnon(@Valid @PathVariable String token) {
        return ResponseEntity.ok(treeService.getTreeAnon(token));
    }

    @PostMapping("/add-child")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<PersonDTO> addChild(@RequestBody @Valid AddChildVM person) {
        return ResponseEntity.ok().body(treeService.addChild(person));
    }

    @PostMapping("/add-father")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<PersonDTO> addFather(@RequestBody @Valid AddFatherVM person) {
        return ResponseEntity.ok().body(treeService.addFather(person));
    }

    @PostMapping("/update-person")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<PersonDTO> updatePerson(@RequestBody @Valid UpdatePersonVM person) {
        return ResponseEntity.ok().body(treeService.updatePerson(person));
    }

    @PostMapping("/delete-person")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<PersonDTO> deletePerson(@RequestBody @Valid DeletePersonVM person) {
        return ResponseEntity.ok().body(treeService.deletePerson(person));
    }

    @PostMapping("/adda-person")
    @Transactional
    public void addPerson() {
        treeService.addPerson();
    }
}
