import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AnonGuard implements CanActivate {
  constructor(private accountService: AccountService) {}

  canActivate(): Observable<boolean> {
    return this.accountService.identity().pipe(map(account => (account ? false : true)));
  }
}
