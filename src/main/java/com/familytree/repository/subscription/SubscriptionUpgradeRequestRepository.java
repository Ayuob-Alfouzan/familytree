package com.familytree.repository.subscription;

import com.familytree.domain.subscription.SubscriptionUpgradeRequest;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface SubscriptionUpgradeRequestRepository
    extends JpaRepository<SubscriptionUpgradeRequest, Long>, JpaSpecificationExecutor<SubscriptionUpgradeRequest> {
    Optional<SubscriptionUpgradeRequest> findByInvoice_IdAndRecordActivityIsTrueAndStatus_Code(Long invoiceId, String statusCode);
    Optional<SubscriptionUpgradeRequest> findByIdAndFarm_IdAndRecordActivityIsTrueAndStatus_Code(Long id, Long farmId, String statusCode);
}
