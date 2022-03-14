package com.familytree.config;

/**
 * Application constants.
 */
public final class Constants {

    // Regex for acceptable logins
    public static final String LOGIN_REGEX = "^(?>[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*)|(?>[_.@A-Za-z0-9-]+)$";
    public static final String PASSWORD_REGEX = "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$";
    public static final String LANGUAGE_REGEX = "^(ar-ly|en)$";
    public static final String MOBILE_NUMBER_REGEX = "^[0-9]{9}$";
    public static final String VAT_NUMBER_REGEX = "^[0-9]{15}$";

    public static final String SYSTEM = "system";
    public static final String DEFAULT_LANGUAGE = "ar-ly";
    public static final String ARABIC_LANGUAGE_TRANSLATION_KEY = "ar-ly";
    public static final Long SYSTEM_ACCOUNT_ID = 0L;

    public static final String USERNAME_KEY = "username";
    public static final String TRANSACTION_ID_KEY = "transaction_id";

    public static final String USER_KEY = "user";
    public static final String ADMIN_KEY = "admin";

    public static final Integer OTP_LENGTH = 6;

    private Constants() {}
}
