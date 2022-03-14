package com.familytree.web.rest.resource.farm;

import com.familytree.domain.farm.Farm;
import com.familytree.security.AuthoritiesConstants;
import com.familytree.service.dto.farm.FarmCriteria;
import com.familytree.service.dto.farm.FarmDTO;
import com.familytree.service.dto.farm.FarmListDTO;
import com.familytree.service.farm.*;
import com.familytree.service.financialTransaction.FinancialTransactionService;
import com.familytree.service.lookup.FarmTypeEnum;
import com.familytree.service.lookup.FinancialTransactionTypeEnum;
import com.familytree.web.rest.vm.farm.*;
import javax.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for managing registration services.
 */
@RestController
@RequestMapping("/api/farm")
public class FarmResource {

    private final Logger log = LoggerFactory.getLogger(FarmResource.class);

    private final FarmService farmService;
    private final FarmUserService farmUserService;
    private final WarehouseService warehouseService;
    private final FinancialTransactionService financialTransactionService;
    private final OwnershipService ownershipService;
    private final SheepService sheepService;
    private final SheepVaccinationService sheepVaccinationService;
    private final SheepTreatmentService sheepTreatmentService;

    public FarmResource(
        FarmService farmService,
        FarmUserService farmUserService,
        WarehouseService warehouseService,
        FinancialTransactionService financialTransactionService,
        OwnershipService ownershipService,
        SheepService sheepService,
        SheepVaccinationService sheepVaccinationService,
        SheepTreatmentService sheepTreatmentService
    ) {
        this.farmService = farmService;
        this.farmUserService = farmUserService;
        this.warehouseService = warehouseService;
        this.financialTransactionService = financialTransactionService;
        this.ownershipService = ownershipService;
        this.sheepService = sheepService;
        this.sheepVaccinationService = sheepVaccinationService;
        this.sheepTreatmentService = sheepTreatmentService;
    }

    @PostMapping("/list-owned")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<Page<FarmListDTO>> listOwned(@RequestBody FarmCriteria criteria, Pageable pageable) {
        return ResponseEntity.ok(farmUserService.listOwned(criteria, pageable));
    }

    @PostMapping("/list")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<Page<FarmListDTO>> list(@RequestBody FarmCriteria criteria, Pageable pageable) {
        return ResponseEntity.ok(farmUserService.list(criteria, pageable));
    }

    @GetMapping("/get/{id}")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<FarmDTO> get(@PathVariable("id") Long id) {
        return ResponseEntity.ok(farmService.get(id));
    }

    @PostMapping("/add")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<FarmDTO> add(@Valid @RequestBody AddFarmRequestVM requestVM) {
        return ResponseEntity.ok(farmService.add(requestVM));
    }

    @PostMapping("/edit")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<FarmDTO> edit(@Valid @RequestBody EditFarmRequestVM requestVM) {
        return ResponseEntity.ok(farmService.edit(requestVM));
    }

    @PostMapping("/delete/{id}")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<FarmDTO> delete(@PathVariable("id") Long id) {
        return ResponseEntity.ok(farmService.delete(id));
    }

    @PostMapping("/add-user")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<FarmDTO> addUser(@Valid @RequestBody AddUserRequestVM requestVM) {
        return ResponseEntity.ok(farmService.addUser(requestVM));
    }

    @PostMapping("/remove-user")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<FarmDTO> removeUser(@Valid @RequestBody RemoveUserRequestVM requestVM) {
        return ResponseEntity.ok(farmService.removeUser(requestVM));
    }

    @PostMapping("/remove/{id}")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public void remove(@PathVariable("id") Long id) {
        farmService.remove(id);
    }

    @GetMapping("/dashboard/{id}")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<FarmDashboardResponseVM> dashboard(@PathVariable("id") Long id) {
        Farm farm = ownershipService.getToViewByFarmId(id);

        FarmDashboardResponseVM responseVM = new FarmDashboardResponseVM();
        responseVM.setNumberOfUsers(farmService.dashboardData(id));
        responseVM.setNumberOfIncomeFinancialTransactions(
            financialTransactionService.getNumberOfTransactions(id, FinancialTransactionTypeEnum.Income.value())
        );
        responseVM.setNumberOfExpenseFinancialTransactions(
            financialTransactionService.getNumberOfTransactions(id, FinancialTransactionTypeEnum.Expense.value())
        );
        responseVM.setFinancialStatus(financialTransactionService.getFinancialStatus(id));

        if (farm.getType().getCode().equalsIgnoreCase(FarmTypeEnum.Pigeon.value())) {
            responseVM.setNumberOfWarehouses(warehouseService.numberOfWarehouses(id));
        } else if (farm.getType().getCode().equalsIgnoreCase(FarmTypeEnum.Sheep.value())) {
            responseVM.setNumberOfSheep(sheepService.numberOfSheep(id));
            responseVM.setNumberOfSheepVaccinations(sheepVaccinationService.numberOfSheepVaccinations(id));
            responseVM.setNumberOfSheepTreatments(sheepTreatmentService.numberOfSheepTreatments(id));
        }

        return ResponseEntity.ok(responseVM);
    }

    @GetMapping("/global-dashboard")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.USER + "\")")
    public ResponseEntity<GlobalFarmDashboardResponseVM> globalDashboard() {
        GlobalFarmDashboardResponseVM responseVM = new GlobalFarmDashboardResponseVM();
        responseVM.setNumberOfOwnedFarms(farmService.numberOfOwnedFarms());
        responseVM.setNumberOfFarms(farmService.numberOfFarms());
        return ResponseEntity.ok(responseVM);
    }
}
