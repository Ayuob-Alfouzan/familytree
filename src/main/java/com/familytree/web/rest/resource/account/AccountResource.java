package com.familytree.web.rest.resource.account;

import com.familytree.domain.account.User;
import com.familytree.security.AuthoritiesConstants;
import com.familytree.security.DetailedUser;
import com.familytree.security.jwt.JWTFilter;
import com.familytree.security.jwt.TokenProvider;
import com.familytree.service.account.*;
import com.familytree.service.dto.account.*;
import com.familytree.service.util.CaptchaService;
import com.familytree.service.util.HttpServletRequestUtil;
import com.familytree.service.util.MailService;
import com.familytree.web.rest.vm.account.*;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for managing the current user's account.
 */
@RestController
@RequestMapping("/api")
public class AccountResource {

    private final Logger log = LoggerFactory.getLogger(AccountResource.class);
    private final UserService userService;
    private final CaptchaService captchaService;
    private final TokenProvider tokenProvider;
    private final MailService mailService;
    private final UserLoginService userLoginService;

    public AccountResource(
        UserService userService,
        CaptchaService captchaService,
        TokenProvider tokenProvider,
        MailService mailService,
        UserLoginService userLoginService
    ) {
        this.userService = userService;
        this.captchaService = captchaService;
        this.tokenProvider = tokenProvider;
        this.mailService = mailService;
        this.userLoginService = userLoginService;
    }

    @GetMapping("/account")
    public ResponseEntity<AccountDTO> getAccount() {
        return ResponseEntity.ok(userService.getAccount());
    }

    @PostMapping("/account/forgot-password/send-otp")
    public void sendOTP(@Valid @RequestBody ForgotPasswordVM requestVM, HttpServletRequest request) {
        captchaService.verifyCaptcha(requestVM.getCaptchaResponse(), HttpServletRequestUtil.getClientIpAddr(request));

        User user = userService.sendResetPasswordOTP(requestVM.getEmail());
        mailService.sendResetPasswordMail(user);
    }

    @PostMapping("/account/forgot-password/reset-password")
    public ResponseEntity<JWTToken> verifyOTP(@Valid @RequestBody ResetPasswordVM requestVM) {
        User user = userService.resetPassword(requestVM);

        // login the user after successfully activated
        // user authorities
        List<GrantedAuthority> grantedAuthorities = AuthoritiesConstants.getAuthorities(user.getType());

        DetailedUser detailedUser = new DetailedUser(user.getEmail(), "", grantedAuthorities, user.getId());
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
            detailedUser,
            "",
            detailedUser.getAuthorities()
        );

        SecurityContextHolder.getContext().setAuthentication(authenticationToken);

        String jwt = tokenProvider.createToken(authenticationToken, false, user.getId());
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add(JWTFilter.AUTHORIZATION_HEADER, "Bearer " + jwt);

        userLoginService.addUserLogin(detailedUser.getUserId());

        return new ResponseEntity<>(new JWTToken(jwt), httpHeaders, HttpStatus.OK);
    }

    @PostMapping("/account/change-password")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public void changePassword(@Valid @RequestBody ChangePasswordVM requestVM) {
        userService.changeUser(requestVM.getPassword());
    }

    @PostMapping("/account/update-account")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<AccountDTO> updateAccount(@Valid @RequestBody UpdateAccountVM requestVM) {
        return ResponseEntity.ok(userService.updateAccount(requestVM));
    }
}
