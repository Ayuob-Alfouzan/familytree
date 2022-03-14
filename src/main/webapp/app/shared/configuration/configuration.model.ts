export interface ConfigurationModel {
    captchaConfiguration: CaptchaConfigurationModel;
}

export interface CaptchaConfigurationModel {
    enabled: boolean;
    siteKeyInvisible: string;
}