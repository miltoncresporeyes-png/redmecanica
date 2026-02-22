import { useState, useCallback } from 'react';
import { z } from 'zod';
import { validateForm } from '../validations/schemas';

interface UseFormValidationOptions<T> {
  schema: z.ZodSchema<T>;
  initialValues: T;
}

interface UseFormValidationReturn<T> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isValid: boolean;
  setFieldValue: (field: string, value: any) => void;
  setFieldTouched: (field: string) => void;
  validate: () => boolean;
  validateField: (field: string) => boolean;
  reset: () => void;
  handleChange: (field: keyof T) => (value: any) => void;
}

export function useFormValidation<T extends Record<string, any>>({
  schema,
  initialValues,
}: UseFormValidationOptions<T>): UseFormValidationReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const setFieldValue = useCallback((field: string, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    
    if (touched[field]) {
      const fieldSchema = schema.shape[field];
      if (fieldSchema) {
        const result = fieldSchema.safeParse(value);
        setErrors((prev) => ({
          ...prev,
          [field]: result.success ? '' : result.error.issues[0].message,
        }));
      }
    }
  }, [schema, touched]);

  const setFieldTouched = useCallback((field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    
    const fieldSchema = schema.shape[field];
    if (fieldSchema) {
      const result = fieldSchema.safeParse(values[field]);
      setErrors((prev) => ({
        ...prev,
        [field]: result.success ? '' : result.error.issues[0].message,
      }));
    }
  }, [schema, values]);

  const validate = useCallback(() => {
    const result = validateForm(schema, values);
    if (result.success) {
      setErrors({});
      return true;
    }
    setErrors(result.errors || {});
    return false;
  }, [schema, values]);

  const validateField = useCallback((field: string) => {
    const fieldSchema = schema.shape[field];
    if (fieldSchema) {
      const result = fieldSchema.safeParse(values[field]);
      setErrors((prev) => ({
        ...prev,
        [field]: result.success ? '' : result.error.issues[0].message,
      }));
      return result.success;
    }
    return true;
  }, [schema, values]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const handleChange = useCallback((field: keyof T) => (value: any) => {
    setFieldValue(field as string, value);
  }, [setFieldValue]);

  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    touched,
    isValid,
    setFieldValue,
    setFieldTouched,
    validate,
    validateField,
    reset,
    handleChange,
  };
}
