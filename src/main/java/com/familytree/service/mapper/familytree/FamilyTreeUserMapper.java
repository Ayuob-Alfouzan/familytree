package com.familytree.service.mapper.familytree;

import com.familytree.domain.familytree.FamilyTreeUser;
import com.familytree.service.dto.familytree.FamilyTreeUserDTO;
import com.familytree.service.mapper.EntityMapper;
import com.familytree.service.mapper.util.LookupMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = { LookupMapper.class })
public interface FamilyTreeUserMapper extends EntityMapper<FamilyTreeUserDTO, FamilyTreeUser> {
    @Mapping(source = "familyTree.id", target = "familyTreeId")
    @Mapping(source = "familyTree.nameAr", target = "familyTreeNameAr")
    @Mapping(source = "familyTree.nameEn", target = "familyTreeNameEn")
    @Mapping(source = "familyTree.type", target = "familyTreeType")
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.firstName", target = "userFirstName")
    @Mapping(source = "user.lastName", target = "userLastName")
    @Mapping(source = "user.email", target = "userEmail")
    FamilyTreeUserDTO toDto(FamilyTreeUser familyTreeUser);
}
