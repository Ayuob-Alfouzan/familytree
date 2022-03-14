package com.familytree.web.rest.resource.account;

import com.familytree.domain.account.User;
import com.familytree.security.AuthoritiesConstants;
import com.familytree.security.DetailedUser;
import com.familytree.security.jwt.JWTFilter;
import com.familytree.security.jwt.TokenProvider;
import com.familytree.service.account.RegistrationService;
import com.familytree.service.account.UserLoginService;
import com.familytree.service.util.CaptchaService;
import com.familytree.service.util.HttpServletRequestUtil;
import com.familytree.service.util.MailService;
import com.familytree.web.rest.vm.account.JWTToken;
import com.familytree.web.rest.vm.account.RegisterVM;
import com.familytree.web.rest.vm.account.ResendActivationOTPVM;
import com.familytree.web.rest.vm.account.VerifyActivationOTPVM;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for managing registration services.
 */
@RestController
@RequestMapping("/api/registration")
public class RegistrationResource {

    private final Logger log = LoggerFactory.getLogger(RegistrationResource.class);

    private final RegistrationService registrationService;

    private final MailService mailService;

    private final TokenProvider tokenProvider;

    private final CaptchaService captchaService;

    private final UserLoginService userLoginService;

    public RegistrationResource(
        RegistrationService registrationService,
        MailService mailService,
        TokenProvider tokenProvider,
        CaptchaService captchaService,
        UserLoginService userLoginService
    ) {
        this.registrationService = registrationService;
        this.mailService = mailService;
        this.tokenProvider = tokenProvider;
        this.captchaService = captchaService;
        this.userLoginService = userLoginService;
    }

    @PostMapping("/register")
    public void register(@Valid @RequestBody RegisterVM requestVM, HttpServletRequest request) {
        captchaService.verifyCaptcha(requestVM.getCaptchaResponse(), HttpServletRequestUtil.getClientIpAddr(request));

        User user = registrationService.register(requestVM);
        mailService.sendActivationEmail(user);
    }

    @PostMapping("/resend-activation-otp")
    public void resendActivationOTP(@Valid @RequestBody ResendActivationOTPVM requestVM, HttpServletRequest request) {
        User user = registrationService.resendActivationOTP(requestVM.getEmail());
        mailService.sendActivationEmail(user);
    }

    @PostMapping("/verify-activation-otp")
    public ResponseEntity<JWTToken> verifyActivationOTP(@Valid @RequestBody VerifyActivationOTPVM requestVM) {
        User user = registrationService.verifyActivationOTP(requestVM.getEmail(), requestVM.getOtp());

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
}
