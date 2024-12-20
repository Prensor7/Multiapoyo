import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function noGlobalValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';
    if (value.toLowerCase().includes('global')) {
      return { 'noGlobal': true };
    }
    return null;
  };
}
