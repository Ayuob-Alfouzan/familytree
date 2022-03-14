package com.familytree.service.mapper.util;

import com.familytree.domain.util.Lookup;
import com.familytree.service.dto.util.LookupDTO;
import com.familytree.service.mapper.EntityMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {})
public interface LookupMapper extends EntityMapper<LookupDTO, Lookup> {
    LookupDTO toDto(Lookup lookup);

    Lookup toEntity(LookupDTO lookupDTO);

    default Lookup fromId(Long id) {
        if (id == null) {
            return null;
        }
        Lookup lookup = new Lookup();
        lookup.setId(id);
        return lookup;
    }
}
