package com.familytree.service.familytree;

import com.familytree.domain.enumeration.Gender;
import com.familytree.domain.enumeration.LifeStatus;
import com.familytree.domain.familytree.FamilyTree;
import com.familytree.domain.familytree.Person;
import com.familytree.repository.familytree.FamilyTreeRepository;
import com.familytree.repository.graph.PersonRepository;
import com.familytree.service.dto.familytree.PersonDTO;
import com.familytree.service.mapper.familytree.PersonMapper;
import com.familytree.service.util.exception.BadRequestException;
import com.familytree.web.rest.vm.familytree.*;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TreeService {

    private final Logger log = LoggerFactory.getLogger(TreeService.class);

    private final PersonRepository personRepository;

    private final OwnershipService ownershipService;

    private final PersonMapper personMapper;

    private final FamilyTreeRepository familyTreeRepository;

    public TreeService(
        PersonRepository personRepository,
        OwnershipService ownershipService,
        PersonMapper personMapper,
        FamilyTreeRepository familyTreeRepository
    ) {
        this.personRepository = personRepository;
        this.ownershipService = ownershipService;
        this.personMapper = personMapper;
        this.familyTreeRepository = familyTreeRepository;
    }

    @Transactional(readOnly = true)
    public PersonDTO getTree(Long familyTreeId) {
        FamilyTree familyTree = ownershipService.getToViewByFamilyTreeId(familyTreeId);
        Person person = personRepository
            .findByFamilyTreeIdAndIdAndRecordActivityIsTrue(familyTree.getId(), familyTree.getHeadPersonId())
            .orElseThrow(() -> new BadRequestException("not_found"));

        return personMapper.toDto(person);
    }

    @Transactional(propagation = Propagation.MANDATORY)
    public Long addHead(Long familyTreeId) {
        Person person = new Person();
        person.setFamilyTreeId(familyTreeId);
        person.setName("الاب");
        person.setDateOfBirth(Instant.now());
        person.setGender(Gender.MALE);
        person.setStatus(LifeStatus.ALIVE);

        person = personRepository.save(person);
        return person.getId();
    }

    @Transactional
    public PersonDTO addChild(AddChildVM requestVM) {
        FamilyTree familyTree = ownershipService.getToWriteByFamilyTreeId(requestVM.getFamilyTreeId());
        ownershipService.checkFamilyTreePackageLimitation(familyTree.getId(), 1);

        Person person = requestVM.toEntity();

        personRepository
            .findByFamilyTreeIdAndIdAndRecordActivityIsTrue(familyTree.getId(), requestVM.getFatherId())
            .ifPresent(
                it -> {
                    it.getChildren().add(person);
                    personRepository.save(it);
                }
            );

        return personMapper.toDto(person);
    }

    @Transactional
    public PersonDTO addFather(AddFatherVM requestVM) {
        FamilyTree familyTree = ownershipService.getToWriteByFamilyTreeId(requestVM.getFamilyTreeId());
        ownershipService.checkFamilyTreePackageLimitation(familyTree.getId(), 1);

        Person person = requestVM.toEntity();

        Person child = personRepository
            .findByFamilyTreeIdAndIdAndRecordActivityIsTrue(familyTree.getId(), requestVM.getChildId())
            .orElseThrow(() -> new BadRequestException("not_found"));

        person.getChildren().add(child);
        person = personRepository.save(person);

        familyTree.setHeadPersonId(person.getId());
        familyTreeRepository.save(familyTree);
        return personMapper.toDto(person);
    }

    @Transactional
    public PersonDTO updatePerson(UpdatePersonVM requestVM) {
        FamilyTree familyTree = ownershipService.getToWriteByFamilyTreeId(requestVM.getFamilyTreeId());
        ownershipService.checkHasActiveSubscription(familyTree.getId());

        return personMapper.toDto(
            personRepository
                .findByFamilyTreeIdAndIdAndRecordActivityIsTrue(requestVM.getFamilyTreeId(), requestVM.getId())
                .map(
                    it -> {
                        it.setName(requestVM.getName());
                        it.setDateOfBirth(requestVM.getDateOfBirth());
                        it.setGender(requestVM.getGender());
                        it.setStatus(requestVM.getStatus());
                        it.setDescription(requestVM.getDescription());
                        it.setMobileNumber(requestVM.getMobileNumber());
                        it.setJob(requestVM.getJob());
                        return personRepository.save(it);
                    }
                )
                .orElseThrow(() -> new BadRequestException("not_found"))
        );
    }

    @Transactional
    public PersonDTO deletePerson(DeletePersonVM requestVM) {
        FamilyTree familyTree = ownershipService.getToWriteByFamilyTreeId(requestVM.getFamilyTreeId());
        ownershipService.checkHasActiveSubscription(familyTree.getId());

        return personMapper.toDto(
            personRepository
                .findByFamilyTreeIdAndIdAndRecordActivityIsTrue(requestVM.getFamilyTreeId(), requestVM.getId())
                .map(
                    it -> {
                        it.setRecordActivity(false);
                        return personRepository.save(it);
                    }
                )
                .orElseThrow(() -> new BadRequestException("not_found"))
        );
    }

    @Transactional(propagation = Propagation.MANDATORY)
    public void deleteAll(Long familyTreeId) {
        personRepository.deleteAllByFamilyTreeId(familyTreeId);
    }

    @Transactional
    public void addPerson() {
        Person grandfather = new Person();
        grandfather.setFamilyTreeId(1851L);
        grandfather.setName("عبدالله");
        grandfather.setDateOfBirth(Instant.now());
        grandfather.setGender(Gender.MALE);
        grandfather.setStatus(LifeStatus.ALIVE);

        Person person1 = new Person();
        person1.setFamilyTreeId(1851L);
        person1.setName("صالح");
        person1.setDateOfBirth(Instant.now().minus(10, ChronoUnit.DAYS));
        person1.setGender(Gender.MALE);
        person1.setStatus(LifeStatus.ALIVE);

        Person child11 = new Person();
        child11.setFamilyTreeId(1851L);
        child11.setName("امجاد");
        child11.setDateOfBirth(Instant.now());
        child11.setGender(Gender.FEMALE);
        child11.setStatus(LifeStatus.ALIVE);

        Person child12 = new Person();
        child12.setFamilyTreeId(1851L);
        child12.setName("ايوب");
        child12.setDateOfBirth(Instant.now());
        child12.setGender(Gender.MALE);
        child12.setStatus(LifeStatus.ALIVE);

        Person child13 = new Person();
        child13.setFamilyTreeId(1851L);
        child13.setName("معاذ");
        child13.setDateOfBirth(Instant.now());
        child13.setGender(Gender.MALE);
        child13.setStatus(LifeStatus.ALIVE);

        Person child14 = new Person();
        child14.setFamilyTreeId(1851L);
        child14.setName("طارق");
        child14.setDateOfBirth(Instant.now());
        child14.setGender(Gender.MALE);
        child14.setStatus(LifeStatus.ALIVE);

        Person child15 = new Person();
        child15.setFamilyTreeId(1851L);
        child15.setName("عبدالله");
        child15.setDateOfBirth(Instant.now());
        child15.setGender(Gender.MALE);
        child15.setStatus(LifeStatus.ALIVE);

        Person child16 = new Person();
        child16.setFamilyTreeId(1851L);
        child16.setName("زياد");
        child16.setDateOfBirth(Instant.now());
        child16.setGender(Gender.MALE);
        child16.setStatus(LifeStatus.ALIVE);

        Person child17 = new Person();
        child17.setFamilyTreeId(1851L);
        child17.setName("اشراق");
        child17.setDateOfBirth(Instant.now());
        child17.setGender(Gender.FEMALE);
        child17.setStatus(LifeStatus.ALIVE);

        Person child18 = new Person();
        child18.setFamilyTreeId(1851L);
        child18.setName("امتنان");
        child18.setDateOfBirth(Instant.now());
        child18.setGender(Gender.FEMALE);
        child18.setStatus(LifeStatus.ALIVE);

        Person child19 = new Person();
        child19.setFamilyTreeId(1851L);
        child19.setName("ايثار");
        child19.setDateOfBirth(Instant.now());
        child19.setGender(Gender.FEMALE);
        child19.setStatus(LifeStatus.ALIVE);

        Person child110 = new Person();
        child110.setFamilyTreeId(1851L);
        child110.setName("ابتهاج");
        child110.setDateOfBirth(Instant.now());
        child110.setGender(Gender.FEMALE);
        child110.setStatus(LifeStatus.ALIVE);

        Person child111 = new Person();
        child111.setFamilyTreeId(1851L);
        child111.setName("ابيان");
        child111.setDateOfBirth(Instant.now());
        child111.setGender(Gender.FEMALE);
        child111.setStatus(LifeStatus.ALIVE);

        Person child121 = new Person();
        child121.setFamilyTreeId(1851L);
        child121.setName("لولو");
        child121.setDateOfBirth(Instant.now());
        child121.setGender(Gender.FEMALE);
        child121.setStatus(LifeStatus.ALIVE);

        Person child131 = new Person();
        child131.setFamilyTreeId(1851L);
        child131.setName("ساره");
        child131.setDateOfBirth(Instant.now());
        child131.setGender(Gender.FEMALE);
        child131.setStatus(LifeStatus.ALIVE);

        Person child132 = new Person();
        child132.setFamilyTreeId(1851L);
        child132.setName("عزام");
        child132.setDateOfBirth(Instant.now());
        child132.setGender(Gender.MALE);
        child132.setStatus(LifeStatus.ALIVE);

        Person child141 = new Person();
        child141.setFamilyTreeId(1851L);
        child141.setName("وريف");
        child141.setDateOfBirth(Instant.now());
        child141.setGender(Gender.FEMALE);
        child141.setStatus(LifeStatus.ALIVE);

        Person child142 = new Person();
        child142.setFamilyTreeId(1851L);
        child142.setName("البندري");
        child142.setDateOfBirth(Instant.now());
        child142.setGender(Gender.FEMALE);
        child142.setStatus(LifeStatus.ALIVE);

        Person person2 = new Person();
        person2.setFamilyTreeId(1851L);
        person2.setName("يوسف");
        person2.setDateOfBirth(Instant.now().minus(1, ChronoUnit.DAYS));
        person2.setGender(Gender.MALE);
        person2.setStatus(LifeStatus.ALIVE);

        Person child21 = new Person();
        child21.setFamilyTreeId(1851L);
        child21.setName("صبا");
        child21.setDateOfBirth(Instant.now());
        child21.setGender(Gender.FEMALE);
        child21.setStatus(LifeStatus.ALIVE);

        Person child22 = new Person();
        child22.setFamilyTreeId(1851L);
        child22.setName("يعقوب");
        child22.setDateOfBirth(Instant.now());
        child22.setGender(Gender.MALE);
        child22.setStatus(LifeStatus.ALIVE);

        Person person3 = new Person();
        person3.setFamilyTreeId(1851L);
        person3.setName("احمد");
        person3.setDateOfBirth(Instant.now().minus(2, ChronoUnit.DAYS));
        person3.setGender(Gender.MALE);
        person3.setStatus(LifeStatus.ALIVE);

        Person person4 = new Person();
        person4.setFamilyTreeId(1851L);
        person4.setName("فهد");
        person4.setDateOfBirth(Instant.now().minus(3, ChronoUnit.DAYS));
        person4.setGender(Gender.MALE);
        person4.setStatus(LifeStatus.ALIVE);

        child12.getChildren().add(child121);
        child13.getChildren().add(child131);
        child13.getChildren().add(child132);
        child14.getChildren().add(child141);
        child14.getChildren().add(child142);
        person1.getChildren().add(child11);
        person1.getChildren().add(child12);
        person1.getChildren().add(child13);
        person1.getChildren().add(child14);
        person1.getChildren().add(child15);
        person1.getChildren().add(child16);
        person1.getChildren().add(child17);
        person1.getChildren().add(child18);
        person1.getChildren().add(child19);
        person1.getChildren().add(child110);
        person1.getChildren().add(child111);
        person2.getChildren().add(child21);
        person2.getChildren().add(child22);
        grandfather.getChildren().add(person1);
        grandfather.getChildren().add(person2);
        grandfather.getChildren().add(person3);
        grandfather.getChildren().add(person4);
        personRepository.save(grandfather);
    }
}
