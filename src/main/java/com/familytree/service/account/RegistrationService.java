package com.familytree.service.account;

import static com.familytree.config.Constants.OTP_LENGTH;
import static java.time.temporal.ChronoUnit.MINUTES;

import com.familytree.config.ApplicationProperties;
import com.familytree.config.Constants;
import com.familytree.domain.account.User;
import com.familytree.repository.account.UserRepository;
import com.familytree.service.util.MailService;
import com.familytree.service.util.exception.BadRequestException;
import com.familytree.web.rest.vm.account.RegisterVM;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import javax.transaction.Transactional;
import org.apache.commons.lang3.RandomStringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Service class for managing registrations.
 */
@Service
public class RegistrationService {

    private final Logger log = LoggerFactory.getLogger(RegistrationService.class);

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final MailService mailService;

    private final ApplicationProperties applicationProperties;

    public RegistrationService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        MailService mailService,
        ApplicationProperties applicationProperties
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailService = mailService;
        this.applicationProperties = applicationProperties;
    }

    @Transactional
    public User register(RegisterVM vm) {
        // check if email already registered
        userRepository
            .findOneByEmailIgnoreCase(vm.getEmail())
            .ifPresent(
                it -> {
                    throw new BadRequestException("registration.email_already_used");
                }
            );

        User user = new User();
        user.setEmail(vm.getEmail().toLowerCase());
        user.setFirstName(vm.getFirstName());
        user.setLastName(vm.getLastName());
        user.setPassword(passwordEncoder.encode(vm.getPassword()));
        user.setLangKey(vm.getLanguage());
        user.setToken(RandomStringUtils.randomNumeric(OTP_LENGTH));
        user.setType(Constants.USER_KEY);

        return userRepository.save(user);
    }

    @Transactional
    public User resendActivationOTP(String email) {
        // check if email already registered and not active
        Optional<User> notActiveUser = userRepository.findOneByEmailIgnoreCaseAndRecordActivityIsTrue(email);

        if (notActiveUser.isPresent()) {
            User user = notActiveUser.get();

            if (user.isActivated()) {
                throw new BadRequestException("registration.user_is_active");
            } else {
                if (user.getLastModifiedDate().isBefore(Instant.now().minus(2, MINUTES))) {
                    // renew the token and resend the email
                    user.setToken(RandomStringUtils.randomNumeric(OTP_LENGTH));
                    return userRepository.save(user);
                } else {
                    throw new BadRequestException("registration.rate_limit");
                }
            }
        } else {
            throw new BadRequestException("registration.user_not_found");
        }
    }

    @Transactional
    public User verifyActivationOTP(String email, String otp) {
        // check if email already registered and not active
        Optional<User> notActiveUser = userRepository.findOneByEmailIgnoreCaseAndRecordActivityIsTrue(email);

        if (notActiveUser.isPresent()) {
            User user = notActiveUser.get();

            if (user.isActivated()) {
                throw new BadRequestException("registration.user_is_active");
            } else {
                // check the otp
                if (
                    user.getLastModifiedDate() == null || user.getLastModifiedDate().isBefore(Instant.now().minus(5L, ChronoUnit.MINUTES))
                ) {
                    throw new BadRequestException("forgot_password.old_otp");
                } else if (
                    (!applicationProperties.getOtp().getEnabled() && otp.equalsIgnoreCase(applicationProperties.getOtp().getCode())) ||
                    user.getToken().contentEquals(otp)
                ) {
                    user.setActivated(true);
                    return userRepository.save(user);
                } else {
                    throw new BadRequestException("registration.otp_is_invalid");
                }
            }
        } else {
            throw new BadRequestException("registration.user_not_found");
        }
    }
}
