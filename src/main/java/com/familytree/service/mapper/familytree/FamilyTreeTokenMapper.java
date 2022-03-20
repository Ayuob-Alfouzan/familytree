package com.familytree.service.mapper.familytree;

import com.familytree.config.ApplicationProperties;
import com.familytree.domain.familytree.FamilyTreeToken;
import com.familytree.domain.subscription.Subscription;
import com.familytree.service.dto.familytree.FamilyTreeTokenDTO;
import com.familytree.service.dto.subscription.SubscriptionDTO;
import com.familytree.service.lookup.SubscriptionStatusEnum;
import com.familytree.service.mapper.subscription.InvoiceMapper;
import com.familytree.service.mapper.subscription.PackageMapper;
import com.familytree.service.mapper.subscription.SubscriptionUpgradeRequestMapper;
import com.familytree.service.mapper.util.LookupMapper;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring", uses = {})
public abstract class FamilyTreeTokenMapper {

    @Autowired
    private ApplicationProperties applicationProperties;

    @Mapping(source = "familyTree.id", target = "familyTreeId")
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "familyTreeToken", target = "url", qualifiedByName = "url")
    public abstract FamilyTreeTokenDTO toDto(FamilyTreeToken familyTreeToken);

    @Named("url")
    String url(FamilyTreeToken familyTreeToken) {
        return applicationProperties.getViewTreeAnonUrl() + familyTreeToken.getToken();
    }
}
