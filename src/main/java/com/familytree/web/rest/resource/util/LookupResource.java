package com.familytree.web.rest.resource.util;

import com.familytree.security.AuthoritiesConstants;
import com.familytree.service.dto.util.*;
import com.familytree.service.lookup.LookupService;
import com.familytree.web.rest.vm.util.*;
import java.util.Arrays;
import java.util.List;
import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/lookup")
public class LookupResource {

    private final LookupService lookupService;

    public LookupResource(LookupService lookupService) {
        this.lookupService = lookupService;
    }

    @GetMapping
    public ResponseEntity<List<LookupDTO>> get(@Valid @RequestParam @NotNull @NotEmpty String category) {
        return ResponseEntity.ok(lookupService.getByCategory(category));
    }

    @PostMapping("/list")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<Page<LookupDTO>> list(@RequestBody LookupCriteria criteria, Pageable pageable) {
        return ResponseEntity.ok(lookupService.list(criteria, pageable));
    }

    @PostMapping("/list-categories")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<List<LookupDTO>> listCategories() {
        List<LookupDTO> list = Arrays.asList(
            //            new LookupDTO(LookupCategory.Gender.value(), "الجنس", "Gender", null),
        );
        return ResponseEntity.ok(list);
    }

    @PostMapping("/add")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<LookupDTO> add(@Valid @RequestBody AddLookupRequestVM requestVM) {
        return ResponseEntity.ok(lookupService.add(requestVM));
    }

    @PostMapping("/edit")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<LookupDTO> edit(@Valid @RequestBody EditLookupRequestVM requestVM) {
        return ResponseEntity.ok(lookupService.edit(requestVM));
    }
}
