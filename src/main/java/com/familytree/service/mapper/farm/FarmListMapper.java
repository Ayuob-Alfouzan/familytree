package com.familytree.service.mapper.farm;

import com.familytree.domain.farm.Farm;
import com.familytree.service.dto.farm.FarmListDTO;
import com.familytree.service.mapper.EntityMapper;
import com.familytree.service.mapper.util.LookupMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = { LookupMapper.class })
public interface FarmListMapper extends EntityMapper<FarmListDTO, Farm> {
    FarmListDTO toDto(Farm farm);
}
