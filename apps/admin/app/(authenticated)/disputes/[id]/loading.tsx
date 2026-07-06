export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 w-full h-full animate-pulse">
      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    </div>
  );
}
