package com.familytree.web.rest.vm.util;

import com.familytree.config.ApplicationProperties;

public class ConfigurationVM {
    private CaptchaConfiguration captchaConfiguration;

    public ConfigurationVM(ApplicationProperties applicationProperties) {
        this.captchaConfiguration = new CaptchaConfiguration(applicationProperties.getCaptcha().getEnabled(), applicationProperties.getCaptcha().getSiteKeyInvisible());
    }

    public CaptchaConfiguration getCaptchaConfiguration() {
        return captchaConfiguration;
    }

    public void setCaptchaConfiguration(CaptchaConfiguration captchaConfiguration) {
        this.captchaConfiguration = captchaConfiguration;
    }

    @Override
    public String toString() {
        return "ConfigurationVM{" +
            "captchaConfiguration=" + captchaConfiguration +
            '}';
    }

    public class CaptchaConfiguration {
        private Boolean enabled;
        private String siteKeyInvisible;

        public CaptchaConfiguration(Boolean enabled, String siteKeyInvisible) {
            this.enabled = enabled;
            this.siteKeyInvisible = siteKeyInvisible;
        }

        public String getSiteKeyInvisible() {
            return siteKeyInvisible;
        }

        public void setSiteKeyInvisible(String siteKeyInvisible) {
            this.siteKeyInvisible = siteKeyInvisible;
        }

        public Boolean getEnabled() {
            return enabled;
        }

        public void setEnabled(Boolean enabled) {
            this.enabled = enabled;
        }

        @Override
        public String toString() {
            return "CaptchaConfiguration{" +
                "enabled=" + enabled +
                ", siteKeyInvisible='" + siteKeyInvisible + '\'' +
                '}';
        }
    }
}
