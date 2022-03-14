package com.familytree.repository.farm;

import com.familytree.domain.farm.Farm;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface FarmRepository extends JpaRepository<Farm, Long>, JpaSpecificationExecutor<Farm> {
    Optional<Farm> findByIdAndType_CodeAndFarmUsers_Type_CodeAndRecordActivityIsTrueAndFarmUsers_User_Email(
        Long id,
        String typeCode,
        String farmUserTypeCode,
        String email
    );
    Optional<Farm> findByIdAndFarmUsers_Type_CodeAndRecordActivityIsTrueAndFarmUsers_User_Email(
        Long id,
        String farmUserTypeCode,
        String email
    );
    Optional<Farm> findByIdAndRecordActivityIsTrueAndFarmUsers_User_Email(Long id, String email);
    Optional<Farm> findByIdAndType_CodeAndRecordActivityIsTrueAndFarmUsers_User_Email(Long id, String typeCode, String email);
    Optional<Farm> findByIdAndType_CodeAndRecordActivityIsTrue(Long id, String typeCode);
}
