package com.familytree.service.util;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

public class CommonUtil {

    public static String getFirstWord(String str) {
        if (str != null && !str.isEmpty()) {
            if (str.contains(" ")) {
                return str.substring(0, str.indexOf(" "));
            } else {
                return str;
            }
        } else {
            return str;
        }
    }

    public static String getLastWord(String str) {
        if (str != null && !str.isEmpty()) {
            if (str.contains(" ")) {
                return str.substring(str.indexOf(" "));
            } else {
                return str;
            }
        } else {
            return str;
        }
    }

    public static String formatDate(Instant date) {
        return formatDate(date, "dd/MM/yyyy");
    }

    public static String formatDate(Instant date, String pattern) {
        if (date == null) return "";

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(pattern).withZone(ZoneId.systemDefault());

        return formatter.format(date);
    }

    public static double round(double value, int places) {
        if (places < 0) throw new IllegalArgumentException();

        BigDecimal bd = BigDecimal.valueOf(value);
        bd = bd.setScale(places, RoundingMode.HALF_UP);
        return bd.doubleValue();
    }
}
