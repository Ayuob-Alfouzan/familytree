import { NgModule, LOCALE_ID, Inject } from '@angular/core';
import { DOCUMENT, registerLocaleData } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import locale from '@angular/common/locales/ar-LY';
import { BrowserModule, Title } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { TranslateModule, TranslateService, TranslateLoader, MissingTranslationHandler } from '@ngx-translate/core';
import { LocalStorageService, NgxWebstorageModule } from 'ngx-webstorage';
import * as dayjs from 'dayjs';
import { NgbDateAdapter, NgbDatepickerConfig, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { SERVER_API_URL } from './app.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import './config/dayjs';
import { SharedModule } from 'app/shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { NgbDateDayjsAdapter } from './config/datepicker-adapter';
import { fontAwesomeIcons } from './config/font-awesome-icons';
import { httpInterceptorProviders } from 'app/core/interceptor/index';
import { FindLanguageFromKeyPipe } from 'app/shared/language/find-language-from-key.pipe';
import { translatePartialLoader, missingTranslationHandler } from './config/translation.config';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { MainComponent } from './layout/main/main.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './anon/login/login.component';
import { RegisterComponent } from './anon/register/register.component';
import { HomeService } from './home/home.service';
import { LoginService } from './anon/login/login.service';
import { RegisterService } from './anon/register/register.service';
import { ForgotPasswordComponent } from './anon/forgot-password/forgot-password.component';
import { ForgotPasswordService } from './anon/forgot-password/forgot-password.service';
import { CustomDatepickerI18n } from './config/custom-datepicker-i18n';
import { ContainerComponent } from './anon/container/container.component';
import { ContactUsComponent } from './static/contact-us/contact-us.component';
import { PrivacyPolicyComponent } from './static/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './static/terms-and-conditions/terms-and-conditions.component';
import { AboutUsComponent } from './static/about-us/about-us.component';
import { PricingComponent } from './static/pricing/pricing.component';
import { PricingService } from './static/pricing/pricing.service';

@NgModule({
  imports: [
    BrowserModule,
    SharedModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    AppRoutingModule,
    // Set this to true to enable service worker (PWA)
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: false }),
    HttpClientModule,
    NgxWebstorageModule.forRoot({ prefix: 'jhi', separator: '-', caseSensitive: true }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translatePartialLoader,
        deps: [HttpClient],
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useFactory: missingTranslationHandler,
      },
    }),
    BrowserAnimationsModule,
    ClipboardModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-center',
    }),
  ],
  providers: [
    Title,
    { provide: LOCALE_ID, useValue: 'ar-ly' },
    { provide: NgbDateAdapter, useClass: NgbDateDayjsAdapter },
    { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
    FindLanguageFromKeyPipe,
    httpInterceptorProviders,
    HomeService,
    LoginService,
    RegisterService,
    ForgotPasswordService,
    PricingService,
  ],
  declarations: [
    FooterComponent,
    HeaderComponent,
    MainComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ContainerComponent,
    ContactUsComponent,
    PrivacyPolicyComponent,
    TermsAndConditionsComponent,
    AboutUsComponent,
    PricingComponent,
  ],
  bootstrap: [MainComponent],
})
export class AppModule {
  constructor(
    applicationConfigService: ApplicationConfigService,
    iconLibrary: FaIconLibrary,
    dpConfig: NgbDatepickerConfig,
    translateService: TranslateService,
    localStorage: LocalStorageService,
    @Inject(DOCUMENT) private document: Document
  ) {
    applicationConfigService.setEndpointPrefix(SERVER_API_URL);
    registerLocaleData(locale);
    iconLibrary.addIcons(...fontAwesomeIcons);

    // Datepicker
    dayjs.locale('Riyadh');
    dpConfig.minDate = { year: dayjs().subtract(300, 'year').year(), month: 1, day: 1 };
    dpConfig.firstDayOfWeek = 7;

    // translation
    translateService.setDefaultLang('ar-ly');

    const lang = localStorage.retrieve('locale');
    translateService.use(lang ? lang : 'ar-ly');

    const htmlTag = this.document.getElementsByTagName('html')[0];
    htmlTag.dir = lang === 'en' ? 'ltr' : 'rtl';
    htmlTag.lang = lang;
  }
}
