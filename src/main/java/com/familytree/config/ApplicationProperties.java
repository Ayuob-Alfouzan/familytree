package com.familytree.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Properties specific to FamilyTree.
 * <p>
 * Properties are configured in the {@code application.yml} file.
 * See {@link tech.jhipster.config.JHipsterProperties} for a good example.
 */
@ConfigurationProperties(prefix = "application", ignoreUnknownFields = false)
public class ApplicationProperties {

    private Captcha captcha = new Captcha();
    private FileScanning fileScanning = new FileScanning();
    private Sftp sftp = new Sftp();
    private OTP otp = new OTP();
    private Subscription subscription = new Subscription();
    private String viewTreeAnonUrl = "http://localhost:9001/";

    public String getViewTreeAnonUrl() {
        return viewTreeAnonUrl;
    }

    public void setViewTreeAnonUrl(String viewTreeAnonUrl) {
        this.viewTreeAnonUrl = viewTreeAnonUrl;
    }

    public Subscription getSubscription() {
        return subscription;
    }

    public void setSubscription(Subscription subscription) {
        this.subscription = subscription;
    }

    public OTP getOtp() {
        return otp;
    }

    public void setOtp(OTP otp) {
        this.otp = otp;
    }

    public class OTP {

        private Boolean enabled = false;
        private String code = "123456";

        public Boolean getEnabled() {
            return enabled;
        }

        public void setEnabled(Boolean enabled) {
            this.enabled = enabled;
        }

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }
    }

    public class Subscription {

        private Integer canRenewBeforeDays = 10;
        private Double vatPercentage = 15D;
        private String vatNumber = "123456789012345";
        private String address = "المملكة العربية السعودية، الرياض، طريق الملك فهد";

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }

        public String getVatNumber() {
            return vatNumber;
        }

        public void setVatNumber(String vatNumber) {
            this.vatNumber = vatNumber;
        }

        public Double getVatPercentage() {
            return vatPercentage;
        }

        public void setVatPercentage(Double vatPercentage) {
            this.vatPercentage = vatPercentage;
        }

        public Integer getCanRenewBeforeDays() {
            return canRenewBeforeDays;
        }

        public void setCanRenewBeforeDays(Integer canRenewBeforeDays) {
            this.canRenewBeforeDays = canRenewBeforeDays;
        }
    }

    public Sftp getSftp() {
        return sftp;
    }

    public void setSftp(Sftp sftp) {
        this.sftp = sftp;
    }

    public FileScanning getFileScanning() {
        return fileScanning;
    }

    public void setFileScanning(FileScanning fileScanning) {
        this.fileScanning = fileScanning;
    }

    public class FileScanning {

        private Boolean enabled = true;
        private String ip;
        private Integer port;
        private Integer timeout;

        public Boolean getEnabled() {
            return enabled;
        }

        public void setEnabled(Boolean enabled) {
            this.enabled = enabled;
        }

        public String getIp() {
            return ip;
        }

        public void setIp(String ip) {
            this.ip = ip;
        }

        public Integer getPort() {
            return port;
        }

        public void setPort(Integer port) {
            this.port = port;
        }

        public Integer getTimeout() {
            return timeout;
        }

        public void setTimeout(Integer timeout) {
            this.timeout = timeout;
        }
    }

    public Captcha getCaptcha() {
        return captcha;
    }

    public void setCaptcha(Captcha captcha) {
        this.captcha = captcha;
    }

    public class Captcha {

        private Boolean enabled = true;
        private String recaptchaVerifyUrl = "https://www.google.com/recaptcha/api/siteverify";
        private String siteKeyInvisible = "";
        private String secretKeyInvisible = "";

        public String getSiteKeyInvisible() {
            return siteKeyInvisible;
        }

        public void setSiteKeyInvisible(String siteKeyInvisible) {
            this.siteKeyInvisible = siteKeyInvisible;
        }

        public String getSecretKeyInvisible() {
            return secretKeyInvisible;
        }

        public void setSecretKeyInvisible(String secretKeyInvisible) {
            this.secretKeyInvisible = secretKeyInvisible;
        }

        public Boolean getEnabled() {
            return enabled;
        }

        public void setEnabled(Boolean enabled) {
            this.enabled = enabled;
        }

        public String getRecaptchaVerifyUrl() {
            return recaptchaVerifyUrl;
        }

        public void setRecaptchaVerifyUrl(String recaptchaVerifyUrl) {
            this.recaptchaVerifyUrl = recaptchaVerifyUrl;
        }
    }

    public static class Sftp {

        private String host;
        private String port;
        private String username;
        private String password;

        public String getHost() {
            return host;
        }

        public void setHost(String host) {
            this.host = host;
        }

        public String getPort() {
            return port;
        }

        public void setPort(String port) {
            this.port = port;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}
