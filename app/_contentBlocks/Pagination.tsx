import React from 'react'

type Props = {
    pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
        hasPreviousPage: boolean;
        startCursor: string | null;
    }
    fetchMore: (cursor: string) => void;
}

const Pagination = ({pageInfo}: Props) => {
    
    const fetchMore = (cursor: string) => {
        console.log(cursor)

        fetchMore(cursor)
    }

  return (
    <div className="flex justify-center mt-10">
      <button
        onClick={() => pageInfo.startCursor && fetchMore(pageInfo.startCursor)}
        disabled={!pageInfo.hasPreviousPage}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md cursor-pointer"
      >
        Previous
      </button>
      <button
        onClick={() => pageInfo.endCursor && fetchMore(pageInfo.endCursor)}
        disabled={!pageInfo.hasNextPage}
        className="px-3 py-2 ml-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md cursor-pointer"
      >
        Next
      </button>
    </div>
  )
}

export default Pagination