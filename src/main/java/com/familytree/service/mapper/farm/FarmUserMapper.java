package com.familytree.service.mapper.farm;

import com.familytree.domain.farm.FarmUser;
import com.familytree.service.dto.farm.FarmUserDTO;
import com.familytree.service.mapper.EntityMapper;
import com.familytree.service.mapper.util.LookupMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = { LookupMapper.class })
public interface FarmUserMapper extends EntityMapper<FarmUserDTO, FarmUser> {
    @Mapping(source = "farm.id", target = "farmId")
    @Mapping(source = "farm.nameAr", target = "farmNameAr")
    @Mapping(source = "farm.nameEn", target = "farmNameEn")
    @Mapping(source = "farm.type", target = "farmType")
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.firstName", target = "userFirstName")
    @Mapping(source = "user.lastName", target = "userLastName")
    @Mapping(source = "user.email", target = "userEmail")
    FarmUserDTO toDto(FarmUser farmUser);
}
