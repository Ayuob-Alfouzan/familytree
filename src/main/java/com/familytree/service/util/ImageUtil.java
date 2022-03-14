package com.familytree.service.util;

import java.awt.*;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.Instant;
import java.util.Collections;
import javax.imageio.ImageIO;
import net.coobird.thumbnailator.Thumbnails;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ImageUtil {

    private static final Logger log = LoggerFactory.getLogger(ImageUtil.class);

    private static final Integer LARGEST_DIMENSION = 150;

    public static byte[] createThumbnail(byte[] bytes) {
        log.info("entered {}", Instant.now());
        if (bytes == null) {
            return null;
        }

        try (final ByteArrayOutputStream os = new ByteArrayOutputStream();) {
            Image inImage = ImageIO.read(new ByteArrayInputStream(bytes));
            double scale;

            //find biggest dimension
            if (inImage.getWidth(null) > inImage.getHeight(null)) {
                scale = (double) LARGEST_DIMENSION / (double) inImage.getWidth(null);
            } else {
                scale = (double) LARGEST_DIMENSION / (double) inImage.getHeight(null);
            }

            if (scale >= 1.0d) {
                return bytes;
            }

            Thumbnails.fromInputStreams(Collections.singletonList(new ByteArrayInputStream(bytes))).scale(scale).toOutputStream(os);
            log.info("finished {}", Instant.now());

            return os.toByteArray();
        } catch (Exception e) {
            log.info("issue in creating thumbnail");
            return null;
        }
    }
}
