import { AbstractControl, ValidationErrors } from '@angular/forms';
import { ZodTypeAny } from 'zod';

export function zodFieldValidator(schema: ZodTypeAny, field: string) {
  return (control: AbstractControl): ValidationErrors | null => {
    const result = schema.safeParse({ [field]: control.value });

    if (result.success) return null;

    const fieldError = result.error?.issues.find((e) => String(e.path[0]) === field);
    if (!fieldError) return null;

    return { zodError: fieldError.message };
  };
}
