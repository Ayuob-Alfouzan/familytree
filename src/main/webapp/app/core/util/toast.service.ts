import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private translateService: TranslateService, private toastr: ToastrService) {}

  public success(message: string): void {
    this.toastr.success(this.translateService.instant(message), '', {
      timeOut: 5000,
    });
  }

  public error(error: any): void {
    if (error?.error) {
      error = error.error;
    }

    if (error?.message?.ar) {
      this.toastr.error(error.message[this.translateService.currentLang.substr(0, 2)], '', {
        timeOut: 5000,
      });
    } else {
      this.toastr.error(this.translateService.instant('global.message.error.internalServerError'), '', {
        timeOut: 5000,
      });
    }
  }
}
