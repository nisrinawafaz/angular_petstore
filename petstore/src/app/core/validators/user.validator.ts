import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      group.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    const confirmErrors = group.get('confirmPassword')?.errors;
    if (confirmErrors?.['passwordMismatch']) {
      const { passwordMismatch, ...rest } = confirmErrors;
      group.get('confirmPassword')?.setErrors(Object.keys(rest).length ? rest : null);
    }

    return null;
  };
}
