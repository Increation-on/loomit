// src/components/ui/FormField.tsx
'use client';

import { useFormContext } from 'react-hook-form';
import { Input, InputProps } from '../core/Input';

interface FormFieldProps extends InputProps {
  name: string;
}

export function FormField({ name, label, ...props }: FormFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return (
    <Input
      label={label}
      error={error}
      {...register(name)}
      {...props}
    />
  );
}