'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/core/Input';
import { Button } from '@/components/ui/core/Button';

const registerSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  email: z.email('Неверный формат email'),
  password: z.string().min(6, 'Пароль должен быть минимум 6 символов'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      setError(result.error || 'Ошибка регистрации');
      setIsLoading(false);
      return;
    }

    // После регистрации перенаправляем на страницу входа
    router.push('/login?registered=true');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Регистрация</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Имя"
            placeholder="Иван Иванов"
            error={errors.name?.message}
            {...register('name')}
          />
          
          <Input
            label="Email"
            type="email"
            placeholder="ivan@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          
          <Input
            label="Пароль"
            type="password"
            placeholder="••••••"
            error={errors.password?.message}
            {...register('password')}
          />
          
          <Input
            label="Подтвердите пароль"
            type="password"
            placeholder="••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>
        </form>
        
        <p className="text-center text-sm text-gray-600 mt-4">
          Уже есть аккаунт?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Войти
          </a>
        </p>
      </div>
    </div>
  );
}
