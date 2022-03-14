package com.familytree.service.mapper.subscription;

import com.familytree.domain.subscription.SubscriptionUpgradeRequest;
import com.familytree.service.dto.subscription.SubscriptionUpgradeRequestDTO;
import com.familytree.service.mapper.EntityMapper;
import com.familytree.service.mapper.util.LookupMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = { LookupMapper.class, InvoiceMapper.class, PackageMapper.class })
public interface SubscriptionUpgradeRequestMapper extends EntityMapper<SubscriptionUpgradeRequestDTO, SubscriptionUpgradeRequest> {
    @Mapping(source = "familyTree.id", target = "familyTreeId")
    @Mapping(source = "aPackage", target = "packageDTO")
    SubscriptionUpgradeRequestDTO toDto(SubscriptionUpgradeRequest subscriptionUpgradeRequest);
}
