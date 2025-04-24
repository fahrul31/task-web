

export default function Pagination({ pagination, onPageChange }) {
    const { count, currentPage, nextPage, previousPage } = pagination

    if (count <= 10) {
        return null;
    }

    return (
        <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
                Menampilkan data <span id="current-page">{currentPage}</span> dari <span id="total-pages">{Math.ceil(count / 10)}</span>
            </div>

            <div className="flex items-center gap-2">
                <button id="previous-btn" className="px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => previousPage && onPageChange(previousPage)} disabled={!previousPage}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 inline-block" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                </button>

                <button id="next-btn" className="px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => nextPage && onPageChange(nextPage)} disabled={!nextPage}>
                    Next
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 inline-block" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 19l7-7-7-7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}