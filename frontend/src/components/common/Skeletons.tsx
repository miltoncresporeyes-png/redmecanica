import React from 'react';

// Skeleton line/shimmer effect
export const SkeletonLine: React.FC<{ width?: string; height?: string; className?: string }> = ({ 
  width = '100%', 
  height = '1rem',
  className = ''
}) => (
  <div 
    className={`bg-gray-200 rounded animate-pulse ${className}`}
    style={{ width, height }}
  />
);

// Card skeleton
export const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
    <div className="flex items-start space-x-4">
      <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
      <div className="flex-1 space-y-2">
        <SkeletonLine width="60%" height="1.25rem" />
        <SkeletonLine width="40%" height="0.875rem" />
      </div>
    </div>
    <div className="mt-4 space-y-2">
      <SkeletonLine width="100%" height="0.75rem" />
      <SkeletonLine width="80%" height="0.75rem" />
    </div>
  </div>
);

// List skeleton with multiple items
export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

// Hero section skeleton
export const HeroSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="h-64 md:h-96 bg-gray-200 rounded-2xl mb-8" />
    <div className="max-w-2xl mx-auto space-y-4">
      <SkeletonLine width="80%" height="2.5rem" className="mx-auto" />
      <SkeletonLine width="60%" height="1.5rem" className="mx-auto" />
      <div className="pt-4">
        <SkeletonLine width="40%" height="3rem" className="mx-auto rounded-full" />
      </div>
    </div>
  </div>
);

// Provider card skeleton
export const ProviderCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-14 h-14 bg-gray-200 rounded-full" />
        <div className="space-y-2">
          <SkeletonLine width="150px" height="1.25rem" />
          <SkeletonLine width="100px" height="0.875rem" />
        </div>
      </div>
      <div className="w-20 h-8 bg-gray-200 rounded" />
    </div>
    <div className="space-y-2 mb-4">
      <SkeletonLine width="100%" height="0.875rem" />
      <SkeletonLine width="90%" height="0.875rem" />
    </div>
    <div className="flex gap-2">
      <SkeletonLine width="80px" height="2rem" />
      <SkeletonLine width="80px" height="2rem" />
    </div>
  </div>
);

// Table skeleton
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => (
  <div className="animate-pulse">
    {/* Header */}
    <div className="flex gap-4 mb-4 pb-4 border-b">
      {Array.from({ length: columns }).map((_, i) => (
        <div key={i} className="flex-1 h-6 bg-gray-200 rounded" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIdx) => (
      <div key={rowIdx} className="flex gap-4 mb-3">
        {Array.from({ length: columns }).map((_, colIdx) => (
          <div key={colIdx} className="flex-1 h-4 bg-gray-200 rounded" />
        ))}
      </div>
    ))}
  </div>
);

// Form skeleton
export const FormSkeleton: React.FC<{ fields?: number }> = ({ fields = 4 }) => (
  <div className="space-y-6 animate-pulse">
    {Array.from({ length: fields }).map((_, i) => (
      <div key={i} className="space-y-2">
        <SkeletonLine width="30%" height="0.875rem" />
        <SkeletonLine width="100%" height="2.5rem" />
      </div>
    ))}
    <SkeletonLine width="100%" height="3rem" className="rounded-lg" />
  </div>
);

// Text content skeleton
export const TextSkeleton: React.FC<{ paragraphs?: number }> = ({ paragraphs = 3 }) => (
  <div className="space-y-4 animate-pulse">
    {Array.from({ length: paragraphs }).map((_, i) => (
      <div key={i} className="space-y-2">
        <SkeletonLine width="100%" />
        <SkeletonLine width="95%" />
        <SkeletonLine width="90%" />
      </div>
    ))}
  </div>
);
