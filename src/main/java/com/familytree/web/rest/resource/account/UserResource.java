package com.familytree.web.rest.resource.account;

import com.familytree.security.AuthoritiesConstants;
import com.familytree.service.account.UserService;
import com.familytree.service.dto.account.SuitableUserDTO;
import com.familytree.web.rest.vm.account.*;
import java.util.List;
import javax.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserResource {

    private final Logger log = LoggerFactory.getLogger(UserResource.class);

    private final UserService userService;

    public UserResource(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/find-suitable")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<List<SuitableUserDTO>> register(@Valid @RequestBody FindSuitableUserRequestVM requestVM) {
        return ResponseEntity.ok(userService.findSuitableUsers(requestVM));
    }
}
