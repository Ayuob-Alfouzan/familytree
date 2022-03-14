package com.familytree.service.account;

import static com.familytree.config.Constants.OTP_LENGTH;
import static java.time.temporal.ChronoUnit.MINUTES;

import com.familytree.config.ApplicationProperties;
import com.familytree.config.Constants;
import com.familytree.domain.account.*;
import com.familytree.repository.account.*;
import com.familytree.security.SecurityUtils;
import com.familytree.service.dto.account.AccountDTO;
import com.familytree.service.dto.account.SuitableUserDTO;
import com.familytree.service.mapper.account.SuitableUserMapper;
import com.familytree.service.util.ImageUtil;
import com.familytree.service.util.exception.BadRequestException;
import com.familytree.web.rest.vm.account.*;
import java.io.IOException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import org.apache.commons.lang3.RandomStringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

/**
 * Service class for managing users.
 */
@Service
public class UserService {

    private final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final ApplicationProperties applicationProperties;

    private final SuitableUserMapper suitableUserMapper;

    public UserService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        ApplicationProperties applicationProperties,
        SuitableUserMapper suitableUserMapper
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.applicationProperties = applicationProperties;
        this.suitableUserMapper = suitableUserMapper;
    }

    @Transactional(readOnly = true)
    public AccountDTO getAccount() {
        User user = userRepository.findByEmailIgnoreCaseAndRecordActivityIsTrueAndActivatedIsTrue(
            SecurityUtils.getCurrentUserEmailOrThrowException()
        );
        return new AccountDTO(user);
    }

    @Transactional
    public User sendResetPasswordOTP(String email) {
        Optional<User> user = userRepository.findOneByEmailIgnoreCaseAndRecordActivityIsTrue(email);

        if (user.isPresent()) {
            User us = user.get();

            if (us.getLastModifiedDate() == null || us.getLastModifiedDate().isBefore(Instant.now().minus(2, MINUTES))) {
                // renew the token and resend the email
                us.setToken(RandomStringUtils.randomNumeric(OTP_LENGTH));
                return userRepository.save(us);
            } else {
                throw new BadRequestException("registration.rate_limit");
            }
        } else {
            throw new BadRequestException("forgot_password.user_not_found");
        }
    }

    @Transactional
    public User resetPassword(ResetPasswordVM vm) {
        Optional<User> user = userRepository.findOneByEmailIgnoreCaseAndRecordActivityIsTrue(vm.getEmail());

        if (user.isPresent()) {
            User us = user.get();

            if (us.getLastModifiedDate() == null || us.getLastModifiedDate().isBefore(Instant.now().minus(5L, ChronoUnit.MINUTES))) {
                throw new BadRequestException("forgot_password.old_otp");
            } else if (
                (!applicationProperties.getOtp().getEnabled() && vm.getOtp().equalsIgnoreCase(applicationProperties.getOtp().getCode())) ||
                us.getToken().contentEquals(vm.getOtp())
            ) {
                us.setPassword(passwordEncoder.encode(vm.getPassword()));
                us.setActivated(true);
                return userRepository.save(us);
            } else {
                throw new BadRequestException("registration.otp_is_invalid");
            }
        } else {
            throw new BadRequestException("forgot_password.user_not_found");
        }
    }

    @Transactional
    public void changeUser(String password) {
        User user = userRepository.findByEmailIgnoreCaseAndRecordActivityIsTrueAndActivatedIsTrue(
            SecurityUtils.getCurrentUserEmailOrThrowException()
        );

        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
    }

    @Transactional(rollbackFor = Exception.class)
    public void updateImage(MultipartFile image) throws IOException {
        User user = userRepository.findByEmailIgnoreCaseAndRecordActivityIsTrueAndActivatedIsTrue(
            SecurityUtils.getCurrentUserEmailOrThrowException()
        );

        user.setFile(image.getBytes());
        user.setThumbnail(ImageUtil.createThumbnail(image.getBytes()));
        user.setFileContentType(image.getContentType());

        userRepository.save(user);
    }

    @Transactional
    public void deleteImage() {
        User user = userRepository.findByEmailIgnoreCaseAndRecordActivityIsTrueAndActivatedIsTrue(
            SecurityUtils.getCurrentUserEmailOrThrowException()
        );

        user.setFile(null);
        user.setFileContentType(null);

        userRepository.save(user);
    }

    @Transactional
    public AccountDTO updateAccount(UpdateAccountVM vm) {
        User user = userRepository.findByEmailIgnoreCaseAndRecordActivityIsTrueAndActivatedIsTrue(
            SecurityUtils.getCurrentUserEmailOrThrowException()
        );

        user.setFirstName(vm.getFirstName());
        user.setLastName(vm.getLastName());
        user.setLangKey(vm.getLangKey());

        userRepository.save(user);

        return new AccountDTO(user);
    }

    @Transactional(readOnly = true)
    public User getUser() {
        return userRepository
            .findOneByEmailIgnoreCaseAndRecordActivityIsTrue(SecurityUtils.getCurrentUserEmailOrThrowException())
            .orElseThrow(() -> new BadRequestException("login.invalid_credentials"));
    }

    @Transactional(readOnly = true)
    public User getUser(Long id) {
        return userRepository
            .findOneByIdAndRecordActivityIsTrue(id)
            .orElseThrow(() -> new BadRequestException("login.invalid_credentials"));
    }

    @Transactional(readOnly = true)
    public User getUser(String email) {
        return userRepository
            .findOneByEmailIgnoreCaseAndRecordActivityIsTrue(email)
            .orElseThrow(() -> new BadRequestException("user_not_found"));
    }

    @Transactional
    public List<SuitableUserDTO> findSuitableUsers(FindSuitableUserRequestVM vm) {
        return suitableUserMapper.toDto(
            userRepository.findByTypeAndEmailContainingIgnoreCaseAndRecordActivityIsTrueAndFamilyTreeUsers_FamilyTree_IdNot(
                Constants.USER_KEY,
                vm.getEmail(),
                vm.getFamilyTreeId()
            )
        );
    }
}
