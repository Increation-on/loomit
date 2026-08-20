// app/(public)/login/page.tsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/core/Input';
import { Button } from '@/components/ui/core/Button';

const loginSchema = z.object({
  email: z.string().email('Неверный формат email'),
  password: z.string().min(1, 'Введите пароль'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setError('Неверный email или пароль');
      setIsLoading(false);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Вход</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Вход...' : 'Войти'}
          </Button>
        </form>
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Или</span>
          </div>
        </div>
        
        <Button
          variant="outline"
          onClick={handleGoogleSignIn}
          className="w-full"
        >
          Войти через Google
        </Button>
        
        <p className="text-center text-sm text-gray-600 mt-4">
          Нет аккаунта?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Зарегистрироваться
          </a>
        </p>
      </div>
    </div>
  );
}
