package com.familytree.service.account;

import com.familytree.domain.account.User;
import com.familytree.domain.account.UserLogin;
import com.familytree.repository.account.UserLoginRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service class for managing users.
 */
@Service
public class UserLoginService {

    private final Logger log = LoggerFactory.getLogger(UserLoginService.class);

    private final UserLoginRepository userLoginRepository;

    public UserLoginService(UserLoginRepository userLoginRepository) {
        this.userLoginRepository = userLoginRepository;
    }

    @Async
    @Transactional
    public void addUserLogin(Long userId) {
        UserLogin userLogin = new UserLogin();
        userLogin.setUser(new User().id(userId));
        userLoginRepository.save(userLogin);
    }
}
