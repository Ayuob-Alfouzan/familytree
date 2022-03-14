import { Pipe, PipeTransform } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Pipe({
  name: 'showErrorMessage',
  pure: false,
})
export class ShowErrorMessagePipe implements PipeTransform {
  transform(formGroup: FormGroup, formControlName: string, errorsIn: string[] = [], errorsOut: string[] = []): boolean {
    if (errorsIn.length > 0) {
      let hasErrorIn = false;
      let hasErrorOut = false;

      for (const error of errorsIn) {
        if (formGroup.get(formControlName)?.hasError(error) && formGroup.get(formControlName)?.touched) {
          hasErrorIn = true;
          break;
        }
      }

      for (const error of errorsOut) {
        if (formGroup.get(formControlName)?.hasError(error) && formGroup.get(formControlName)?.touched) {
          hasErrorOut = true;
          break;
        }
      }

      return hasErrorIn && !hasErrorOut;
    } else {
      return false;
    }
  }
}
