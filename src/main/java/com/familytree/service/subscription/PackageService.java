package com.familytree.service.subscription;

import com.familytree.config.ApplicationProperties;
import com.familytree.domain.farm.*;
import com.familytree.domain.subscription.Package;
import com.familytree.domain.subscription.Subscription;
import com.familytree.repository.farm.CoopRepository;
import com.familytree.repository.farm.SheepRepository;
import com.familytree.repository.subscription.PackageRepository;
import com.familytree.repository.subscription.SubscriptionRepository;
import com.familytree.service.dto.subscription.PackageDTO;
import com.familytree.service.farm.OwnershipService;
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

    private final CoopRepository coopRepository;

    private final SheepRepository sheepRepository;

    private final SubscriptionRepository subscriptionRepository;

    public PackageService(
        ApplicationProperties applicationProperties,
        PackageRepository packageRepository,
        PackageMapper packageMapper,
        LookupService lookupService,
        OwnershipService ownershipService,
        CoopRepository coopRepository,
        SheepRepository sheepRepository,
        SubscriptionRepository subscriptionRepository
    ) {
        this.applicationProperties = applicationProperties;
        this.packageRepository = packageRepository;
        this.packageMapper = packageMapper;
        this.lookupService = lookupService;
        this.ownershipService = ownershipService;
        this.coopRepository = coopRepository;
        this.sheepRepository = sheepRepository;
        this.subscriptionRepository = subscriptionRepository;
    }

    @Transactional(readOnly = true)
    public List<PackageDTO> listPackagesByFarmType(String farmTypeCode) {
        return packageMapper.toDto(
            packageRepository.findByFarmType_CodeAndRecordActivityIsTrueAndCanRenewIsTrue(farmTypeCode.toUpperCase())
        );
    }

    @Transactional(readOnly = true)
    public List<PackageDTO> listSuitable(Long farmId) {
        Farm farm = ownershipService.getToWriteByFarmId(farmId);

        boolean hasActiveSubscription = subscriptionRepository.existsByFarm_IdAndStatus_CodeAndEndDateGreaterThanAndRecordActivityIsTrue(
            farmId,
            SubscriptionStatusEnum.Active.value(),
            Instant.now().plus(applicationProperties.getSubscription().getCanRenewBeforeDays(), ChronoUnit.DAYS)
        );

        if (hasActiveSubscription) {
            throw new BadRequestException("subscription.has_active_subscription");
        } else {
            boolean hasWaitingForPaymentSubscription = subscriptionRepository.existsByFarm_IdAndStatus_CodeInAndRecordActivityIsTrue(
                farmId,
                Collections.singletonList(SubscriptionStatusEnum.WaitingForPayment.value())
            );

            if (hasWaitingForPaymentSubscription) {
                throw new BadRequestException("subscription.has_waiting_for_payment_subscription");
            } else {
                if (farm.getType().getCode().equalsIgnoreCase(FarmTypeEnum.Pigeon.value())) {
                    int numberOfCoops = coopRepository.countByWarehouse_Farm_IdAndRecordActivityIsTrue(farm.getId());
                    return packageMapper.toDto(
                        packageRepository.findByFarmType_CodeAndRangeEndGreaterThanEqualAndRecordActivityIsTrueAndCanRenewIsTrue(
                            farm.getType().getCode(),
                            (long) numberOfCoops
                        )
                    );
                } else if (farm.getType().getCode().equalsIgnoreCase(FarmTypeEnum.Sheep.value())) {
                    int numberOfSheep = sheepRepository.countByFarm_IdAndRecordActivityIsTrue(farm.getId());
                    return packageMapper.toDto(
                        packageRepository.findByFarmType_CodeAndRangeEndGreaterThanEqualAndRecordActivityIsTrueAndCanRenewIsTrue(
                            farm.getType().getCode(),
                            (long) numberOfSheep
                        )
                    );
                } else {
                    throw new BadRequestException("error.not_found");
                }
            }
        }
    }

    @Transactional(readOnly = true)
    public List<PackageDTO> listSuitableForUpgrade(Long farmId, Long subscriptionId) {
        Farm farm = ownershipService.getToWriteByFarmId(farmId);
        Subscription subscription = subscriptionRepository
            .findByIdAndFarm_IdAndRecordActivityIsTrueAndStatus_CodeIn(
                subscriptionId,
                farm.getId(),
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
                packageRepository.findByFarmType_CodeAndRangeEndGreaterThanEqualAndRecordActivityIsTrueAndCanRenewIsTrue(
                    farm.getType().getCode(),
                    subscription.getRangeEnd() + 1
                )
            );
        }
    }

    @Transactional(readOnly = true)
    public Package suitableForRenew(Long farmId, Long subscriptionId) {
        Farm farm = ownershipService.getToWriteByFarmId(farmId);
        boolean hasWaitingForPayment = subscriptionRepository.existsByFarm_IdAndStatus_CodeInAndRecordActivityIsTrue(
            farmId,
            Collections.singletonList(SubscriptionStatusEnum.WaitingForPayment.value())
        );

        if (hasWaitingForPayment) {
            throw new BadRequestException("subscription.has_waiting_for_payment_subscription");
        }

        Subscription subscription = subscriptionRepository
            .findByIdAndFarm_IdAndRecordActivityIsTrueAndStatus_CodeIn(
                subscriptionId,
                farm.getId(),
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
    public Package isSuitable(Farm farm, Long packageId) {
        boolean hasActiveSubscription = subscriptionRepository.existsByFarm_IdAndStatus_CodeAndEndDateGreaterThanAndRecordActivityIsTrue(
            farm.getId(),
            SubscriptionStatusEnum.Active.value(),
            Instant.now().plus(applicationProperties.getSubscription().getCanRenewBeforeDays(), ChronoUnit.DAYS)
        );

        if (hasActiveSubscription) {
            throw new BadRequestException("subscription.has_active_subscription");
        } else {
            boolean hasWaitingForPaymentSubscription = subscriptionRepository.existsByFarm_IdAndStatus_CodeInAndRecordActivityIsTrue(
                farm.getId(),
                Collections.singletonList(SubscriptionStatusEnum.WaitingForPayment.value())
            );

            if (hasWaitingForPaymentSubscription) {
                throw new BadRequestException("subscription.has_waiting_for_payment_subscription");
            } else {
                int numberOfCoops = coopRepository.countByWarehouse_Farm_IdAndRecordActivityIsTrue(farm.getId());

                return packageRepository
                    .findByIdAndFarmType_CodeAndRangeEndGreaterThanEqualAndRecordActivityIsTrueAndCanRenewIsTrue(
                        packageId,
                        farm.getType().getCode(),
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
                .findByIdAndFarmType_CodeAndRangeEndGreaterThanEqualAndRecordActivityIsTrueAndCanRenewIsTrue(
                    packageId,
                    FarmTypeEnum.Pigeon.value(),
                    subscription.getRangeEnd() + 1
                )
                .orElseThrow(() -> new BadRequestException("not_found"));
        }
    }

    @Transactional(readOnly = true)
    public Package getTrialPackage(String farmTypeCode) {
        return packageRepository.findByFarmType_CodeAndRecordActivityIsTrueAndCanRenewIsFalse(farmTypeCode);
    }
}
