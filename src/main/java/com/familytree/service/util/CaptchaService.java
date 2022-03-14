package com.familytree.service.util;

import com.familytree.config.ApplicationProperties;
import com.familytree.service.util.exception.BadRequestException;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

/**
 * Service for sending emails.
 * <p>
 * We use the {@link Async} annotation to send emails asynchronously.
 */
@Service
public class CaptchaService {

    private final Logger log = LoggerFactory.getLogger(CaptchaService.class);

    private final ApplicationProperties applicationProperties;

    private RestTemplateBuilder restTemplateBuilder;

    public CaptchaService(ApplicationProperties applicationProperties, RestTemplateBuilder restTemplateBuilder) {
        this.applicationProperties = applicationProperties;
        this.restTemplateBuilder = restTemplateBuilder;
    }

    public void verifyCaptcha(String recaptchaResponse, String remoteIp) {
        if (applicationProperties.getCaptcha().getEnabled()) {
            MultiValueMap<String, Object> parameters = new LinkedMultiValueMap<>();
            parameters.add("secret", this.applicationProperties.getCaptcha().getSecretKeyInvisible());
            parameters.add("response", recaptchaResponse);
            parameters.add("remoteip", remoteIp);

            @SuppressWarnings("unchecked")
            Map<String, Object> responseBody =
                this.restTemplateBuilder.build()
                    .postForEntity(applicationProperties.getCaptcha().getRecaptchaVerifyUrl(), parameters, Map.class)
                    .getBody();

            if (!(Boolean) responseBody.get("success")) {
                throw new BadRequestException("captcha.invalid_captcha");
            }
        }
    }
}
