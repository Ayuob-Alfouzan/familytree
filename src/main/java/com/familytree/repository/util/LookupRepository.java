package com.familytree.repository.util;

import com.familytree.domain.util.Lookup;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface LookupRepository extends JpaRepository<Lookup, Long>, JpaSpecificationExecutor<Lookup> {
    List<Lookup> findByCategoryIgnoreCaseAndRecordActivityIsTrueOrderByOrderAscCodeAsc(String category);

    Optional<Lookup> findByCodeIgnoreCaseAndRecordActivityIsTrue(String code);

    Optional<Lookup> findByCodeIgnoreCaseAndCategoryIgnoreCaseAndRecordActivityIsTrue(String code, String category);
    Optional<Lookup> findByCodeIgnoreCaseAndCategoryIgnoreCase(String code, String category);
}
