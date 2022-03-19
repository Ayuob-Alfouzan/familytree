package com.familytree.repository.graph;

import com.familytree.domain.familytree.Person;
import java.util.List;
import java.util.Optional;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;

public interface PersonRepository extends Neo4jRepository<Person, Long> {
    Optional<Person> findByFamilyTreeIdAndIdAndRecordActivityIsTrue(Long familyTreeId, Long personId);

    List<Person> findByFamilyTreeIdAndNameContaining(Long familyTreeId, String name);

    int countByFamilyTreeIdAndRecordActivityIsTrue(Long familyTreeId);
}
