package com.familytree.web.rest.resource.familytree;

import com.familytree.domain.enumeration.Gender;
import com.familytree.domain.enumeration.LifeStatus;
import com.familytree.domain.familytree.Person;
import com.familytree.repository.graph.PersonRepository;
import com.familytree.security.AuthoritiesConstants;
import com.familytree.service.dto.familytree.PersonDTO;
import com.familytree.service.familytree.TreeService;
import com.familytree.web.rest.vm.familytree.*;
import java.net.URISyntaxException;
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
    private final PersonRepository personRepository;

    public TreeResource(TreeService treeService, PersonRepository personRepository) {
        this.treeService = treeService;
        this.personRepository = personRepository;
    }

    @GetMapping("/get-family/{familyTreeId}")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<PersonDTO> getFamilyTree(@Valid @PathVariable Long familyTreeId) throws URISyntaxException {
        return ResponseEntity.ok(treeService.getTree(familyTreeId));
    }

    @PostMapping("/add-person")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<Person> addPerson(@RequestBody @Valid AddPersonVM person) throws URISyntaxException {
        return ResponseEntity.ok().body(treeService.addPerson(person));
    }

    @PostMapping("/add-relationship")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<Boolean> addRelationship(@RequestBody @Valid AddRelationshipVM relationship) throws URISyntaxException {
        treeService.addRelationship(relationship);
        return ResponseEntity.ok(true);
    }

    @PostMapping("/update-person")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<Person> updatePerson(@RequestBody @Valid UpdatePersonVM person) throws URISyntaxException {
        return ResponseEntity.ok().body(treeService.updatePerson(person));
    }

    @PostMapping("/delete-person")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<Boolean> deletePerson(@RequestBody @Valid DeletePersonVM person) throws URISyntaxException {
        treeService.deletePerson(person);
        return ResponseEntity.ok().body(true);
    }

    @PostMapping("/adda-person")
    @Transactional
    public void addPerson() {
        treeService.addPerson();
    }
}
