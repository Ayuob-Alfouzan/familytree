import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { Observable, ReplaySubject, of } from 'rxjs';
import { shareReplay, tap, catchError } from 'rxjs/operators';

import { StateStorageService } from 'app/core/auth/state-storage.service';
import { ApplicationConfigService } from '../config/application-config.service';
import { Account, FamilyTreeModel } from 'app/core/auth/account.model';
import { LanguageService } from 'app/shared/language/language.service';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private userIdentity: Account | null = null;
  private authenticationState = new ReplaySubject<Account | null>(1);
  private accountCache$?: Observable<Account | null>;
  private _selectedFamilyTree: FamilyTreeModel | null = null;

  constructor(
    private languageService: LanguageService,
    private sessionStorage: SessionStorageService,
    private http: HttpClient,
    private stateStorageService: StateStorageService,
    private router: Router,
    private applicationConfigService: ApplicationConfigService,
    private localStorage: LocalStorageService
  ) {}

  save(account: Account): Observable<{}> {
    return this.http.post(this.applicationConfigService.getEndpointFor('api/account'), account);
  }

  authenticate(identity: Account | null): void {
    this.userIdentity = identity;

    if (identity?.familyTreeList && identity.familyTreeList.length > 0) {
      this.updateSelectedFamilyTreeData(identity.familyTreeList);
    }

    this.authenticationState.next(this.userIdentity);
  }

  hasAnyAuthority(authorities: string[] | string): boolean {
    if (!this.userIdentity) {
      return false;
    }
    if (!Array.isArray(authorities)) {
      authorities = [authorities];
    }
    return this.userIdentity.authorities.some((authority: string) => authorities.includes(authority));
  }

  identity(force?: boolean): Observable<Account | null> {
    if (!this.accountCache$ || force || !this.isAuthenticated()) {
      this.accountCache$ = this.fetch().pipe(
        catchError(() => of(null)),
        tap((account: Account | null) => {
          this.authenticate(account);

          if (account) {
            this.navigateToStoredUrl();
          }
        }),
        shareReplay()
      );
    }
    return this.accountCache$;
  }

  isAuthenticated(): boolean {
    return this.userIdentity !== null;
  }

  getAuthenticationState(): Observable<Account | null> {
    return this.authenticationState.asObservable();
  }

  getImageUrl(): string {
    return this.userIdentity?.imageUrl ?? '';
  }

  updateSelectedFamilyTreeData(familyTrees: FamilyTreeModel[]): void {
    if (this._selectedFamilyTree != null) {
      const id = this._selectedFamilyTree.id;
      const newFamilyTree = familyTrees.find(x => x.id === id);

      if (newFamilyTree) {
        this.selectedFamilyTree = newFamilyTree;
      } else {
        this.selectedFamilyTree = null;
      }
    }
  }

  get selectedFamilyTree(): FamilyTreeModel | null {
    if (this._selectedFamilyTree == null) {
      this._selectedFamilyTree = this.localStorage.retrieve('selectedFamilyTree');
    }

    return this._selectedFamilyTree;
  }

  set selectedFamilyTree(familyTree: FamilyTreeModel | null) {
    this._selectedFamilyTree = familyTree;
    this.localStorage.store('selectedFamilyTree', familyTree);
  }

  private fetch(): Observable<Account> {
    return this.http.get<Account>(this.applicationConfigService.getEndpointFor('api/account'));
  }

  private navigateToStoredUrl(): void {
    // previousState can be set in the authExpiredInterceptor and in the userRouteAccessService
    // if login is successful, go to stored previousState and clear previousState
    const previousUrl = this.stateStorageService.getUrl();
    if (previousUrl) {
      this.stateStorageService.clearUrl();
      this.router.navigateByUrl(previousUrl);
    }
  }
}
