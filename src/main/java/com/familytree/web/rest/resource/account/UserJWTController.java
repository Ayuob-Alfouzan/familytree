package com.familytree.web.rest.resource.account;

import com.familytree.security.DetailedUser;
import com.familytree.security.jwt.JWTFilter;
import com.familytree.security.jwt.TokenProvider;
import com.familytree.service.account.UserLoginService;
import com.familytree.service.util.CaptchaService;
import com.familytree.service.util.HttpServletRequestUtil;
import com.familytree.service.util.exception.BadRequestException;
import com.familytree.web.rest.vm.account.JWTToken;
import com.familytree.web.rest.vm.account.LoginVM;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 * Controller to authenticate users.
 */
@RestController
@RequestMapping("/api")
public class UserJWTController {

    private final TokenProvider tokenProvider;

    private final AuthenticationManagerBuilder authenticationManagerBuilder;

    private final CaptchaService captchaService;

    private final UserLoginService userLoginService;

    public UserJWTController(
        TokenProvider tokenProvider,
        AuthenticationManagerBuilder authenticationManagerBuilder,
        CaptchaService captchaService,
        UserLoginService userLoginService
    ) {
        this.tokenProvider = tokenProvider;
        this.authenticationManagerBuilder = authenticationManagerBuilder;
        this.captchaService = captchaService;
        this.userLoginService = userLoginService;
    }

    @PostMapping("/authenticate")
    public ResponseEntity<JWTToken> authorize(@Valid @RequestBody LoginVM loginVM, HttpServletRequest request) {
        captchaService.verifyCaptcha(loginVM.getCaptchaResponse(), HttpServletRequestUtil.getClientIpAddr(request));

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
            loginVM.getEmail(),
            loginVM.getPassword()
        );

        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        if (authentication.getPrincipal() instanceof DetailedUser) {
            DetailedUser detailedUser = (DetailedUser) authentication.getPrincipal();
            SecurityContextHolder.getContext().setAuthentication(authentication);
            boolean rememberMe = loginVM.getRememberMe() != null && loginVM.getRememberMe();
            String jwt = tokenProvider.createToken(authentication, rememberMe, detailedUser.getUserId());
            HttpHeaders httpHeaders = new HttpHeaders();
            httpHeaders.add(JWTFilter.AUTHORIZATION_HEADER, "Bearer " + jwt);

            userLoginService.addUserLogin(detailedUser.getUserId());

            return new ResponseEntity<>(new JWTToken(jwt), httpHeaders, HttpStatus.OK);
        } else {
            SecurityContext context = SecurityContextHolder.getContext();
            context.setAuthentication(null);
            SecurityContextHolder.clearContext();
            throw new BadRequestException("login.issue_in_login");
        }
    }
}
