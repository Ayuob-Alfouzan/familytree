package com.familytree.service.lookup;

import com.familytree.domain.util.Lookup;
import com.familytree.domain.util.Lookup_;
import com.familytree.repository.util.LookupRepository;
import com.familytree.service.dto.util.LookupCriteria;
import com.familytree.service.dto.util.LookupDTO;
import com.familytree.service.mapper.util.LookupMapper;
import com.familytree.service.util.exception.BadRequestException;
import com.familytree.web.rest.vm.util.AddLookupRequestVM;
import com.familytree.web.rest.vm.util.EditLookupRequestVM;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.service.QueryService;

@Service
public class LookupService extends QueryService<Lookup> {

    private final Logger log = LoggerFactory.getLogger(LookupService.class);
    private final LookupRepository lookupRepository;
    private final LookupMapper lookupMapper;

    public LookupService(LookupRepository lookupRepository, LookupMapper lookupMapper) {
        this.lookupRepository = lookupRepository;
        this.lookupMapper = lookupMapper;
    }

    @Transactional(readOnly = true)
    public List<LookupDTO> getByCategory(String category) {
        return lookupRepository
            .findByCategoryIgnoreCaseAndRecordActivityIsTrueOrderByOrderAscCodeAsc(category)
            .stream()
            .map(LookupDTO::new)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Lookup getEntityByCodeAndCategory(String code, String category) {
        return lookupRepository
            .findByCodeIgnoreCaseAndCategoryIgnoreCaseAndRecordActivityIsTrue(code, category)
            .orElseThrow(() -> new BadRequestException("lookup.not_found"));
    }

    @Transactional(readOnly = true)
    public Page<LookupDTO> list(LookupCriteria criteria, Pageable pageable) {
        Specification<Lookup> specification = createSpecification(criteria);

        return lookupRepository.findAll(specification, pageable).map(lookupMapper::toDto);
    }

    @Transactional
    public LookupDTO add(AddLookupRequestVM requestVM) {
        Optional<Lookup> lookup = lookupRepository.findByCodeIgnoreCaseAndCategoryIgnoreCaseAndRecordActivityIsTrue(
            requestVM.getCode(),
            requestVM.getCategory()
        );

        if (lookup.isPresent()) {
            throw new BadRequestException("lookup.found");
        }

        Lookup newLookup = new Lookup();
        newLookup.setCategory(requestVM.getCategory());
        newLookup.setCode(requestVM.getCode());
        newLookup.setAr(requestVM.getAr());
        newLookup.setEn(requestVM.getEn());
        newLookup.setRecordActivity(true);

        return lookupMapper.toDto(lookupRepository.save(newLookup));
    }

    @Transactional
    public LookupDTO edit(EditLookupRequestVM requestVM) {
        Lookup lookup = lookupRepository
            .findByCodeIgnoreCaseAndCategoryIgnoreCase(requestVM.getCode(), requestVM.getCategory())
            .orElseThrow(() -> new BadRequestException("lookup.not_found"));

        lookup.setAr(requestVM.getAr());
        lookup.setEn(requestVM.getEn());
        lookup.setRecordActivity(requestVM.getRecordActivity());

        return lookupMapper.toDto(lookupRepository.save(lookup));
    }

    private Specification<Lookup> createSpecification(LookupCriteria criteria) {
        Specification<Lookup> specification = Specification.where(null);

        if (criteria != null) {
            if (criteria.getCategory() != null) {
                specification = specification.and(buildSpecification(criteria.getCategory(), Lookup_.category));
            }

            if (criteria.getCode() != null) {
                specification = specification.and(buildSpecification(criteria.getCode(), Lookup_.code));
            }

            if (criteria.getValue() != null) {
                Specification<Lookup> valueSpecification = Specification.where(null);
                valueSpecification.or(buildSpecification(criteria.getValue(), Lookup_.ar));
                valueSpecification.or(buildSpecification(criteria.getValue(), Lookup_.en));
                specification = specification.and(valueSpecification);
            }

            if (criteria.getRecordActivity() != null) {
                specification = specification.and(buildSpecification(criteria.getRecordActivity(), Lookup_.recordActivity));
            }
        }

        return specification;
    }
}
