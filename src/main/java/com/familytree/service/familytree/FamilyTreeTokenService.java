package com.familytree.service.familytree;

import com.aventrix.jnanoid.jnanoid.NanoIdUtils;
import com.familytree.domain.account.User;
import com.familytree.domain.familytree.*;
import com.familytree.repository.familytree.FamilyTreeTokenRepository;
import com.familytree.security.AuthoritiesConstants;
import com.familytree.security.SecurityUtils;
import com.familytree.service.account.UserService;
import com.familytree.service.dto.familytree.FamilyTreeTokenCriteria;
import com.familytree.service.dto.familytree.FamilyTreeTokenDTO;
import com.familytree.service.lookup.LookupService;
import com.familytree.service.mapper.familytree.FamilyTreeTokenMapper;
import com.familytree.service.util.exception.BadRequestException;
import com.familytree.web.rest.vm.familytree.AddFamilyTreeTokenRequestVM;
import com.familytree.web.rest.vm.familytree.DeleteFamilyTreeTokenRequestVM;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.service.QueryService;
import tech.jhipster.service.filter.BooleanFilter;

@Service
public class FamilyTreeTokenService extends QueryService<FamilyTreeToken> {

    private final Logger log = LoggerFactory.getLogger(FamilyTreeTokenService.class);

    private final UserService userService;

    private final LookupService lookupService;

    private final FamilyTreeTokenRepository familyTreeTokenRepository;

    private final FamilyTreeTokenMapper familyTreeTokenMapper;

    private final OwnershipService ownershipService;

    public FamilyTreeTokenService(
        UserService userService,
        LookupService lookupService,
        FamilyTreeTokenRepository familyTreeTokenRepository,
        FamilyTreeTokenMapper familyTreeTokenMapper,
        OwnershipService ownershipService
    ) {
        this.userService = userService;
        this.lookupService = lookupService;
        this.familyTreeTokenRepository = familyTreeTokenRepository;
        this.familyTreeTokenMapper = familyTreeTokenMapper;
        this.ownershipService = ownershipService;
    }

    @Transactional(readOnly = true)
    public Page<FamilyTreeTokenDTO> list(FamilyTreeTokenCriteria criteria, Pageable pageable) {
        ownershipService.getToWriteByFamilyTreeId(criteria.getFamilyTreeId().getEquals());

        Specification<FamilyTreeToken> specification = createSpecification(criteria);

        Page<FamilyTreeToken> all = familyTreeTokenRepository.findAll(specification, pageable);

        return all.map(familyTreeTokenMapper::toDto);
    }

    @Transactional
    public FamilyTreeTokenDTO add(AddFamilyTreeTokenRequestVM requestVM) {
        FamilyTree familyTree = ownershipService.getToWriteByFamilyTreeId(requestVM.getFamilyTreeId());
        ownershipService.checkHasActiveSubscription(requestVM.getFamilyTreeId());

        FamilyTreeToken familyTreeToken = new FamilyTreeToken();
        familyTreeToken.setFamilyTree(familyTree);
        familyTreeToken.setUser(new User().id(SecurityUtils.getCurrentUserIdOrThrowException()));
        familyTreeToken.setToken(NanoIdUtils.randomNanoId());

        return familyTreeTokenMapper.toDto(familyTreeTokenRepository.save(familyTreeToken));
    }

    @Transactional
    public FamilyTreeTokenDTO delete(DeleteFamilyTreeTokenRequestVM requestVM) {
        FamilyTree familyTree = ownershipService.getToWriteByFamilyTreeId(requestVM.getFamilyTreeId());

        FamilyTreeToken familyTreeToken = familyTreeTokenRepository
            .findByIdAndFamilyTree_IdAndRecordActivityIsTrue(requestVM.getId(), requestVM.getFamilyTreeId())
            .orElseThrow(() -> new BadRequestException("not_found"));

        familyTreeToken.setRecordActivity(false);

        return familyTreeTokenMapper.toDto(familyTreeTokenRepository.save(familyTreeToken));
    }

    private Specification<FamilyTreeToken> createSpecification(FamilyTreeTokenCriteria criteria) {
        Specification<FamilyTreeToken> specification = Specification.where(null);

        if (criteria != null) {
            if (criteria.getToken() != null) {
                specification = specification.and(buildSpecification(criteria.getToken(), FamilyTreeToken_.token));
            }
        }

        if (!SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.ADMIN)) {
            BooleanFilter active = new BooleanFilter();
            active.setEquals(true);

            specification = specification.and(buildSpecification(active, FamilyTreeToken_.recordActivity));
            specification =
                specification.and(buildReferringEntitySpecification(active, FamilyTreeToken_.familyTree, FamilyTree_.recordActivity));

            specification =
                specification.and(
                    buildReferringEntitySpecification(criteria.getFamilyTreeId(), FamilyTreeToken_.familyTree, FamilyTree_.id)
                );
        }

        return specification;
    }
}
