package com.familytree.service.mapper.farm;

import com.familytree.domain.farm.Farm;
import com.familytree.service.dto.farm.FarmDTO;
import com.familytree.service.mapper.EntityMapper;
import com.familytree.service.mapper.util.LookupMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = { LookupMapper.class, FarmUserMapper.class })
public interface FarmMapper extends EntityMapper<FarmDTO, Farm> {
    FarmDTO toDto(Farm farm);
}
