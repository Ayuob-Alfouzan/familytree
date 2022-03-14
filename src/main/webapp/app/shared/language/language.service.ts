import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private _lang = 'ar-ly';
  private navSubject$ = new BehaviorSubject<string>(this._lang);

  constructor(private translateService: TranslateService) {
    this._lang = this.translateService.currentLang;
    this.translateService.onLangChange.subscribe(lang => {
      this.navSubject$.next(lang.lang);
    });
  }

  onLangChange(): Observable<string> {
    return this.navSubject$.asObservable();
  }
}
