package com.familytree.service.mapper.familytree;

import com.familytree.domain.familytree.FamilyTree;
import com.familytree.domain.familytree.Person;
import com.familytree.service.dto.familytree.FamilyTreeDTO;
import com.familytree.service.dto.familytree.PersonDTO;
import com.familytree.service.mapper.EntityMapper;
import com.familytree.service.mapper.util.LookupMapper;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {})
public interface PersonMapper extends EntityMapper<PersonDTO, Person> {
    PersonDTO toDto(Person Person);

    @AfterMapping
    default PersonDTO sortChildren(@MappingTarget PersonDTO personDTO) {
        if (personDTO != null && personDTO.getChildren() != null && personDTO.getChildren().size() > 0) {
            personDTO.getChildren().sort(Comparator.comparing(PersonDTO::getDateOfBirth));
        }

        return personDTO;
    }
}
