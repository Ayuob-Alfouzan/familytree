package com.familytree.service.farm;

import com.familytree.config.ApplicationProperties;
import com.familytree.domain.farm.Farm;
import com.familytree.domain.farm.FarmUser;
import com.familytree.repository.farm.FarmRepository;
import com.familytree.repository.farm.FarmUserRepository;
import com.familytree.repository.farm.WarehouseUserRepository;
import com.familytree.security.SecurityUtils;
import com.familytree.service.account.UserService;
import com.familytree.service.dto.farm.FarmDTO;
import com.familytree.service.lookup.FarmUserTypeEnum;
import com.familytree.service.lookup.LookupCategory;
import com.familytree.service.lookup.LookupService;
import com.familytree.service.mapper.farm.FarmMapper;
import com.familytree.service.subscription.SubscriptionService;
import com.familytree.service.util.exception.BadRequestException;
import com.familytree.web.rest.vm.farm.*;
import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.service.QueryService;

@Service
public class FarmService extends QueryService<Farm> {

    private final Logger log = LoggerFactory.getLogger(FarmService.class);

    private final FarmRepository farmRepository;

    private final FarmMapper farmMapper;

    private final ApplicationProperties applicationProperties;

    private final UserService userService;

    private final LookupService lookupService;

    private final FarmUserRepository farmUserRepository;

    private final WarehouseUserRepository warehouseUserRepository;

    private final OwnershipService ownershipService;

    private final SubscriptionService subscriptionService;

    public FarmService(
        FarmRepository farmRepository,
        FarmMapper farmMapper,
        ApplicationProperties applicationProperties,
        UserService userService,
        LookupService lookupService,
        FarmUserRepository farmUserRepository,
        WarehouseUserRepository warehouseUserRepository,
        OwnershipService ownershipService,
        SubscriptionService subscriptionService
    ) {
        this.farmRepository = farmRepository;
        this.farmMapper = farmMapper;
        this.applicationProperties = applicationProperties;
        this.userService = userService;
        this.lookupService = lookupService;
        this.farmUserRepository = farmUserRepository;
        this.warehouseUserRepository = warehouseUserRepository;
        this.ownershipService = ownershipService;
        this.subscriptionService = subscriptionService;
    }

    @Transactional
    public FarmDTO add(AddFarmRequestVM vm) {
        Farm farm = new Farm();
        farm.setNameAr(vm.getNameAr());
        farm.setNameEn(vm.getNameEn());
        farm.setLocation(vm.getLocation());
        farm.setVatNumber(vm.getVatNumber());
        farm.setType(lookupService.getEntityByCodeAndCategory(vm.getType(), LookupCategory.FarmType.value()));

        FarmUser farmUser = new FarmUser();
        farmUser.setType(lookupService.getEntityByCodeAndCategory(FarmUserTypeEnum.Main.value(), LookupCategory.FarmUserType.value()));
        farmUser.setFarm(farm);
        farmUser.setUser(userService.getUser());

        farm.getFarmUsers().add(farmUser);

        farm.getSubscriptions().add(subscriptionService.createTrail(farm));

        return farmMapper.toDto(farmRepository.save(farm));
    }

    @Transactional(readOnly = true)
    public FarmDTO get(Long id) {
        return farmMapper.toDto(ownershipService.getToWriteByFarmId(id));
    }

    @Transactional
    public FarmDTO edit(EditFarmRequestVM vm) {
        Farm farm = ownershipService.getToWriteByFarmId(vm.getId());

        farm.setNameAr(vm.getNameAr());
        farm.setNameEn(vm.getNameEn());
        farm.setLocation(vm.getLocation());
        farm.setVatNumber(vm.getVatNumber());

        return farmMapper.toDto(farmRepository.save(farm));
    }

    @Transactional
    public FarmDTO delete(Long id) {
        Farm farm = ownershipService.getToWriteByFarmId(id);

        farm.setRecordActivity(false);

        farm.getFarmUsers().forEach(it -> it.setRecordActivity(false));

        return farmMapper.toDto(farmRepository.save(farm));
    }

    @Transactional
    public void remove(Long id) {
        Farm farm = ownershipService.getToViewByFarmId(id);

        FarmUser farmUser = farmUserRepository
            .findByFarm_IdAndUser_IdAndRecordActivityIsTrue(farm.getId(), SecurityUtils.getCurrentUserIdOrThrowException())
            .orElseThrow(() -> new BadRequestException("not_found"));

        if (farmUser.getType().getCode().equalsIgnoreCase(FarmUserTypeEnum.Main.value())) {
            int numberOfMainUsers = farmUserRepository.countByFarm_IdAndFarm_RecordActivityIsTrueAndRecordActivityIsTrueAndUser_IdAndType_CodeIn(
                farm.getId(),
                SecurityUtils.getCurrentUserIdOrThrowException(),
                Collections.singletonList(FarmUserTypeEnum.Main.value())
            );

            if (numberOfMainUsers <= 1) {
                throw new BadRequestException("farm.last_main_user");
            }
        }

        farmUser.setRecordActivity(false);
        farmUserRepository.save(farmUser);
    }

    @Transactional(readOnly = true)
    public Integer dashboardData(Long id) {
        return farmUserRepository.countByFarm_IdAndFarm_RecordActivityIsTrueAndRecordActivityIsTrue(id);
    }

    @Transactional(readOnly = true)
    public int numberOfOwnedFarms() {
        return farmUserRepository.countByFarm_RecordActivityIsTrueAndRecordActivityIsTrueAndUser_IdAndType_CodeIn(
            SecurityUtils.getCurrentUserIdOrThrowException(),
            Collections.singletonList(FarmUserTypeEnum.Main.value())
        );
    }

    @Transactional(readOnly = true)
    public int numberOfFarms() {
        return farmUserRepository.countByFarm_RecordActivityIsTrueAndRecordActivityIsTrueAndUser_IdAndType_CodeIn(
            SecurityUtils.getCurrentUserIdOrThrowException(),
            Arrays.asList(FarmUserTypeEnum.Main.value(), FarmUserTypeEnum.Normal.value())
        );
    }

    @Transactional
    public FarmDTO addUser(AddUserRequestVM vm) {
        Farm farm = ownershipService.getToWriteByFarmId(vm.getId());

        Optional<FarmUser> farmUser = farm
            .getFarmUsers()
            .stream()
            .filter(it -> it.getUser().getEmail().equalsIgnoreCase(vm.getUserEmail()))
            .findAny();

        if (farmUser.isPresent()) {
            FarmUser oldFarmUser = farmUser.get();
            if (oldFarmUser.getRecordActivity()) {
                throw new BadRequestException("farm.user_already_added");
            } else {
                oldFarmUser.setRecordActivity(true);
                farmUserRepository.save(oldFarmUser);
            }
        } else {
            FarmUser newFarmUser = new FarmUser();
            newFarmUser.setType(lookupService.getEntityByCodeAndCategory(vm.getFarmUserType(), LookupCategory.FarmUserType.value()));
            newFarmUser.setFarm(farm);
            newFarmUser.setUser(userService.getUser(vm.getUserEmail()));

            farm.getFarmUsers().add(newFarmUser);

            farmRepository.save(farm);
        }

        return farmMapper.toDto(farm);
    }

    @Transactional
    public FarmDTO removeUser(RemoveUserRequestVM vm) {
        Farm farm = ownershipService.getToWriteByFarmId(vm.getId());

        if (vm.getUserId().equals(SecurityUtils.getCurrentUserIdOrThrowException())) {
            throw new BadRequestException("farm.cannot_remove_self");
        }

        Optional<FarmUser> farmUser = farm.getFarmUsers().stream().filter(it -> it.getUser().getId().equals(vm.getUserId())).findAny();

        if (farmUser.isPresent()) {
            warehouseUserRepository.removeUserFromAllWarehousesByFarmId(farm.getId(), farmUser.get().getUser().getId());
            farm.getFarmUsers().remove(farmUser.get());
            return farmMapper.toDto(farmRepository.save(farm));
        } else {
            throw new BadRequestException("not_found");
        }
    }
}
