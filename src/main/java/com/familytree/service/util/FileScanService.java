package com.familytree.service.util;

import com.familytree.config.ApplicationProperties;
import com.familytree.service.client.ClamAVClient;
import com.familytree.service.util.exception.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileScanService {

    private final Logger log = LoggerFactory.getLogger(FileScanService.class);

    private final ClamAVClient clamAVClient;

    private final ApplicationProperties.FileScanning fileScanningProperties;

    public FileScanService(ClamAVClient clamAVClient, ApplicationProperties applicationProperties) {
        this.clamAVClient = clamAVClient;
        this.fileScanningProperties = applicationProperties.getFileScanning();
    }

    public void scanFile(Long id, String name, MultipartFile file) {
        if (!fileScanningProperties.getEnabled()) {
            log.info("Scanning is disabled");
            return;
        }

        log.info("Starting to scan file {} related to {}", name, id);

        long startTime = System.currentTimeMillis();
        boolean status;

        try {
            byte[] response = clamAVClient.scan(file.getInputStream());
            status = ClamAVClient.isCleanReply(response);
            log.info(
                "File {} related to {} has been scanned and having issues is {}, it took {}",
                name,
                id,
                !status,
                System.currentTimeMillis() - startTime
            );
        } catch (Exception e) {
            log.error("Exception occurred while scanning using clam av = {} ", e.getMessage());
            throw new RuntimeException("Scanning is not available");
        }

        if (!status) {
            throw new BadRequestException("attachment.mal_file");
        }
    }
}
