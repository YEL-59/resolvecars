export default function CarGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
        >
          {/* Image Skeleton */}
          <div className="relative h-48 bg-gray-200">
            <div className="absolute top-4 left-4">
              <div className="h-6 w-20 bg-gray-300 rounded"></div>
            </div>
          </div>

          <div className="p-4">
            {/* Title and Price Skeleton */}
            <div className="flex justify-between items-start mb-2">
              <div className="h-6 w-32 bg-gray-200 rounded"></div>
              <div className="text-right">
                <div className="h-8 w-24 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Rating Skeleton */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 w-4 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
            </div>

            {/* Specs Skeleton */}
            <div className="grid grid-cols-2 gap-2 text-sm mb-4">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>

            {/* Button Skeleton */}
            <div className="h-10 w-full bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

