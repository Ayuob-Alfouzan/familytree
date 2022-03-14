package com.familytree.repository.familytree;

import com.familytree.domain.familytree.FamilyTree;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface FamilyTreeRepository extends JpaRepository<FamilyTree, Long>, JpaSpecificationExecutor<FamilyTree> {
    Optional<FamilyTree> findByIdAndType_CodeAndFamilyTreeUsers_Type_CodeAndRecordActivityIsTrueAndFamilyTreeUsers_User_Email(
        Long id,
        String typeCode,
        String familyTreeUserTypeCode,
        String email
    );
    Optional<FamilyTree> findByIdAndFamilyTreeUsers_Type_CodeAndRecordActivityIsTrueAndFamilyTreeUsers_User_Email(
        Long id,
        String familyTreeUserTypeCode,
        String email
    );
    Optional<FamilyTree> findByIdAndRecordActivityIsTrueAndFamilyTreeUsers_User_Email(Long id, String email);
    Optional<FamilyTree> findByIdAndType_CodeAndRecordActivityIsTrueAndFamilyTreeUsers_User_Email(Long id, String typeCode, String email);
    Optional<FamilyTree> findByIdAndType_CodeAndRecordActivityIsTrue(Long id, String typeCode);
}
