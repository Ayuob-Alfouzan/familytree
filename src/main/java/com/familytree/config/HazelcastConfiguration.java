package com.familytree.config;

import com.hazelcast.config.Config;
import com.hazelcast.config.MapConfig;
import com.hazelcast.config.MaxSizeConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class HazelcastConfiguration {

    public static final String BUCKETS = "buckets";

    @Bean
    public Config hazelCastConfig() {
        return new Config()
            .setInstanceName("hazelcast-instance")
            .addMapConfig(
                new MapConfig()
                    .setName(BUCKETS)
                    .setMaxSizeConfig(new MaxSizeConfig(20000000, MaxSizeConfig.MaxSizePolicy.FREE_HEAP_SIZE))
                    .setTimeToLiveSeconds(120)
            );
    }
}
