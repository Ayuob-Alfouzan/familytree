package com.familytree.service.util;

import org.apache.tika.Tika;
import org.apache.tika.mime.MimeType;
import org.apache.tika.mime.MimeTypeException;
import org.apache.tika.mime.MimeTypes;

public class ContentTypeDetector {

    private static final Tika TIKA = new Tika();

    /**
     * @param bytes file bytes
     * @param filename optional file name
     */
    public static String getExtension(byte[] bytes, String filename) {
        try {
            String extension = _getMimeType(bytes, filename).getExtension();
            return extension.isEmpty() ? extension : extension.substring(1);
        } catch (MimeTypeException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * @param bytes file bytes
     * @param filename optional file name
     */
    public static String getMimeType(byte[] bytes, String filename) {
        try {
            return _getMimeType(bytes, filename).toString();
        } catch (MimeTypeException e) {
            throw new RuntimeException(e);
        }
    }

    private static MimeType _getMimeType(byte[] bytes, String filename) throws MimeTypeException {
        return MimeTypes.getDefaultMimeTypes().forName(TIKA.detect(bytes, filename));
    }
}
