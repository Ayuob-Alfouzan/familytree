package com.familytree.repository.account;

import com.familytree.domain.account.User;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the {@link User} entity.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    Optional<User> findOneByEmailIgnoreCase(String email);
    Optional<User> findOneByEmailIgnoreCaseAndRecordActivityIsTrue(String email);
    Optional<User> findOneByIdAndRecordActivityIsTrue(Long id);
    User findByEmailIgnoreCaseAndRecordActivityIsTrueAndActivatedIsTrue(String email);

    List<User> findByTypeAndEmailContainingIgnoreCaseAndRecordActivityIsTrueAndFamilyTreeUsers_FamilyTree_IdNot(
        String typeCode,
        String emailSubstring,
        Long familyTreeId
    );
}
