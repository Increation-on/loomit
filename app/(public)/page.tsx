import { ResumeQuizButton } from '@/components/features/ResumeQuizButton';

export default function HomePage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Главная</h1>
      <ResumeQuizButton />
    </div>
  );
}