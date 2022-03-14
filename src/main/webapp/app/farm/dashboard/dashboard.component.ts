import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { AccountService } from 'app/core/auth/account.service';
import { first } from 'rxjs/operators';
import { DashboardModel } from '../../familyTree-management/models/familyTree.model';

@Component({
  selector: 'jhi-familyTree-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  dashboardData?: DashboardModel;
  familyTree = this.accountService.selectedFarm;
  isMain = false;
  faEye = faEye;
  isCollapsed = window.innerWidth < 400 || false;

  constructor(private accountService: AccountService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.data.pipe(first()).subscribe(data => {
      this.dashboardData = data.dashboardData;

      if (this.familyTree != null) {
        if (this.familyTree.type.code === 'MAIN') {
          this.isMain = true;
        }
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  toggleDashboard(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
