package com.familytree.repository.farm;

import com.familytree.domain.farm.FarmUser;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface FarmUserRepository extends JpaRepository<FarmUser, Long>, JpaSpecificationExecutor<FarmUser> {
    int countByFarm_IdAndFarm_RecordActivityIsTrueAndRecordActivityIsTrue(Long farmId);
    int countByFarm_RecordActivityIsTrueAndRecordActivityIsTrueAndUser_IdAndType_CodeIn(Long userId, List<String> statuses);
    int countByFarm_IdAndFarm_RecordActivityIsTrueAndRecordActivityIsTrueAndUser_IdAndType_CodeIn(
        Long farmId,
        Long userId,
        List<String> statuses
    );

    Optional<FarmUser> findByFarm_IdAndUser_IdAndRecordActivityIsTrue(Long farmId, Long userId);
}
