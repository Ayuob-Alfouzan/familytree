package com.familytree.service.familytree;

import com.familytree.domain.account.User_;
import com.familytree.domain.familytree.FamilyTreeUser;
import com.familytree.domain.familytree.FamilyTreeUser_;
import com.familytree.domain.familytree.FamilyTree_;
import com.familytree.domain.util.Lookup_;
import com.familytree.repository.familytree.FamilyTreeUserRepository;
import com.familytree.security.AuthoritiesConstants;
import com.familytree.security.SecurityUtils;
import com.familytree.service.account.UserService;
import com.familytree.service.dto.familytree.FamilyTreeCriteria;
import com.familytree.service.dto.familytree.FamilyTreeListDTO;
import com.familytree.service.lookup.FamilyTreeUserTypeEnum;
import com.familytree.service.lookup.LookupService;
import com.familytree.service.mapper.familytree.FamilyTreeListMapper;
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
public class FamilyTreeUserService extends QueryService<FamilyTreeUser> {

    private final Logger log = LoggerFactory.getLogger(FamilyTreeUserService.class);

    private final UserService userService;

    private final LookupService lookupService;

    private final FamilyTreeUserRepository familyTreeUserRepository;

    private final FamilyTreeListMapper familyTreeListMapper;

    public FamilyTreeUserService(
        UserService userService,
        LookupService lookupService,
        FamilyTreeUserRepository familyTreeUserRepository,
        FamilyTreeListMapper familyTreeListMapper
    ) {
        this.userService = userService;
        this.lookupService = lookupService;
        this.familyTreeUserRepository = familyTreeUserRepository;
        this.familyTreeListMapper = familyTreeListMapper;
    }

    @Transactional(readOnly = true)
    public Page<FamilyTreeListDTO> listOwned(FamilyTreeCriteria criteria, Pageable pageable) {
        Specification<FamilyTreeUser> specification = createSpecification(criteria, true);

        Page<FamilyTreeUser> all = familyTreeUserRepository.findAll(specification, pageable);

        return all.map(it -> familyTreeListMapper.toDto(it.getFamilyTree()));
    }

    @Transactional(readOnly = true)
    public Page<FamilyTreeListDTO> list(FamilyTreeCriteria criteria, Pageable pageable) {
        Specification<FamilyTreeUser> specification = createSpecification(criteria, false);

        Page<FamilyTreeUser> all = familyTreeUserRepository.findAll(specification, pageable);

        return all.map(it -> familyTreeListMapper.toDto(it.getFamilyTree()));
    }

    private Specification<FamilyTreeUser> createSpecification(FamilyTreeCriteria criteria, Boolean owned) {
        Specification<FamilyTreeUser> specification = Specification.where(null);

        if (criteria != null) {
            if (criteria.getName() != null && criteria.getName().getContains() != null) {
                criteria.getName().setContains(criteria.getName().getContains().trim());
                Specification<FamilyTreeUser> nameSpecification = Specification.where(null);
                nameSpecification =
                    nameSpecification.or(
                        buildReferringEntitySpecification(criteria.getName(), FamilyTreeUser_.familyTree, FamilyTree_.nameAr)
                    );
                specification = specification.and(nameSpecification);
            }
        }

        if (!SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.ADMIN)) {
            BooleanFilter active = new BooleanFilter();
            active.setEquals(true);

            specification = specification.and(buildSpecification(active, FamilyTreeUser_.recordActivity));
            specification =
                specification.and(buildReferringEntitySpecification(active, FamilyTreeUser_.familyTree, FamilyTree_.recordActivity));

            StringFilter currentUser = new StringFilter();
            currentUser.setEquals(SecurityUtils.getCurrentUserEmailOrThrowException());
            specification = specification.and(buildReferringEntitySpecification(currentUser, FamilyTreeUser_.user, User_.email));

            if (owned) {
                StringFilter type = new StringFilter();
                type.setEquals(FamilyTreeUserTypeEnum.Main.value());
                specification = specification.and(buildReferringEntitySpecification(type, FamilyTreeUser_.type, Lookup_.code));
            } else {
                StringFilter type = new StringFilter();
                type.setEquals(FamilyTreeUserTypeEnum.Normal.value());
                specification = specification.and(buildReferringEntitySpecification(type, FamilyTreeUser_.type, Lookup_.code));
            }
        }

        return specification;
    }

    private <OTHER> Specification<FamilyTreeUser> buildReferringEntitySpecification(
        StringFilter filter,
        SingularAttribute<FamilyTreeUser, OTHER> reference,
        SingularAttribute<OTHER, String> valueField
    ) {
        return buildSpecification(filter, root -> root.get(reference).get(valueField));
    }
}
