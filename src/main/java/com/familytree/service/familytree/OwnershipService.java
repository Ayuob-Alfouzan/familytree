package com.familytree.service.familytree;

import com.familytree.domain.familytree.*;
import com.familytree.domain.subscription.Subscription;
import com.familytree.repository.familytree.*;
import com.familytree.repository.subscription.SubscriptionRepository;
import com.familytree.security.SecurityUtils;
import com.familytree.service.lookup.FamilyTreeUserTypeEnum;
import com.familytree.service.util.exception.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OwnershipService {

    private final FamilyTreeRepository familyTreeRepository;

    private final SubscriptionRepository subscriptionRepository;

    public OwnershipService(
        FamilyTreeRepository familyTreeRepository,
        SubscriptionRepository subscriptionRepository
    ) {
        this.familyTreeRepository = familyTreeRepository;
        this.subscriptionRepository = subscriptionRepository;
    }

    @Transactional(readOnly = true)
    public FamilyTree getToWriteByFamilyTreeId(Long familyTreeId) {
        return familyTreeRepository
            .findByIdAndFamilyTreeUsers_Type_CodeAndRecordActivityIsTrueAndFamilyTreeUsers_User_Email(
                familyTreeId,
                FamilyTreeUserTypeEnum.Main.value(),
                SecurityUtils.getCurrentUserEmailOrThrowException()
            )
            .orElseThrow(() -> new BadRequestException("not_found"));
    }

    @Transactional(readOnly = true)
    public FamilyTree getToWriteByFamilyTreeIdAndType(Long familyTreeId, String familyTreeTypeCode) {
        return familyTreeRepository
            .findByIdAndType_CodeAndFamilyTreeUsers_Type_CodeAndRecordActivityIsTrueAndFamilyTreeUsers_User_Email(
                familyTreeId,
                familyTreeTypeCode,
                FamilyTreeUserTypeEnum.Main.value(),
                SecurityUtils.getCurrentUserEmailOrThrowException()
            )
            .orElseThrow(() -> new BadRequestException("not_found"));
    }

    @Transactional(readOnly = true)
    public FamilyTree getToViewByFamilyTreeId(Long familyTreeId) {
        return familyTreeRepository
            .findByIdAndRecordActivityIsTrueAndFamilyTreeUsers_User_Email(familyTreeId, SecurityUtils.getCurrentUserEmailOrThrowException())
            .orElseThrow(() -> new BadRequestException("not_found"));
    }

    @Transactional(readOnly = true)
    public FamilyTree getToViewByFamilyTreeIdAndType(Long familyTreeId, String familyTreeTypeCode) {
        return familyTreeRepository
            .findByIdAndType_CodeAndRecordActivityIsTrueAndFamilyTreeUsers_User_Email(
                familyTreeId,
                familyTreeTypeCode,
                SecurityUtils.getCurrentUserEmailOrThrowException()
            )
            .orElseThrow(() -> new BadRequestException("not_found"));
    }

//    @Transactional(readOnly = true)
//    public void checkSheepPackageLimitationForSheepFamilyTree(Long familyTreeId, int numberOfSheepToAdd) {
//        Subscription subscription = checkHasActiveSubscription(familyTreeId);
//
//        int numberOfSheep = sheepRepository.countByFamilyTree_IdAndRecordActivityIsTrue(familyTreeId);
//        numberOfSheep += numberOfSheepToAdd;
//
//        if (numberOfSheep > subscription.getRangeEnd()) {
//            throw new BadRequestException("subscription.range_end_reached");
//        }
//    }

    @Transactional(readOnly = true)
    public Subscription checkHasActiveSubscription(Long familyTreeId) {
        return subscriptionRepository
            .findActiveSubscription(familyTreeId)
            .orElseThrow(() -> new BadRequestException("subscription.does_not_have_active_subscription"));
    }
}
