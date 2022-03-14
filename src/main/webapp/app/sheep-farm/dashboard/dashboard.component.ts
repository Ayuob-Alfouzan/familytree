import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { AccountService } from 'app/core/auth/account.service';
import { DashboardModel } from '../models/sheep.model';

@Component({
  selector: 'jhi-sheep-farm-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  @Input()
  dashboardData?: DashboardModel;
  farm = this.accountService.selectedFarm;
  isMain = false;
  faEye = faEye;
  isCollapsed = window.innerWidth < 400 || false;

  constructor(private accountService: AccountService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    if (this.farm != null && this.farm.type.code === 'MAIN') {
      this.isMain = true;
    }
  }

  toggleDashboard(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
