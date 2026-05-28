export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
      <div className="text-5xl mb-4">📡</div>
      <h1 className="text-2xl font-bold text-loom-white mb-2">Вы оффлайн</h1>
      <p className="text-loom-white/60">Проверьте подключение к интернету</p>
    </div>
  );
}