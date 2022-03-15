package com.familytree.service.familytree;

import com.familytree.domain.familytree.Person;
import com.familytree.repository.graph.PersonRepository;
import com.familytree.service.util.exception.BadRequestException;
import com.familytree.web.rest.vm.familytree.*;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TreeService {

    private final Logger log = LoggerFactory.getLogger(TreeService.class);

    private final PersonRepository personRepository;

    public TreeService(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    @Transactional(readOnly = true)
    public List<Person> getTree(Long familyTreeId) {
        List<Person> list = personRepository.findByFamilyTreeId(familyTreeId);

        return list;
    }

    @Transactional
    public Person addPerson(AddPersonVM person) {
        Person newPerson = personRepository.save(person.toEntity());

        if (person.getHeadOfHousehold() != null) {
            personRepository
                .findById(person.getHeadOfHousehold())
                .ifPresent(
                    it -> {
                        if (it.getChildren() != null) {
                            it.getChildren().add(newPerson);
                            it.setChildren(it.getChildren());
                        } else {
                            Set<Person> set = new HashSet<>();
                            set.add(newPerson);
                            it.setChildren(set);
                        }
                        personRepository.save(it);
                    }
                );
        }

        if (person.getSpouse() != null) {
            personRepository
                .findById(person.getSpouse())
                .ifPresent(
                    it -> {
                        if (it.getWifes() != null) {
                            it.getWifes().add(newPerson);
                            it.setWifes(it.getWifes());
                        } else {
                            Set<Person> set = new HashSet<>();
                            set.add(newPerson);
                            it.setWifes(set);
                        }
                        personRepository.save(it);
                    }
                );
        }

        return newPerson;
    }

    @Transactional
    public Person updatePerson(UpdatePersonVM person) {
        return personRepository
            .findById(person.getId())
            .map(
                it -> {
                    it.setName(person.getName());
                    it.setDateOfBirth(person.getDateOfBirth());
                    it.setGender(person.getGender());
                    it.setStatus(person.getStatus());
                    it.setDescription(person.getDescription());
                    it.setMobileNumber(person.getMobileNumber());
                    it.setJob(person.getJob());
                    return personRepository.save(it);
                }
            )
            .orElseThrow(() -> new BadRequestException("not_found"));
    }

    @Transactional
    public void addRelationship(AddRelationshipVM relationship) {
        personRepository
            .findById(relationship.getId())
            .map(
                it -> {
                    if (relationship.getHeadOfHousehold() != null) {
                        personRepository
                            .findById(relationship.getHeadOfHousehold())
                            .ifPresent(
                                head -> {
                                    if (head.getChildren() != null) {
                                        head.getChildren().add(it);
                                        head.setChildren(head.getChildren());
                                    } else {
                                        Set<Person> set = new HashSet<>();
                                        set.add(it);
                                        head.setChildren(set);
                                    }
                                    personRepository.save(head);
                                }
                            );
                    }

                    if (relationship.getSpouse() != null) {
                        personRepository
                            .findById(relationship.getSpouse())
                            .ifPresent(
                                spouse -> {
                                    if (spouse.getWifes() != null) {
                                        spouse.getWifes().add(it);
                                        spouse.setWifes(spouse.getWifes());
                                    } else {
                                        Set<Person> set = new HashSet<>();
                                        set.add(it);
                                        spouse.setWifes(set);
                                    }
                                    personRepository.save(spouse);
                                }
                            );
                    }
                    return it;
                }
            )
            .orElseThrow(() -> new BadRequestException("not_found"));
    }

    @Transactional
    public void deletePerson(DeletePersonVM person) {
        personRepository.delete(personRepository.findById(person.getId()).orElseThrow(() -> new BadRequestException("not_found")));
    }
}
