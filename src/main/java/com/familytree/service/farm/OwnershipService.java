package com.familytree.service.farm;

import com.familytree.domain.farm.*;
import com.familytree.domain.subscription.Subscription;
import com.familytree.repository.farm.*;
import com.familytree.repository.subscription.SubscriptionRepository;
import com.familytree.security.SecurityUtils;
import com.familytree.service.lookup.FarmTypeEnum;
import com.familytree.service.lookup.FarmUserTypeEnum;
import com.familytree.service.util.exception.BadRequestException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OwnershipService {

    private final FarmRepository farmRepository;

    private final CoopRepository coopRepository;

    private final SheepRepository sheepRepository;

    private final WarehouseRepository warehouseRepository;

    private final WarehouseUserRepository warehouseUserRepository;

    private final SubscriptionRepository subscriptionRepository;

    public OwnershipService(
        FarmRepository farmRepository,
        CoopRepository coopRepository,
        SheepRepository sheepRepository,
        WarehouseRepository warehouseRepository,
        WarehouseUserRepository warehouseUserRepository,
        SubscriptionRepository subscriptionRepository
    ) {
        this.farmRepository = farmRepository;
        this.coopRepository = coopRepository;
        this.sheepRepository = sheepRepository;
        this.warehouseRepository = warehouseRepository;
        this.warehouseUserRepository = warehouseUserRepository;
        this.subscriptionRepository = subscriptionRepository;
    }

    @Transactional(readOnly = true)
    public Farm getToWriteByFarmId(Long farmId) {
        return farmRepository
            .findByIdAndFarmUsers_Type_CodeAndRecordActivityIsTrueAndFarmUsers_User_Email(
                farmId,
                FarmUserTypeEnum.Main.value(),
                SecurityUtils.getCurrentUserEmailOrThrowException()
            )
            .orElseThrow(() -> new BadRequestException("not_found"));
    }

    @Transactional(readOnly = true)
    public Farm getToWriteByFarmIdAndType(Long farmId, String farmTypeCode) {
        return farmRepository
            .findByIdAndType_CodeAndFarmUsers_Type_CodeAndRecordActivityIsTrueAndFarmUsers_User_Email(
                farmId,
                farmTypeCode,
                FarmUserTypeEnum.Main.value(),
                SecurityUtils.getCurrentUserEmailOrThrowException()
            )
            .orElseThrow(() -> new BadRequestException("not_found"));
    }

    @Transactional(readOnly = true)
    public Farm getToViewByFarmId(Long farmId) {
        return farmRepository
            .findByIdAndRecordActivityIsTrueAndFarmUsers_User_Email(farmId, SecurityUtils.getCurrentUserEmailOrThrowException())
            .orElseThrow(() -> new BadRequestException("not_found"));
    }

    @Transactional(readOnly = true)
    public Farm getToViewByFarmIdAndType(Long farmId, String farmTypeCode) {
        return farmRepository
            .findByIdAndType_CodeAndRecordActivityIsTrueAndFarmUsers_User_Email(
                farmId,
                farmTypeCode,
                SecurityUtils.getCurrentUserEmailOrThrowException()
            )
            .orElseThrow(() -> new BadRequestException("not_found"));
    }

    @Transactional(readOnly = true)
    public Coop getCoopToManage(Long id) {
        Optional<Coop> coop = coopRepository.findByIdAndUserHaveAuthority(id, SecurityUtils.getCurrentUserIdOrThrowException());

        return coop.orElseGet(() -> getCoopToManageForMainUser(id));
    }

    @Transactional(readOnly = true)
    public Sheep getSheepToManage(Long id) {
        return sheepRepository
            .findByIdAndRecordActivityIsTrueAndFarm_FarmUsers_User_Id(id, SecurityUtils.getCurrentUserIdOrThrowException())
            .orElseThrow(() -> new BadRequestException("not_found"));
    }

    @Transactional(readOnly = true)
    public Coop getCoopToManageForMainUser(Long id) {
        Optional<Coop> coop = coopRepository.findByIdAndRecordActivityIsTrueAndWarehouse_Farm_FarmUsers_Type_CodeAndWarehouse_Farm_RecordActivityIsTrueAndWarehouse_Farm_FarmUsers_RecordActivityIsTrueAndWarehouse_Farm_FarmUsers_User_Email(
            id,
            FarmUserTypeEnum.Main.value(),
            SecurityUtils.getCurrentUserEmailOrThrowException()
        );

        if (coop.isPresent()) {
            return coop.get();
        } else {
            throw new BadRequestException("not_found");
        }
    }

    @Transactional(readOnly = true)
    public Warehouse getToManage(Long id) {
        Optional<Warehouse> warehouse = warehouseUserRepository
            .findByWarehouse_IdAndWarehouse_RecordActivityIsTrueAndUser_IdAndRecordActivityIsTrue(
                id,
                SecurityUtils.getCurrentUserIdOrThrowException()
            )
            .map(WarehouseUser::getWarehouse);

        return warehouse.orElseGet(() -> getToManageForMainUser(id));
    }

    @Transactional(readOnly = true)
    public Warehouse getToManageForMainUser(Long id) {
        Optional<Warehouse> warehouse = warehouseRepository.findByIdAndRecordActivityIsTrueAndFarm_FarmUsers_Type_CodeAndFarm_RecordActivityIsTrueAndFarm_FarmUsers_RecordActivityIsTrueAndFarm_FarmUsers_User_Email(
            id,
            FarmUserTypeEnum.Main.value(),
            SecurityUtils.getCurrentUserEmailOrThrowException()
        );
        if (warehouse.isPresent()) {
            return warehouse.get();
        } else {
            throw new BadRequestException("not_found");
        }
    }

    @Transactional(readOnly = true)
    public void checkCoopPackageLimitationForPigeonFarm(Long farmId) {
        Subscription subscription = checkHasActiveSubscription(farmId);

        int numberOfCoops = coopRepository.countByWarehouse_Farm_IdAndRecordActivityIsTrue(farmId);

        if (numberOfCoops >= subscription.getRangeEnd()) {
            throw new BadRequestException("subscription.range_end_reached");
        }
    }

    @Transactional(readOnly = true)
    public void checkSheepPackageLimitationForSheepFarm(Long farmId, int numberOfSheepToAdd) {
        Subscription subscription = checkHasActiveSubscription(farmId);

        int numberOfSheep = sheepRepository.countByFarm_IdAndRecordActivityIsTrue(farmId);
        numberOfSheep += numberOfSheepToAdd;

        if (numberOfSheep > subscription.getRangeEnd()) {
            throw new BadRequestException("subscription.range_end_reached");
        }
    }

    @Transactional(readOnly = true)
    public Subscription checkHasActiveSubscription(Long farmId) {
        return subscriptionRepository
            .findActiveSubscription(farmId)
            .orElseThrow(() -> new BadRequestException("subscription.does_not_have_active_subscription"));
    }

    @Transactional
    public List<String> getSheepFarmUserEmails(Long farmId, String notificationType) {
        return farmRepository
            .findByIdAndType_CodeAndRecordActivityIsTrue(farmId, FarmTypeEnum.Sheep.value())
            .map(
                it ->
                    it
                        .getFarmUsers()
                        .stream()
                        .filter(itt -> itt.getType().getCode().equalsIgnoreCase(FarmUserTypeEnum.Main.value()))
                        .map(itt -> itt.getUser().getEmail())
                        .collect(Collectors.toList())
            )
            .orElse(new ArrayList<>());
    }
}
