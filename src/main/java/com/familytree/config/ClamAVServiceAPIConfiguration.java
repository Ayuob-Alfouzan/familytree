package com.familytree.config;

import com.familytree.service.client.ClamAVClient;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import javax.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ClamAVServiceAPIConfiguration {

    private static Logger logger = LoggerFactory.getLogger(ClamAVServiceAPIConfiguration.class);

    private final ApplicationProperties.FileScanning fileScanningProperties;

    public ClamAVServiceAPIConfiguration(ApplicationProperties applicationProperties) {
        this.fileScanningProperties = applicationProperties.getFileScanning();
    }

    @Bean
    public ClamAVClient clamAVClient() {
        return new ClamAVClient(fileScanningProperties.getIp(), fileScanningProperties.getPort(), fileScanningProperties.getTimeout());
    }

    @PostConstruct
    public void init() {
        ProcessBuilder processBuilder = new ProcessBuilder();
        processBuilder.command("bash", "-c", "clamd --version");
        try {
            Process process = processBuilder.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                logger.info("Clamd version information = {} ", line);
            }
            int exitCode = process.waitFor();
            logger.info("\nExited with error code = {}  ", exitCode);
        } catch (Exception e) {
            logger.error("Exception occurred while getting clamd version = {} ", e.getMessage());
        }
    }
}
