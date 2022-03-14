package com.familytree.repository.subscription;

import com.familytree.domain.subscription.Package;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface PackageRepository extends JpaRepository<Package, Long>, JpaSpecificationExecutor<Package> {
    List<Package> findByFarmType_CodeAndRangeEndGreaterThanEqualAndRecordActivityIsTrueAndCanRenewIsTrue(
        String farmTypeCode,
        Long numberOfCoops
    );

    List<Package> findByFarmType_CodeAndRecordActivityIsTrueAndCanRenewIsTrue(String farmTypeCode);

    Package findByFarmType_CodeAndRecordActivityIsTrueAndCanRenewIsFalse(String farmTypeCode);

    Optional<Package> findByIdAndFarmType_CodeAndRangeEndGreaterThanEqualAndRecordActivityIsTrueAndCanRenewIsTrue(
        Long packageId,
        String farmTypeCode,
        Long numberOfCoops
    );
}
