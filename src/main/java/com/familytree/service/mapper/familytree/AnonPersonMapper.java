package com.familytree.service.mapper.familytree;

import com.familytree.domain.familytree.Person;
import com.familytree.service.dto.familytree.AnonPersonDTO;
import com.familytree.service.dto.familytree.PersonDTO;
import com.familytree.service.mapper.EntityMapper;
import java.util.Comparator;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {})
public interface AnonPersonMapper extends EntityMapper<AnonPersonDTO, Person> {
    AnonPersonDTO toDto(Person Person);

    @AfterMapping
    default AnonPersonDTO sortChildren(@MappingTarget AnonPersonDTO personDTO) {
        if (personDTO != null && personDTO.getChildren() != null && personDTO.getChildren().size() > 0) {
            personDTO.getChildren().sort(Comparator.comparing(AnonPersonDTO::getDateOfBirth));
        }

        return personDTO;
    }
}
