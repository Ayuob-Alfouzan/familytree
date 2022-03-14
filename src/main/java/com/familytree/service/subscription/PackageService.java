package com.familytree.service.subscription;

import com.familytree.config.ApplicationProperties;
import com.familytree.domain.familytree.*;
import com.familytree.domain.subscription.Package;
import com.familytree.domain.subscription.Subscription;
import com.familytree.repository.subscription.PackageRepository;
import com.familytree.repository.subscription.SubscriptionRepository;
import com.familytree.service.dto.subscription.PackageDTO;
import com.familytree.service.familytree.OwnershipService;
import com.familytree.service.lookup.*;
import com.familytree.service.mapper.subscription.PackageMapper;
import com.familytree.service.util.exception.BadRequestException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.service.QueryService;

@Service
public class PackageService extends QueryService<Package> {

    private final Logger log = LoggerFactory.getLogger(PackageService.class);

    private final ApplicationProperties applicationProperties;

    private final PackageRepository packageRepository;

    private final PackageMapper packageMapper;

    private final LookupService lookupService;

    private final OwnershipService ownershipService;

    private final SubscriptionRepository subscriptionRepository;

    public PackageService(
        ApplicationProperties applicationProperties,
        PackageRepository packageRepository,
        PackageMapper packageMapper,
        LookupService lookupService,
        OwnershipService ownershipService,
        SubscriptionRepository subscriptionRepository
    ) {
        this.applicationProperties = applicationProperties;
        this.packageRepository = packageRepository;
        this.packageMapper = packageMapper;
        this.lookupService = lookupService;
        this.ownershipService = ownershipService;
        this.subscriptionRepository = subscriptionRepository;
    }

    @Transactional(readOnly = true)
    public List<PackageDTO> listPackagesByFamilyTreeType(String familyTreeTypeCode) {
        return packageMapper.toDto(
            packageRepository.findByFamilyTreeType_CodeAndRecordActivityIsTrueAndCanRenewIsTrue(familyTreeTypeCode.toUpperCase())
        );
    }

    @Transactional(readOnly = true)
    public List<PackageDTO> listSuitable(Long familyTreeId) {
        FamilyTree familyTree = ownershipService.getToWriteByFamilyTreeId(familyTreeId);

        boolean hasActiveSubscription = subscriptionRepository.existsByFamilyTree_IdAndStatus_CodeAndEndDateGreaterThanAndRecordActivityIsTrue(
            familyTreeId,
            SubscriptionStatusEnum.Active.value(),
            Instant.now().plus(applicationProperties.getSubscription().getCanRenewBeforeDays(), ChronoUnit.DAYS)
        );

        if (hasActiveSubscription) {
            throw new BadRequestException("subscription.has_active_subscription");
        } else {
            boolean hasWaitingForPaymentSubscription = subscriptionRepository.existsByFamilyTree_IdAndStatus_CodeInAndRecordActivityIsTrue(
                familyTreeId,
                Collections.singletonList(SubscriptionStatusEnum.WaitingForPayment.value())
            );

            if (hasWaitingForPaymentSubscription) {
                throw new BadRequestException("subscription.has_waiting_for_payment_subscription");
            } else {
//                if (familyTree.getType().getCode().equalsIgnoreCase(FamilyTreeTypeEnum.Pigeon.value())) {
//                    int numberOfCoops = coopRepository.countByWarehouse_FamilyTree_IdAndRecordActivityIsTrue(familyTree.getId());
//                    return packageMapper.toDto(
//                        packageRepository.findByFamilyTreeType_CodeAndRangeEndGreaterThanEqualAndRecordActivityIsTrueAndCanRenewIsTrue(
//                            familyTree.getType().getCode(),
//                            (long) numberOfCoops
//                        )
//                    );
//                } else if (familyTree.getType().getCode().equalsIgnoreCase(FamilyTreeTypeEnum.Sheep.value())) {
//                    int numberOfSheep = sheepRepository.countByFamilyTree_IdAndRecordActivityIsTrue(familyTree.getId());
//                    return packageMapper.toDto(
//                        packageRepository.findByFamilyTreeType_CodeAndRangeEndGreaterThanEqualAndRecordActivityIsTrueAndCanRenewIsTrue(
//                            familyTree.getType().getCode(),
//                            (long) numberOfSheep
//                        )
//                    );
//                } else {
                    throw new BadRequestException("error.not_found");
//                }
            }
        }
    }

    @Transactional(readOnly = true)
    public List<PackageDTO> listSuitableForUpgrade(Long familyTreeId, Long subscriptionId) {
        FamilyTree familyTree = ownershipService.getToWriteByFamilyTreeId(familyTreeId);
        Subscription subscription = subscriptionRepository
            .findByIdAndFamilyTree_IdAndRecordActivityIsTrueAndStatus_CodeIn(
                subscriptionId,
                familyTree.getId(),
                Collections.singletonList(SubscriptionStatusEnum.Active.value())
            )
            .orElseThrow(() -> new BadRequestException("not_found"));

        boolean foundWaitingForPaymentRequest = subscription
            .getSubscriptionUpgradeRequests()
            .stream()
            .anyMatch(it -> it.getStatus().getCode().equalsIgnoreCase(SubscriptionStatusEnum.WaitingForPayment.value()));

        if (foundWaitingForPaymentRequest) {
            throw new BadRequestException("subscription.found_waiting_for_payment");
        } else if (subscription.getEndDate().isBefore(Instant.now().plus(3, ChronoUnit.DAYS))) {
            throw new BadRequestException("subscription.near_expiry");
        } else {
            return packageMapper.toDto(
                packageRepository.findByFamilyTreeType_CodeAndRangeEndGreaterThanEqualAndRecordActivityIsTrueAndCanRenewIsTrue(
                    familyTree.getType().getCode(),
                    subscription.getRangeEnd() + 1
                )
            );
        }
    }

    @Transactional(readOnly = true)
    public Package suitableForRenew(Long familyTreeId, Long subscriptionId) {
        FamilyTree familyTree = ownershipService.getToWriteByFamilyTreeId(familyTreeId);
        boolean hasWaitingForPayment = subscriptionRepository.existsByFamilyTree_IdAndStatus_CodeInAndRecordActivityIsTrue(
            familyTreeId,
            Collections.singletonList(SubscriptionStatusEnum.WaitingForPayment.value())
        );

        if (hasWaitingForPayment) {
            throw new BadRequestException("subscription.has_waiting_for_payment_subscription");
        }

        Subscription subscription = subscriptionRepository
            .findByIdAndFamilyTree_IdAndRecordActivityIsTrueAndStatus_CodeIn(
                subscriptionId,
                familyTree.getId(),
                Collections.singletonList(SubscriptionStatusEnum.Active.value())
            )
            .orElseThrow(() -> new BadRequestException("not_found"));

        if (
            subscription.getaPackage().getCanRenew() &&
            subscription.getaPackage().getRecordActivity() &&
            subscription
                .getEndDate()
                .isBefore(Instant.now().plus(applicationProperties.getSubscription().getCanRenewBeforeDays(), ChronoUnit.DAYS))
        ) {
            return subscription.getaPackage();
        } else {
            throw new BadRequestException("not_found");
        }
    }

    @Transactional(readOnly = true)
    public Package isSuitable(FamilyTree familyTree, Long packageId) {
        boolean hasActiveSubscription = subscriptionRepository.existsByFamilyTree_IdAndStatus_CodeAndEndDateGreaterThanAndRecordActivityIsTrue(
            familyTree.getId(),
            SubscriptionStatusEnum.Active.value(),
            Instant.now().plus(applicationProperties.getSubscription().getCanRenewBeforeDays(), ChronoUnit.DAYS)
        );

        if (hasActiveSubscription) {
            throw new BadRequestException("subscription.has_active_subscription");
        } else {
            boolean hasWaitingForPaymentSubscription = subscriptionRepository.existsByFamilyTree_IdAndStatus_CodeInAndRecordActivityIsTrue(
                familyTree.getId(),
                Collections.singletonList(SubscriptionStatusEnum.WaitingForPayment.value())
            );

            if (hasWaitingForPaymentSubscription) {
                throw new BadRequestException("subscription.has_waiting_for_payment_subscription");
            } else {
                int numberOfCoops = 0;//coopRepository.countByWarehouse_FamilyTree_IdAndRecordActivityIsTrue(familyTree.getId());

                return packageRepository
                    .findByIdAndFamilyTreeType_CodeAndRangeEndGreaterThanEqualAndRecordActivityIsTrueAndCanRenewIsTrue(
                        packageId,
                        familyTree.getType().getCode(),
                        (long) numberOfCoops
                    )
                    .orElseThrow(() -> new BadRequestException("subscription.not_suitable_package"));
            }
        }
    }

    @Transactional(readOnly = true)
    public Package isSuitableForUpgrade(Subscription subscription, Long packageId) {
        boolean foundWaitingForPaymentRequest = subscription
            .getSubscriptionUpgradeRequests()
            .stream()
            .anyMatch(it -> it.getStatus().getCode().equalsIgnoreCase(SubscriptionStatusEnum.WaitingForPayment.value()));

        if (foundWaitingForPaymentRequest) {
            throw new BadRequestException("subscription.found_waiting_for_payment");
        } else if (subscription.getEndDate().isBefore(Instant.now().plus(3, ChronoUnit.DAYS))) {
            throw new BadRequestException("subscription.near_expiry");
        } else {
            return packageRepository
                .findByIdAndFamilyTreeType_CodeAndRangeEndGreaterThanEqualAndRecordActivityIsTrueAndCanRenewIsTrue(
                    packageId,
                    FamilyTreeTypeEnum.Pigeon.value(),
                    subscription.getRangeEnd() + 1
                )
                .orElseThrow(() -> new BadRequestException("not_found"));
        }
    }

    @Transactional(readOnly = true)
    public Package getTrialPackage(String familyTreeTypeCode) {
        return packageRepository.findByFamilyTreeType_CodeAndRecordActivityIsTrueAndCanRenewIsFalse(familyTreeTypeCode);
    }
}
