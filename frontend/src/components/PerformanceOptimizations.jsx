import { memo, Suspense } from "react";

// 🧠 MEMOIZATION: Loading skeleton for authentication forms
const AuthFormSkeleton = memo(() => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    {/* Navbar skeleton */}
    <div className="w-full bg-white shadow h-16 flex items-center justify-between px-6">
      <div className="w-32 h-6 bg-gray-200 rounded skeleton"></div>
      <div className="flex gap-3">
        <div className="w-16 h-8 bg-gray-200 rounded skeleton"></div>
        <div className="w-20 h-8 bg-gray-200 rounded skeleton"></div>
      </div>
    </div>

    {/* Form skeleton */}
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        {/* Title skeleton */}
        <div className="w-48 h-6 bg-gray-200 rounded skeleton mx-auto mb-6"></div>

        {/* Form fields skeleton */}
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i}>
              <div className="w-24 h-4 bg-gray-200 rounded skeleton mb-1"></div>
              <div className="w-full h-10 bg-gray-200 rounded skeleton"></div>
            </div>
          ))}

          {/* Button skeleton */}
          <div className="w-full h-10 bg-gray-200 rounded skeleton mt-6"></div>
        </div>
      </div>
    </main>

    {/* Footer skeleton */}
    <div className="w-full h-16 bg-gray-100 flex items-center justify-center">
      <div className="w-64 h-4 bg-gray-200 rounded skeleton"></div>
    </div>
  </div>
));

// 🧠 MEMOIZATION: High-order component for auth pages optimization
const withAuthOptimization = (WrappedComponent) => {
  const OptimizedAuthComponent = memo((props) => (
    <Suspense fallback={<AuthFormSkeleton />}>
      <WrappedComponent {...props} />
    </Suspense>
  ));

  OptimizedAuthComponent.displayName = `withAuthOptimization(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return OptimizedAuthComponent;
};

// 🧠 MEMOIZATION: Performance optimized loading component
const PerformantLoader = memo(({ message = "Loading...", size = "large" }) => {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-16 h-16",
  };

  return (
    <div className="flex items-center justify-center py-8">
      <div className="relative">
        {/* 🚀 HARDWARE ACCELERATED: Optimized spinner animations */}
        <div
          className={`${sizeClasses[size]} border-4 border-blue-200 rounded-full animate-spin`}
        ></div>
        <div
          className={`absolute top-1 left-1 ${
            sizeClasses[size === "large" ? "medium" : "small"]
          } border-4 border-blue-600 border-t-transparent rounded-full animate-spin`}
          style={{ animationDirection: "reverse" }}
        ></div>
      </div>
      <div className="ml-4 text-blue-600 font-medium">{message}</div>
    </div>
  );
});

// 🧠 MEMOIZATION: Display names for debugging
AuthFormSkeleton.displayName = "AuthFormSkeleton";
PerformantLoader.displayName = "PerformantLoader";

export { withAuthOptimization, PerformantLoader, AuthFormSkeleton };
