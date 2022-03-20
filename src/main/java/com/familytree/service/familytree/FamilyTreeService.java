package com.familytree.service.familytree;

import com.familytree.config.ApplicationProperties;
import com.familytree.domain.familytree.FamilyTree;
import com.familytree.domain.familytree.FamilyTreeUser;
import com.familytree.repository.familytree.FamilyTreeRepository;
import com.familytree.repository.familytree.FamilyTreeUserRepository;
import com.familytree.security.SecurityUtils;
import com.familytree.service.account.UserService;
import com.familytree.service.dto.familytree.FamilyTreeDTO;
import com.familytree.service.lookup.FamilyTreeUserTypeEnum;
import com.familytree.service.lookup.LookupCategory;
import com.familytree.service.lookup.LookupService;
import com.familytree.service.mapper.familytree.FamilyTreeMapper;
import com.familytree.service.subscription.SubscriptionService;
import com.familytree.service.util.exception.BadRequestException;
import com.familytree.web.rest.vm.familytree.*;
import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.service.QueryService;

@Service
public class FamilyTreeService extends QueryService<FamilyTree> {

    private final Logger log = LoggerFactory.getLogger(FamilyTreeService.class);

    private final FamilyTreeRepository familyTreeRepository;

    private final FamilyTreeMapper familyTreeMapper;

    private final ApplicationProperties applicationProperties;

    private final UserService userService;

    private final LookupService lookupService;

    private final FamilyTreeUserRepository familyTreeUserRepository;

    private final OwnershipService ownershipService;

    private final SubscriptionService subscriptionService;

    private final TreeService treeService;

    public FamilyTreeService(
        FamilyTreeRepository familyTreeRepository,
        FamilyTreeMapper familyTreeMapper,
        ApplicationProperties applicationProperties,
        UserService userService,
        LookupService lookupService,
        FamilyTreeUserRepository familyTreeUserRepository,
        OwnershipService ownershipService,
        SubscriptionService subscriptionService,
        TreeService treeService
    ) {
        this.familyTreeRepository = familyTreeRepository;
        this.familyTreeMapper = familyTreeMapper;
        this.applicationProperties = applicationProperties;
        this.userService = userService;
        this.lookupService = lookupService;
        this.familyTreeUserRepository = familyTreeUserRepository;
        this.ownershipService = ownershipService;
        this.subscriptionService = subscriptionService;
        this.treeService = treeService;
    }

    @Transactional
    public FamilyTreeDTO add(AddFamilyTreeRequestVM vm) {
        FamilyTree familyTree = new FamilyTree();
        familyTree.setNameAr(vm.getNameAr());
        familyTree.setType(lookupService.getEntityByCodeAndCategory(vm.getType(), LookupCategory.FamilyTreeType.value()));

        FamilyTreeUser familyTreeUser = new FamilyTreeUser();
        familyTreeUser.setType(
            lookupService.getEntityByCodeAndCategory(FamilyTreeUserTypeEnum.Main.value(), LookupCategory.FamilyTreeUserType.value())
        );
        familyTreeUser.setFamilyTree(familyTree);
        familyTreeUser.setUser(userService.getUser());

        familyTree.getFamilyTreeUsers().add(familyTreeUser);

        familyTree.getSubscriptions().add(subscriptionService.createTrail(familyTree));

        familyTree = familyTreeRepository.save(familyTree);

        // Create default head
        familyTree.setHeadPersonId(treeService.addHead(familyTree.getId()));

        return familyTreeMapper.toDto(familyTreeRepository.save(familyTree));
    }

    @Transactional(readOnly = true)
    public FamilyTreeDTO get(Long id) {
        return familyTreeMapper.toDto(ownershipService.getToWriteByFamilyTreeId(id));
    }

    @Transactional
    public FamilyTreeDTO edit(EditFamilyTreeRequestVM vm) {
        FamilyTree familyTree = ownershipService.getToWriteByFamilyTreeId(vm.getId());

        familyTree.setNameAr(vm.getNameAr());

        return familyTreeMapper.toDto(familyTreeRepository.save(familyTree));
    }

    @Transactional
    public FamilyTreeDTO delete(Long id) {
        FamilyTree familyTree = ownershipService.getToWriteByFamilyTreeId(id);

        familyTree.setRecordActivity(false);

        familyTree.getFamilyTreeUsers().forEach(it -> it.setRecordActivity(false));

        treeService.deleteAll(familyTree.getId());

        return familyTreeMapper.toDto(familyTreeRepository.save(familyTree));
    }

    @Transactional
    public void remove(Long id) {
        FamilyTree familyTree = ownershipService.getToViewByFamilyTreeId(id);

        FamilyTreeUser familyTreeUser = familyTreeUserRepository
            .findByFamilyTree_IdAndUser_IdAndRecordActivityIsTrue(familyTree.getId(), SecurityUtils.getCurrentUserIdOrThrowException())
            .orElseThrow(() -> new BadRequestException("not_found"));

        if (familyTreeUser.getType().getCode().equalsIgnoreCase(FamilyTreeUserTypeEnum.Main.value())) {
            int numberOfMainUsers = familyTreeUserRepository.countByFamilyTree_IdAndFamilyTree_RecordActivityIsTrueAndRecordActivityIsTrueAndUser_IdAndType_CodeIn(
                familyTree.getId(),
                SecurityUtils.getCurrentUserIdOrThrowException(),
                Collections.singletonList(FamilyTreeUserTypeEnum.Main.value())
            );

            if (numberOfMainUsers <= 1) {
                throw new BadRequestException("family_tree.last_main_user");
            }
        }

        familyTreeUser.setRecordActivity(false);
        familyTreeUserRepository.save(familyTreeUser);
    }

    @Transactional(readOnly = true)
    public Integer dashboardData(Long id) {
        return familyTreeUserRepository.countByFamilyTree_IdAndFamilyTree_RecordActivityIsTrueAndRecordActivityIsTrue(id);
    }

    @Transactional(readOnly = true)
    public int numberOfOwnedFamilyTrees() {
        return familyTreeUserRepository.countByFamilyTree_RecordActivityIsTrueAndRecordActivityIsTrueAndUser_IdAndType_CodeIn(
            SecurityUtils.getCurrentUserIdOrThrowException(),
            Collections.singletonList(FamilyTreeUserTypeEnum.Main.value())
        );
    }

    @Transactional(readOnly = true)
    public int numberOfFamilyTrees() {
        return familyTreeUserRepository.countByFamilyTree_RecordActivityIsTrueAndRecordActivityIsTrueAndUser_IdAndType_CodeIn(
            SecurityUtils.getCurrentUserIdOrThrowException(),
            Arrays.asList(FamilyTreeUserTypeEnum.Main.value(), FamilyTreeUserTypeEnum.Normal.value())
        );
    }

    @Transactional
    public FamilyTreeDTO addUser(AddUserRequestVM vm) {
        FamilyTree familyTree = ownershipService.getToWriteByFamilyTreeId(vm.getId());

        Optional<FamilyTreeUser> familyTreeUser = familyTree
            .getFamilyTreeUsers()
            .stream()
            .filter(it -> it.getUser().getEmail().equalsIgnoreCase(vm.getUserEmail()))
            .findAny();

        if (familyTreeUser.isPresent()) {
            FamilyTreeUser oldFamilyTreeUser = familyTreeUser.get();
            if (oldFamilyTreeUser.getRecordActivity()) {
                throw new BadRequestException("family_tree.user_already_added");
            } else {
                oldFamilyTreeUser.setRecordActivity(true);
                familyTreeUserRepository.save(oldFamilyTreeUser);
            }
        } else {
            FamilyTreeUser newFamilyTreeUser = new FamilyTreeUser();
            newFamilyTreeUser.setType(
                lookupService.getEntityByCodeAndCategory(vm.getFamilyTreeUserType(), LookupCategory.FamilyTreeUserType.value())
            );
            newFamilyTreeUser.setFamilyTree(familyTree);
            newFamilyTreeUser.setUser(userService.getUser(vm.getUserEmail()));

            familyTree.getFamilyTreeUsers().add(newFamilyTreeUser);

            familyTreeRepository.save(familyTree);
        }

        return familyTreeMapper.toDto(familyTree);
    }

    @Transactional
    public FamilyTreeDTO removeUser(RemoveUserRequestVM vm) {
        FamilyTree familyTree = ownershipService.getToWriteByFamilyTreeId(vm.getId());

        if (vm.getUserId().equals(SecurityUtils.getCurrentUserIdOrThrowException())) {
            throw new BadRequestException("family_tree.cannot_remove_self");
        }

        Optional<FamilyTreeUser> familyTreeUser = familyTree
            .getFamilyTreeUsers()
            .stream()
            .filter(it -> it.getUser().getId().equals(vm.getUserId()))
            .findAny();

        if (familyTreeUser.isPresent()) {
            familyTree.getFamilyTreeUsers().remove(familyTreeUser.get());
            return familyTreeMapper.toDto(familyTreeRepository.save(familyTree));
        } else {
            throw new BadRequestException("not_found");
        }
    }
}
