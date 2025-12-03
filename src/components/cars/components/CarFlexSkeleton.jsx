export default function CarFlexSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
        >
          <div className="flex flex-col lg:flex-row">
            {/* Left Section - Car Details Skeleton */}
            <div className="lg:w-1/3 p-4 lg:p-6 border-r-0 lg:border-r border-gray-200 border-b lg:border-b-0 pb-4 lg:pb-6">
              {/* Car Name Skeleton */}
              <div className="h-7 w-48 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>

              {/* Price Badge Skeleton */}
              <div className="mb-3 p-2 bg-gray-100 rounded">
                <div className="h-4 w-20 bg-gray-200 rounded mb-1"></div>
                <div className="h-6 w-32 bg-gray-200 rounded"></div>
              </div>

              {/* Collection Info Skeleton */}
              <div className="flex items-center gap-2 mb-3">
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
                <div className="h-4 w-40 bg-gray-200 rounded"></div>
              </div>

              {/* Best Price Badge Skeleton */}
              <div className="mb-4">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
              </div>

              {/* Car Image Skeleton */}
              <div className="relative w-full h-48 mb-4 bg-gray-200 rounded-lg"></div>

              {/* Specifications Skeleton */}
              <div className="flex items-center gap-4 mb-3">
                <div className="h-5 w-5 bg-gray-200 rounded"></div>
                <div className="h-4 w-8 bg-gray-200 rounded"></div>
                <div className="h-5 w-5 bg-gray-200 rounded"></div>
                <div className="h-4 w-8 bg-gray-200 rounded"></div>
                <div className="h-5 w-5 bg-gray-200 rounded"></div>
                <div className="h-4 w-8 bg-gray-200 rounded"></div>
              </div>

              {/* Unlimited Mileage Skeleton */}
              <div className="mt-4">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Right Section - Pricing Plan Cards Skeleton */}
            <div className="lg:w-2/3 p-4 lg:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, planIndex) => (
                  <div
                    key={planIndex}
                    className="flex flex-col border border-gray-200 rounded-lg overflow-hidden shadow-sm min-w-[200px]"
                  >
                    {/* Header Skeleton */}
                    <div className="h-12 bg-gray-300"></div>

                    {/* Features Skeleton */}
                    <div className="flex-1 bg-white p-4 space-y-2">
                      {[...Array(4)].map((_, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-2">
                          <div className="h-4 w-4 bg-gray-200 rounded flex-shrink-0 mt-0.5"></div>
                          <div className="h-4 w-32 bg-gray-200 rounded"></div>
                        </div>
                      ))}
                    </div>

                    {/* Pricing Skeleton */}
                    <div className="bg-white p-4 border-t border-gray-100">
                      <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
                      <div className="h-6 w-24 bg-gray-200 rounded mb-1"></div>
                      <div className="h-4 w-28 bg-gray-200 rounded"></div>
                    </div>

                    {/* Button Skeleton */}
                    <div className="m-4 h-12 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


