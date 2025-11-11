

const PostCardSkeleton = () => {
  return (
    <div className="animate-pulse bg-white rounded-lg overflow-hidden shadow mb-4">
      {/* Header */}
      <div className="flex items-center p-4 space-x-3">
        <div className="h-10 w-10 rounded-full bg-gray-300"></div>
        <div className="h-4 w-32 bg-gray-300 rounded"></div>
      </div>

      {/* Media */}
      <div className="h-64 bg-gray-300"></div>

      {/* Actions */}
      <div className="flex items-center justify-between p-4">
        <div className="flex space-x-3">
          <div className="h-6 w-6 bg-gray-300 rounded"></div>
          <div className="h-6 w-6 bg-gray-300 rounded"></div>
        </div>
        <div className="h-4 w-12 bg-gray-300 rounded"></div>
      </div>

      {/* Caption */}
      <div className="px-4 pb-4">
        <div className="h-3 w-3/4 bg-gray-300 rounded mb-2"></div>
        <div className="h-3 w-1/2 bg-gray-300 rounded"></div>
      </div>
    </div>
  )
}

export default PostCardSkeleton
