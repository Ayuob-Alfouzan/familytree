package com.familytree.service.farm;

import com.familytree.domain.account.User_;
import com.familytree.domain.farm.FarmUser;
import com.familytree.domain.farm.FarmUser_;
import com.familytree.domain.farm.Farm_;
import com.familytree.domain.util.Lookup_;
import com.familytree.repository.farm.FarmUserRepository;
import com.familytree.security.AuthoritiesConstants;
import com.familytree.security.SecurityUtils;
import com.familytree.service.account.UserService;
import com.familytree.service.dto.farm.FarmCriteria;
import com.familytree.service.dto.farm.FarmListDTO;
import com.familytree.service.lookup.FarmUserTypeEnum;
import com.familytree.service.lookup.LookupService;
import com.familytree.service.mapper.farm.FarmListMapper;

import javax.persistence.metamodel.SingularAttribute;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.service.QueryService;
import tech.jhipster.service.filter.BooleanFilter;
import tech.jhipster.service.filter.StringFilter;

@Service
public class FarmUserService extends QueryService<FarmUser> {

    private final Logger log = LoggerFactory.getLogger(FarmUserService.class);

    private final UserService userService;

    private final LookupService lookupService;

    private final FarmUserRepository farmUserRepository;

    private final FarmListMapper farmListMapper;

    public FarmUserService(
        UserService userService,
        LookupService lookupService,
        FarmUserRepository farmUserRepository,
        FarmListMapper farmListMapper
    ) {
        this.userService = userService;
        this.lookupService = lookupService;
        this.farmUserRepository = farmUserRepository;
        this.farmListMapper = farmListMapper;
    }

    @Transactional(readOnly = true)
    public Page<FarmListDTO> listOwned(FarmCriteria criteria, Pageable pageable) {
        Specification<FarmUser> specification = createSpecification(criteria, true);

        Page<FarmUser> all = farmUserRepository.findAll(specification, pageable);

        return all.map(it -> farmListMapper.toDto(it.getFarm()));
    }

    @Transactional(readOnly = true)
    public Page<FarmListDTO> list(FarmCriteria criteria, Pageable pageable) {
        Specification<FarmUser> specification = createSpecification(criteria, false);

        Page<FarmUser> all = farmUserRepository.findAll(specification, pageable);

        return all.map(it -> farmListMapper.toDto(it.getFarm()));
    }

    private Specification<FarmUser> createSpecification(FarmCriteria criteria, Boolean owned) {
        Specification<FarmUser> specification = Specification.where(null);

        if (criteria != null) {
            if (criteria.getName() != null && criteria.getName().getContains() != null) {
                criteria.getName().setContains(criteria.getName().getContains().trim());
                Specification<FarmUser> nameSpecification = Specification.where(null);
                nameSpecification =
                    nameSpecification.or(buildReferringEntitySpecification(criteria.getName(), FarmUser_.farm, Farm_.nameAr));
                nameSpecification =
                    nameSpecification.or(buildReferringEntitySpecification(criteria.getName(), FarmUser_.farm, Farm_.nameEn));
                specification = specification.and(nameSpecification);
            }
        }

        if (!SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.ADMIN)) {
            BooleanFilter active = new BooleanFilter();
            active.setEquals(true);

            specification = specification.and(buildSpecification(active, FarmUser_.recordActivity));
            specification = specification.and(buildReferringEntitySpecification(active, FarmUser_.farm, Farm_.recordActivity));

            StringFilter currentUser = new StringFilter();
            currentUser.setEquals(SecurityUtils.getCurrentUserEmailOrThrowException());
            specification = specification.and(buildReferringEntitySpecification(currentUser, FarmUser_.user, User_.email));

            if (owned) {
                StringFilter type = new StringFilter();
                type.setEquals(FarmUserTypeEnum.Main.value());
                specification = specification.and(buildReferringEntitySpecification(type, FarmUser_.type, Lookup_.code));
            } else {
                StringFilter type = new StringFilter();
                type.setEquals(FarmUserTypeEnum.Normal.value());
                specification = specification.and(buildReferringEntitySpecification(type, FarmUser_.type, Lookup_.code));
            }
        }

        return specification;
    }

    private <OTHER> Specification<FarmUser> buildReferringEntitySpecification(
        StringFilter filter,
        SingularAttribute<FarmUser, OTHER> reference,
        SingularAttribute<OTHER, String> valueField
    ) {
        return buildSpecification(filter, root -> root.get(reference).get(valueField));
    }
}
