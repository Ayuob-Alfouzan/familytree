package com.familytree.service.mapper.familytree;

import com.familytree.domain.familytree.FamilyTree;
import com.familytree.service.dto.familytree.FamilyTreeListDTO;
import com.familytree.service.mapper.EntityMapper;
import com.familytree.service.mapper.util.LookupMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = { LookupMapper.class })
public interface FamilyTreeListMapper extends EntityMapper<FamilyTreeListDTO, FamilyTree> {
    FamilyTreeListDTO toDto(FamilyTree familyTree);
}
