'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { useGetQuizzesQuery } from '@/store/api/quizApi';
import { useGetCategoriesQuery } from '@/store/api/categoryApi';
import { selectQuizState, resetQuiz } from '@/store/slices/quizSlice';
import { persistor } from '@/store/store';
import { Modal } from '@/components/ui/feedback/Modal';
import { EmptyState } from '@/components/ui/feedback/EmptyState';
import { Button } from '@/components/ui/core/Button';
import { ArrowRight, Search } from 'lucide-react';
import { cn, pluralize } from '@/lib/utils';
import { Input } from '@/components/ui/core/Input';

export default function HomePage() {
  const { data: quizzes, isLoading: isQuizzesLoading } = useGetQuizzesQuery({});
  const { data: categories, isLoading: isCategoriesLoading } = useGetCategoriesQuery({});
  const router = useRouter();
  const dispatch = useDispatch();
  const quizState = useSelector(selectQuizState);
  const currentQuiz = quizState.currentQuiz;
  const answers = quizState.answers;
  const isFinished = quizState.isFinished;
  const [pendingQuizId, setPendingQuizId] = useState<string | null>(null);

  // ✅ Фиксируем порядок карточек один раз при загрузке (не будет перескакивать)
  const [shuffledQuizzes, setShuffledQuizzes] = useState<any[]>([]);

  useEffect(() => {
    if (quizzes && quizzes.length > 0) {
      setShuffledQuizzes([...quizzes].sort(() => Math.random() - 0.5).slice(0, 5));
    }
  }, [quizzes]); // Сработает только когда загрузятся данные, а не при каждом скролле

  // ✅ Считаем ширину карточек один раз, но через useMemo (чтобы не пересчитывать при каждом рендере)
  const cardWidth = useMemo(() => 160 + 16, []); // w-40 + gap-4

  // === Анимация по скроллу ===
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [clickedId, setClickedId] = useState<string | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || shuffledQuizzes.length === 0) return;

    const handleScroll = () => {
      const scrollLeft = el.scrollLeft;
      const index = Math.min(Math.round(scrollLeft / cardWidth), shuffledQuizzes.length - 1);
      setActiveIndex(index);
    };

    el.addEventListener('scroll', handleScroll);
    handleScroll(); // Зажигаем первую при загрузке

    return () => el.removeEventListener('scroll', handleScroll);
  }, [shuffledQuizzes, cardWidth]);

  const hasUnfinished = currentQuiz && answers.length > 0 && !isFinished;
  const isSameQuiz = currentQuiz?.id === pendingQuizId;

  const handleQuizClick = (quizId: string) => {
    // Если это тот же квиз — сразу переходим
    if (currentQuiz?.id === quizId) {
      router.push(`/quiz/${quizId}`);
      return;
    }

    if (hasUnfinished) {
      setPendingQuizId(quizId);
    } else {
      router.push(`/quiz/${quizId}`);
    }
  };

  const handleStartNew = async () => {
    await persistor.purge();
    dispatch(resetQuiz());
    if (pendingQuizId) {
      router.push(`/quiz/${pendingQuizId}`);
    }
    setPendingQuizId(null);
  };

  const handleContinue = () => {
    if (isSameQuiz) {
      router.push(`/quiz/${pendingQuizId}`);
    } else {
      router.push(`/quiz/${currentQuiz!.id}`);
    }
    setPendingQuizId(null);
  };

  return (
    <div className="min-h-screen bg-(--loom-black) text-(--loom-white) pb-24">
      {/* Поиск */}
      <div className="p-4 mb-2">
        <Input
          type="text"
          placeholder="Поиск квизов..."
          leftIcon={<Search size={20} />}
        />
      </div>

      {/* Баннер "Продолжить" / Try it */}
      <div className="px-4 mb-6">
        {hasUnfinished ? (
          <div className="bg-(--loom-white)/5 p-3 rounded-xl border border-(--loom-cyan)/30 flex items-center justify-between glitch-border">
            <div className="flex flex-col">
              <span className="text-xs text-(--loom-white)/60">Продолжить</span>
              <span className="font-semibold text-(--loom-white) text-sm">{currentQuiz?.title}</span>
              <span className="text-[10px] text-(--loom-white)/40 mt-0.5">
                {answers.length} {pluralize(answers.length, 'вопрос', 'вопроса', 'вопросов')}
              </span>
            </div>
            <Button variant="glitch" size="sm" onClick={() => handleQuizClick(currentQuiz!.id)}>
              Go
            </Button>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Try it</h2>
            </div>
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory w-max max-w-full touch-pan-x try-it-scroll"
            >
              {isQuizzesLoading ? (
                <>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-48 h-36 shrink-0 rounded-xl bg-(--loom-white)/5 animate-pulse" />
                  ))}
                </>
              ) : (
                shuffledQuizzes.map((quiz: any, index: number) => {
                  const isActive = activeIndex === index;
                  const isClicked = clickedId === quiz.id;
                  return (
                  <div
  key={quiz.id}
  id={quiz.id}
  onClick={() => {
    handleQuizClick(quiz.id);
    setClickedId(quiz.id);
    setTimeout(() => setClickedId(null), 1000);
  }}
  className={`w-48 h-44 shrink-0 snap-start bg-(--loom-cyan)/20 p-4 rounded-xl cursor-pointer relative transition-all duration-300 try-it-card flex flex-col ${
    isActive || isClicked ? 'snake-active' : ''
  }`}
>
  {/* Верхняя строка: иконка + уровень */}
  <div className="flex items-center justify-between mb-1.5">
    <div className="flex items-center gap-2">
      {quiz.category?.iconUrl ? (
        <img src={quiz.category.iconUrl} alt="" className="w-7 h-7 rounded-full object-contain" />
      ) : (
        <div className="w-7 h-7 rounded-full bg-(--loom-cyan)/20 flex items-center justify-center text-(--loom-cyan) text-[12px] font-bold">
          {quiz.category?.name?.[0] || '?'}
        </div>
      )}
    </div>
    {quiz.level && (
      <span
        className={cn(
          'text-xs font-semibold',
          quiz.level === 'JUNIOR' && 'text-(--loom-cyan)',
          quiz.level === 'MIDDLE' && 'text-(--loom-yellow)',
          quiz.level === 'SENIOR' && 'text-(--glitch-pink)'
        )}
      >
        {quiz.level.charAt(0) + quiz.level.slice(1).toLowerCase()}
      </span>
    )}
  </div>

  {/* Название */}
  <h3 className="font-bold text-lg text-(--loom-white) truncate leading-tight mt-1">{quiz.title}</h3>

  {/* Описание (заполняет низ) */}
  <p className="flex-1 text-sm text-(--loom-white)/60 mt-1">{quiz.description}</p>
</div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Категории */}
      <div className="px-4 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Категории</h2>
          {categories && categories.length > 4 && (
            <Link href="/catalog" className="text-sm text-(--loom-yellow)">Все категории →</Link>
          )}
        </div>

        {isCategoriesLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-(--loom-white)/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : categories && categories.length > 0 ? (
          <div className="space-y-3">
            {categories.slice(0, 4).map((cat: any) => (
              <div
                key={cat.id}
                onClick={() => router.push(`/catalog?category=${cat.id}`)}
                className="bg-(--loom-white)/5 rounded-2xl p-5 cursor-pointer flex justify-between items-center relative glitch-border hover:bg-(--loom-white)/10 transition-colors"
              >
                <div>
                  <h3 className="font-bold text-lg text-(--loom-magenta)">{cat.name}</h3>
                  <p className="text-sm text-(--loom-white)/60">
                    {cat._count?.quizzes || 0} {pluralize(cat._count?.quizzes || 0, 'квиз', 'квиза', 'квизов')}
                  </p>
                </div>
                <div>
                  {cat.iconUrl ? (
                    <img src={cat.iconUrl} alt={cat.name} className="w-10 h-10 rounded-lg object-contain" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-(--loom-cyan)/20 flex items-center justify-center text-(--loom-cyan) font-bold text-lg">
                      {cat.name[0]}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Нет доступных категорий"
            description="Создайте первую категорию в админке."
          />
        )}
      </div>

      {/* Модалка */}
      <Modal
        isOpen={!!pendingQuizId}
        onClose={() => setPendingQuizId(null)}
        onCancel={handleStartNew}
        title="Незавершённый квиз"
        cancelText={isSameQuiz ? 'Начать заново' : 'Начать новый квиз'}
        confirmText={isSameQuiz ? 'Продолжить' : 'Продолжить'}
        onConfirm={handleContinue}
      >
        <p>
          У вас есть незавершённый квиз <span className="text-(--loom-cyan)">«{currentQuiz?.title}»</span>.
        </p>
        <p className="text-sm mt-2 text-(--loom-white)/50">
          {isSameQuiz
            ? 'Продолжить с последнего вопроса или начать заново?'
            : 'Начать новый квиз или вернуться к незавершённому?'}
        </p>
      </Modal>
    </div>
  );
}