package com.familytree.service.mapper.familytree;

import com.familytree.domain.familytree.FamilyTree;
import com.familytree.service.dto.familytree.FamilyTreeDTO;
import com.familytree.service.mapper.EntityMapper;
import com.familytree.service.mapper.util.LookupMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = { LookupMapper.class, FamilyTreeUserMapper.class })
public interface FamilyTreeMapper extends EntityMapper<FamilyTreeDTO, FamilyTree> {
    FamilyTreeDTO toDto(FamilyTree familyTree);
}
