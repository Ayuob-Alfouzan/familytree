package com.familytree.repository.familytree;

import com.familytree.domain.familytree.FamilyTreeToken;
import com.familytree.domain.familytree.FamilyTreeUser;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface FamilyTreeTokenRepository extends JpaRepository<FamilyTreeToken, Long>, JpaSpecificationExecutor<FamilyTreeToken> {
    Optional<FamilyTreeToken> findByIdAndFamilyTree_IdAndRecordActivityIsTrue(Long id, Long familyTreeId);
    Optional<FamilyTreeToken> findByTokenAndRecordActivityIsTrue(String token);
}
