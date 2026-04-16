'use client'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

export default function RegisterPage() {
  const registerSchema = z.object({
    email: z.email('Неверный формат email'),
    password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
    confirmPassword: z.string()
  }).refine(data => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword']
  })

  type RegisterFormData = z.infer<typeof registerSchema>

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = (data: RegisterFormData) => {
    console.log('Форма отправлена', data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email?.message && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      
      <input {...register('password')} type="password" />
      {errors.password?.message && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      
      <input {...register('confirmPassword')} type="password" />
      {errors.confirmPassword?.message && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
      
      <button type="submit">Зарегистрироваться</button>
    </form>
  )
}