package com.familytree.service.mapper.familytree;

import com.familytree.domain.familytree.FamilyTree;
import com.familytree.domain.familytree.Person;
import com.familytree.service.dto.familytree.FamilyTreeDTO;
import com.familytree.service.dto.familytree.PersonDTO;
import com.familytree.service.mapper.EntityMapper;
import com.familytree.service.mapper.util.LookupMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {})
public interface PersonMapper extends EntityMapper<PersonDTO, Person> {
    PersonDTO toDto(Person Person);
}
