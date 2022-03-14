package com.familytree.repository.subscription;

import com.familytree.domain.subscription.Invoice;

import java.time.Instant;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long>, JpaSpecificationExecutor<Invoice> {
    Optional<Invoice> findByIdAndFarm_IdAndRecordActivityIsTrue(Long id, Long farmId);
    Optional<Invoice> findByIdAndRecordActivityIsTrueAndStatus_Code(Long id, String statusCode);

    @Modifying
    @Query(
        "update Invoice " +
        "set invoiceNumber = (select coalesce(max(invoiceNumber), 0) + 1 from Invoice), paymentDate = :paymentDate, status.id = :paidStatusId " +
        "where id = :invoiceId and status.id = :unpaidStatusId"
    )
    void markAsPaid(
        @Param("invoiceId") Long invoiceId,
        @Param("paymentDate") Instant paymentDate,
        @Param("unpaidStatusId") Long unpaidStatusId,
        @Param("paidStatusId") Long paidStatusId
    );

    @Modifying
    @Query("update Invoice " + "set status.id = :cancelledStatusId " + "where id = :invoiceId and status.id = :unpaidStatusId")
    void markAsCancelled(
        @Param("invoiceId") Long invoiceId,
        @Param("unpaidStatusId") Long unpaidStatusId,
        @Param("cancelledStatusId") Long cancelledStatusId
    );
}
