import Link from 'next/link';
import { Button } from '@/components/ui/core/Button';

export default function NotFound() {
  return (
    <div className="relative flex min-h-[calc(100dvh-120px)] flex-col items-center justify-center overflow-hidden px-4 text-center">
      
      {/* Фоновый глитч-сканлайн */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute left-0 h-[2px] w-full bg-(--loom-cyan) animate-scanline shadow-[0_0_10px_var(--loom-cyan)]" />
        <div className="absolute left-0 h-[1px] w-full bg-(--loom-magenta) animate-scanline shadow-[0_0_10px_var(--loom-magenta)]" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* 
        404 с постоянным глитч-эффектом и градиентом.
        Классы glitch-number и glitch-layer описаны в globals.css ниже.
      */}
      <div className="relative mb-6 select-none animate-glitch-float">
        <h1 
          className="font-display text-[120px] font-black leading-none tracking-tighter gradient-text drop-shadow-[0_0_15px_rgba(0,255,255,0.3)] sm:text-[180px]" 
          data-text="404"
        >
          404
        </h1>
        
        {/* Цветные слои для глитча (постоянно двигаются) */}
        <span 
          className="absolute inset-0 text-[120px] font-black leading-none tracking-tighter text-(--loom-cyan) mix-blend-screen animate-glitch-cyan sm:text-[180px]" 
          aria-hidden="true"
        >
          404
        </span>
        <span 
          className="absolute inset-0 text-[120px] font-black leading-none tracking-tighter text-(--loom-magenta) mix-blend-screen animate-glitch-magenta sm:text-[180px]" 
          aria-hidden="true"
        >
          404
        </span>
      </div>

      <h2 className="mb-3 font-display text-2xl font-bold text-(--loom-white) sm:text-3xl">
        Страница улетела в другой мир
      </h2>
      
      <p className="mb-10 max-w-md text-(--loom-white)/60 sm:text-lg">
        Похоже, мы свернули не туда, или эта страница была удалена. 
        Давай вернёмся к тому, что точно работает.
      </p>

      <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
        <Link href="/" className="w-full sm:w-auto">
          <Button variant="glitch" size="lg" className="w-full">
            На главную
          </Button>
        </Link>
        
        <Link href="/catalog" className="w-full sm:w-auto">
          <Button variant="outline" size="lg" className="w-full">
            В каталог
          </Button>
        </Link>
      </div>
    </div>
  );
}
