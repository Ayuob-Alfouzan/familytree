package com.familytree.service.util;

import static com.familytree.config.Constants.ARABIC_LANGUAGE_TRANSLATION_KEY;

import com.familytree.domain.account.User;
import com.familytree.domain.farm.SheepTreatment;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.util.*;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;
import tech.jhipster.config.JHipsterProperties;

/**
 * Service for sending emails.
 * <p>
 * We use the {@link Async} annotation to send emails asynchronously.
 */
@Service
public class MailService {

    private final Logger log = LoggerFactory.getLogger(MailService.class);

    private static final String USER = "user";

    private static final String BASE_URL = "baseUrl";

    private final JHipsterProperties jHipsterProperties;

    private final JavaMailSender javaMailSender;

    private final MessageSource messageSource;

    private final SpringTemplateEngine templateEngine;

    public MailService(
        JHipsterProperties jHipsterProperties,
        JavaMailSender javaMailSender,
        MessageSource messageSource,
        SpringTemplateEngine templateEngine
    ) {
        this.jHipsterProperties = jHipsterProperties;
        this.javaMailSender = javaMailSender;
        this.messageSource = messageSource;
        this.templateEngine = templateEngine;
    }

    @Async
    public void sendEmail(String to, String subject, String content, boolean isMultipart, boolean isHtml) {
        log.debug(
            "Send email[multipart '{}' and html '{}'] to '{}' with subject '{}' and content={}",
            isMultipart,
            isHtml,
            to,
            subject,
            content
        );

        // Prepare message using a Spring helper
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper message = new MimeMessageHelper(mimeMessage, isMultipart, StandardCharsets.UTF_8.name());
            message.setTo(to);
            message.setFrom(jHipsterProperties.getMail().getFrom(), "شجرة العائلة | Family Tree");
            message.setSubject(subject);
            message.setText(content, isHtml);
            javaMailSender.send(mimeMessage);
            log.debug("Sent email to User '{}'", to);
        } catch (MailException | MessagingException | UnsupportedEncodingException e) {
            log.warn("Email could not be sent to user '{}'", to, e);
        }
    }

    @Async
    public void sendEmailFromTemplate(Map<String, Object> var, String email, String templateName, String titleKey) {
        Locale locale = new Locale(ARABIC_LANGUAGE_TRANSLATION_KEY);
        Context context = new Context(locale);
        context.setVariables(var);
        context.setVariable(BASE_URL, jHipsterProperties.getMail().getBaseUrl());
        String content = templateEngine.process(templateName, context);
        sendEmail(email, titleKey, content, false, true);
    }

    @Async
    public void sendActivationEmail(User user) {
        log.debug("Sending activation email to '{}'", user.getEmail());

        HashMap<String, Object> var = new HashMap<>();
        var.put("token", user.getToken());

        sendEmailFromTemplate(var, user.getEmail(), "mail/activationEmail", "OTP Code | رمز التحقق");
    }

    @Async
    public void sendResetPasswordMail(User user) {
        log.debug("Sending reset password to '{}'", user.getEmail());

        HashMap<String, Object> var = new HashMap<>();
        var.put("token", user.getToken());

        sendEmailFromTemplate(var, user.getEmail(), "mail/resetPasswordEmail", "رمز التحقق | OTP Code");
    }

    @Async
    public void sendLambingEmail(List<String> emails, String number, String name, Integer numberOfLambs) {
        log.debug("Sending lambing emails to '{}'", emails);

        HashMap<String, Object> var = new HashMap<>();
        var.put("number", number);
        var.put("name", name);
        var.put("numberOfLambs", numberOfLambs);

        emails.forEach(x -> sendEmailFromTemplate(var, x, "mail/lambingEmail", "Lambing Notification | تنبيه ولادة"));
    }

    @Async
    public void sendTreatmentNotificationEmail(List<String> emails, List<SheepTreatment> sheepTreatments) {
        log.debug("Sending treatment notification emails to '{}'", emails);
        List<HashMap<String, String>> treatments = new ArrayList<>();

        sheepTreatments.forEach(
            it -> {
                HashMap<String, String> var = new HashMap<>();
                var.put("type", it.getType().getAr());
                var.put("name", it.getName());
                var.put("doseType", it.getDoseType().getAr());

                if (it.getAllSheep()) {
                    var.put("givenTo", "يعطى لكل الغنم");
                } else if (it.getSpecificSheep()) {
                    var.put("givenTo", "يعطى لغنم محددة");
                } else if (it.getSheepType() != null) {
                    var.put("givenTo", it.getSheepType().getAr());
                }
                treatments.add(var);
            }
        );

        HashMap<String, Object> var = new HashMap<>();
        var.put("treatments", treatments);

        emails.forEach(x -> sendEmailFromTemplate(var, x, "mail/treatmentNotificationEmail", "Treatments Remainder | تذكير بعلاجات"));
    }

    @Async
    public void sendVaccineNotificationEmail(List<String> emails, List<HashMap<String, String>> vaccines) {
        log.debug("Sending vaccine notification emails to '{}'", emails);

        HashMap<String, Object> var = new HashMap<>();
        var.put("vaccines", vaccines);

        emails.forEach(x -> sendEmailFromTemplate(var, x, "mail/vaccineNotificationEmail", "Vaccines Remainder | تذكير باللقاحات"));
    }
}
