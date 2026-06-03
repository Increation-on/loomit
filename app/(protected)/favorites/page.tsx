import { getServerSession } from 'next-auth';
import { authOptions } from 'app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Избранное</h1>
      <div className="text-loom-white/60">
        Здесь будут ваши сохранённые квизы.
      </div>
    </div>
  );
}