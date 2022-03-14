import { Component, Inject, OnInit } from '@angular/core';
import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/anon/login/login.service';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Account, FamilyTreeModel } from 'app/core/auth/account.model';

@Component({
  selector: 'jhi-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  account?: Account | null;
  selectedFamilyTree: FamilyTreeModel | null = null;

  isCollapsed = true;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private accountService: AccountService,
    private loginService: LoginService,
    private router: Router,
    private localStorage: LocalStorageService,
    private translateService: TranslateService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(x => {
        this.account = x;
        this.selectedFamilyTree = this.accountService.selectedFamilyTree;
      });

    this.selectedFamilyTree = this.accountService.selectedFamilyTree;
  }

  selectFamilyTree(selectedFamilyTree: FamilyTreeModel): void {
    this.selectedFamilyTree = selectedFamilyTree;
    this.accountService.selectedFamilyTree = selectedFamilyTree;

    if (selectedFamilyTree.familyTreeType.code === 'PIGEON') {
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

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  logout(): void {
    this.selectedFamilyTree = null;
    this.loginService.logout();
    this.router.navigate(['/', 'con', 'login']);
  }

  getCurrentLanguage(): string {
    return this.translateService.currentLang;
  }

  changeLanguage(languageKey: string): void {
    this.localStorage.store('locale', languageKey);
    this.translateService.use(languageKey);

    const htmlTag = this.document.getElementsByTagName('html')[0];
    htmlTag.dir = languageKey === 'ar-ly' || languageKey === 'ur' ? 'rtl' : 'ltr';
    htmlTag.lang = languageKey;
  }

  toggleNavbar(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
