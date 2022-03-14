package com.familytree.service.mapper.subscription;

import com.familytree.config.ApplicationProperties;
import com.familytree.domain.subscription.Subscription;
import com.familytree.service.dto.subscription.SubscriptionDTO;
import com.familytree.service.lookup.SubscriptionStatusEnum;
import com.familytree.service.mapper.util.LookupMapper;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(
    componentModel = "spring",
    uses = { LookupMapper.class, PackageMapper.class, InvoiceMapper.class, SubscriptionUpgradeRequestMapper.class }
)
public abstract class SubscriptionMapper {

    @Autowired
    private ApplicationProperties applicationProperties;

    @Autowired
    private InvoiceMapper invoiceMapper;

    @Autowired
    private LookupMapper lookupMapper;

    @Autowired
    private PackageMapper packageMapper;

    @Mapping(source = "farm.id", target = "farmId")
    @Mapping(source = "invoice.id", target = "invoiceId")
    @Mapping(target = "invoice", ignore = true)
    @Mapping(source = "aPackage", target = "packageDTO")
    @Mapping(source = "subscription", target = "canUpgrade", qualifiedByName = "canUpgrade")
    @Mapping(target = "subscriptionUpgradeRequests", ignore = true)
    public abstract SubscriptionDTO toDto(Subscription subscription);

    @Mapping(source = "farm.id", target = "farmId")
    @Mapping(source = "invoice.id", target = "invoiceId")
    @Mapping(source = "aPackage", target = "packageDTO")
    @Mapping(source = "subscription", target = "canUpgrade", qualifiedByName = "canUpgrade")
    public abstract SubscriptionDTO toDtoWithInvoice(Subscription subscription);

    @Named("canUpgrade")
    Boolean canUpgrade(Subscription subscription) {
        if (
            subscription.getStatus().getCode().equalsIgnoreCase(SubscriptionStatusEnum.Active.value()) &&
            subscription.getaPackage().getCanRenew()
        ) {
            if (subscription.getEndDate().isBefore(Instant.now().plus(3, ChronoUnit.DAYS))) {
                return false;
            } else if (subscription.getSubscriptionUpgradeRequests() != null && subscription.getSubscriptionUpgradeRequests().size() > 0) {
                return subscription
                    .getSubscriptionUpgradeRequests()
                    .stream()
                    .noneMatch(it -> it.getStatus().getCode().equalsIgnoreCase(SubscriptionStatusEnum.WaitingForPayment.value()));
            } else {
                return true;
            }
        } else {
            return false;
        }
    }
}
