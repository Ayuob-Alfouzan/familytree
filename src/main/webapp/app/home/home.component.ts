import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { Account, FamilyTreeModel } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { first } from 'rxjs/operators';
import { FamilyTreeDashboardModel } from './home.model';
import { HomeService } from './home.service';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styles: [``],
})
export class HomeComponent implements OnInit {
  account?: Account | null;
  dashboardData?: FamilyTreeDashboardModel;
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

    this.service.getFamilyTreeDashboard().subscribe(result => {
      this.dashboardData = result;
    });
  }

  selectFamilyTree(selectedFamilyTree: FamilyTreeModel): void {
    this.accountService.selectedFamilyTree = selectedFamilyTree;

    if (this.router.url === '/family-tree') {
      this.router.navigate(['/', 'family-tree']).then(() => {
        window.location.reload();
      });
    } else {
      this.router.navigate(['/', 'family-tree']);
    }
  }

  getCurrentLanguage(): string {
    return this.translateService.currentLang;
  }
}
