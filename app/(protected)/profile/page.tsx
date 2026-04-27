import { getServerSession } from "next-auth";
import { authOptions } from "app/api/auth/[...nextauth]/route";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const userName = session?.user?.name || "пользователь";
  const date = new Date().toLocaleDateString("ru-RU");

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-loom-white mb-4">
        Профиль
      </h1>
      <p className="text-loom-white/80">
        Привет, {userName}! Сегодня {date}.
      </p>
      <p className="text-loom-white/60 text-sm mt-4">
        Здесь позже будет статистика и настройки.
      </p>
    </div>
  );
}