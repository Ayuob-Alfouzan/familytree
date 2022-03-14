import { NgModule } from '@angular/core';
import { SharedLibsModule } from './shared-libs.module';
import { FindLanguageFromKeyPipe } from './language/find-language-from-key.pipe';
import { TranslateDirective } from './language/translate.directive';
import { HasAnyAuthorityDirective } from './auth/has-any-authority.directive';
import { DurationPipe } from './date/duration.pipe';
import { FormatMediumDatetimePipe } from './date/format-medium-datetime.pipe';
import { FormatMediumDatePipe } from './date/format-medium-date.pipe';
import { ItemCountComponent } from './pagination/item-count.component';
import { ShowErrorMessagePipe } from './pipes/show-form-error-message.pipe';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { ShowLanguagePipe } from './pipes/show-language.pipe';
import { ShowNameLanguagePipe } from './pipes/show-name-language.pipe';
import { GeneralDropdownComponent } from './components/general-dropdown/general-dropdown.component';

@NgModule({
  imports: [SharedLibsModule],
  declarations: [
    FindLanguageFromKeyPipe,
    TranslateDirective,
    HasAnyAuthorityDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    ItemCountComponent,
    ShowErrorMessagePipe,
    ConfirmModalComponent,
    DropdownComponent,
    GeneralDropdownComponent,
    ShowLanguagePipe,
    ShowNameLanguagePipe,
  ],
  exports: [
    SharedLibsModule,
    FindLanguageFromKeyPipe,
    TranslateDirective,
    HasAnyAuthorityDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    ItemCountComponent,
    ShowErrorMessagePipe,
    ConfirmModalComponent,
    DropdownComponent,
    GeneralDropdownComponent,
    ShowLanguagePipe,
    ShowNameLanguagePipe,
  ],
})
export class SharedModule {}
