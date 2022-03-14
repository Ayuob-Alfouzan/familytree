package com.familytree.repository.subscription;

import com.familytree.domain.subscription.Subscription;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long>, JpaSpecificationExecutor<Subscription> {
    boolean existsByFarm_IdAndStatus_CodeAndEndDateGreaterThanAndRecordActivityIsTrue(
        Long farmId,
        String statusCode,
        Instant endDateCutOff
    );

    boolean existsByFarm_IdAndStatus_CodeInAndRecordActivityIsTrue(Long farmId, List<String> statusCodes);

    @Query(
        "select s " +
        "from Subscription s " +
        "left join Lookup l on l.id = s.status.id " +
        "where s.farm.id = :farmId and l.code = 'ACTIVE' and s.startDate <= CURRENT_TIMESTAMP and s.endDate >= CURRENT_TIMESTAMP and s.recordActivity = true "
    )
    Optional<Subscription> findActiveSubscription(@Param("farmId") Long farmId);

    @Modifying
    @Query("update Subscription set status.id = 32 where endDate < CURRENT_TIMESTAMP and status.id = 31 ")
    void expireSubscriptions();

    Optional<Subscription> findByInvoice_IdAndRecordActivityIsTrueAndStatus_Code(Long invoiceId, String statusCode);

    Optional<Subscription> findByIdAndFarm_IdAndRecordActivityIsTrueAndStatus_CodeIn(Long id, Long farmId, List<String> statusCodes);
    List<Subscription> findByFarm_IdAndRecordActivityIsTrueAndStatus_CodeIn(Long farmId, List<String> statusCodes);
    Optional<Subscription> findByIdAndFarm_IdAndRecordActivityIsTrue(Long id, Long farmId);
}
