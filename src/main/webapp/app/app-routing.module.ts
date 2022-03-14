import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './anon/login/login.component';
import { ConfigurationRouteAccessService } from './shared/configuration/configuration-route-access.service';
import { AnonGuard } from './anon/login-guard.service';
import { UserRouteAccessService } from './core/auth/user-route-access.service';
import { RegisterComponent } from './anon/register/register.component';
import { ForgotPasswordComponent } from './anon/forgot-password/forgot-password.component';
import { ContainerComponent } from './anon/container/container.component';
import { ContactUsComponent } from './static/contact-us/contact-us.component';
import { TermsAndConditionsComponent } from './static/terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './static/privacy-policy/privacy-policy.component';
import { AboutUsComponent } from './static/about-us/about-us.component';
import { PricingComponent } from './static/pricing/pricing.component';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: '',
          component: HomeComponent,
          canActivate: [UserRouteAccessService],
        },
        {
          path: 'con',
          component: ContainerComponent,
          canActivate: [AnonGuard, ConfigurationRouteAccessService],
          children: [
            {
              path: 'login',
              component: LoginComponent,
            },
            {
              path: 'register',
              component: RegisterComponent,
            },
            {
              path: 'forgot-password',
              component: ForgotPasswordComponent,
            },
          ],
        },
        {
          path: 'profile',
          loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
        },
        {
          path: 'familyTree',
          loadChildren: () => import('./familyTree/familyTree.module').then(m => m.FarmModule),
        },
        {
          path: 'sheep-familyTree',
          loadChildren: () => import('./sheep-familyTree/sheep-familyTree.module').then(m => m.SheepFarmModule),
        },
        {
          path: 'familyTree-management',
          loadChildren: () => import('./familyTree-management/familyTree-management.module').then(m => m.FarmManagementModule),
        },
        {
          path: 'financial-transaction',
          loadChildren: () => import('./financial-transaction/financial-transaction.module').then(m => m.FinancialTransactionModule),
        },
        {
          path: 'contact-us',
          component: ContactUsComponent,
        },
        {
          path: 'terms-and-conditions',
          component: TermsAndConditionsComponent,
        },
        {
          path: 'privacy-policy',
          component: PrivacyPolicyComponent,
        },
        {
          path: 'about-us',
          component: AboutUsComponent,
        },
        {
          path: 'pricing',
          component: PricingComponent,
        },
      ],
      { enableTracing: false, scrollPositionRestoration: 'enabled' }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
