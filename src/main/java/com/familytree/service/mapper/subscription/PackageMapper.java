package com.familytree.service.mapper.subscription;

import com.familytree.config.ApplicationProperties;
import com.familytree.domain.subscription.Package;
import com.familytree.service.dto.subscription.PackageDTO;
import com.familytree.service.mapper.util.LookupMapper;
import com.familytree.service.util.CommonUtil;

import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring", uses = { LookupMapper.class })
public abstract class PackageMapper {

    @Autowired
    private ApplicationProperties applicationProperties;

    @Mapping(source = "cost", target = "cost", qualifiedByName = "calculateCost")
    public abstract PackageDTO toDto(Package aPackage);

    @Mapping(source = "cost", target = "cost", qualifiedByName = "calculateCost")
    public abstract List<PackageDTO> toDto(List<Package> aPackage);

    @Named("calculateCost")
    Double calculateCost(Double cost) {
        return CommonUtil.round((1D + (applicationProperties.getSubscription().getVatPercentage() / 100)) * cost, 2);
    }
}
