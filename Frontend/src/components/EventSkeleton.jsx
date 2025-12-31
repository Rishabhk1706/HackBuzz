const EventSkeleton = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow animate-pulse border">
      <div className="h-5 bg-gray-300 rounded w-3/4 mb-4"></div>

      <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>

      <div className="h-3 bg-gray-200 rounded w-1/2 mt-4"></div>
    </div>
  );
};

export default EventSkeleton;