import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { Account, FarmModel } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { first } from 'rxjs/operators';
import { FarmDashboardModel } from './home.model';
import { HomeService } from './home.service';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styles: [``],
})
export class HomeComponent implements OnInit {
  account?: Account | null;
  dashboardData?: FarmDashboardModel;
  faEye = faEye;

  constructor(
    private service: HomeService,
    private accountService: AccountService,
    private router: Router,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(first())
      .subscribe(x => {
        this.account = x;
      });

    this.service.getFarmDashboard().subscribe(result => {
      this.dashboardData = result;
    });
  }

  selectFarm(selectedFarm: FarmModel): void {
    this.accountService.selectedFarm = selectedFarm;

    if (selectedFarm.farmType.code === 'PIGEON') {
      if (this.router.url === '/familyTree/dashboard') {
        this.router.navigate(['/', 'familyTree', 'dashboard']).then(() => {
          window.location.reload();
        });
      } else {
        this.router.navigate(['/', 'familyTree', 'dashboard']);
      }
    } else {
      if (this.router.url === '/sheep-familyTree/list') {
        this.router.navigate(['/', 'sheep-familyTree', 'list']).then(() => {
          window.location.reload();
        });
      } else {
        this.router.navigate(['/', 'sheep-familyTree', 'list']);
      }
    }
  }

  getCurrentLanguage(): string {
    return this.translateService.currentLang;
  }
}
