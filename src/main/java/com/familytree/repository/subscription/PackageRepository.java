package com.familytree.repository.subscription;

import com.familytree.domain.subscription.Package;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface PackageRepository extends JpaRepository<Package, Long>, JpaSpecificationExecutor<Package> {
    List<Package> findByFamilyTreeType_CodeAndRangeEndGreaterThanEqualAndRecordActivityIsTrueAndCanRenewIsTrue(
        String familyTreeTypeCode,
        Long numberOfCoops
    );

    List<Package> findByFamilyTreeType_CodeAndRecordActivityIsTrueAndCanRenewIsTrue(String familyTreeTypeCode);

    Package findByFamilyTreeType_CodeAndRecordActivityIsTrueAndCanRenewIsFalse(String familyTreeTypeCode);

    Optional<Package> findByIdAndFamilyTreeType_CodeAndRangeEndGreaterThanEqualAndRecordActivityIsTrueAndCanRenewIsTrue(
        Long packageId,
        String familyTreeTypeCode,
        Long numberOfCoops
    );
}
