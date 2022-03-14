package com.familytree.repository.familytree;

import com.familytree.domain.familytree.FamilyTreeUser;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface FamilyTreeUserRepository extends JpaRepository<FamilyTreeUser, Long>, JpaSpecificationExecutor<FamilyTreeUser> {
    int countByFamilyTree_IdAndFamilyTree_RecordActivityIsTrueAndRecordActivityIsTrue(Long familyTreeId);
    int countByFamilyTree_RecordActivityIsTrueAndRecordActivityIsTrueAndUser_IdAndType_CodeIn(Long userId, List<String> statuses);
    int countByFamilyTree_IdAndFamilyTree_RecordActivityIsTrueAndRecordActivityIsTrueAndUser_IdAndType_CodeIn(
        Long familyTreeId,
        Long userId,
        List<String> statuses
    );

    Optional<FamilyTreeUser> findByFamilyTree_IdAndUser_IdAndRecordActivityIsTrue(Long familyTreeId, Long userId);
}
