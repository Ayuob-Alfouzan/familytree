package com.familytree.service.util;

import com.familytree.service.subscription.SubscriptionService;
import net.javacrumbs.shedlock.core.SchedulerLock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class JobService {

    private final Logger log = LoggerFactory.getLogger(JobService.class);

    private final SubscriptionService subscriptionService;

    public JobService(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @Scheduled(cron = "0 0 1,7,13,19 * * *")
    @SchedulerLock(name = "expireSubscription", lockAtLeastForString = "PT5M", lockAtMostForString = "PT1H")
    public void expireSubscription() {
        log.info("Starting to expire subscriptions");
        subscriptionService.expireSubscriptions();
        log.info("Finished from expiring subscriptions");
    }
}
