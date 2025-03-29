export default function LoadMoreButton({ isLoading, filteredList, visibleList, onLoadMore }) {
    if (isLoading || filteredList.length <= visibleList.length) return null;
  
    return (
      <div className="load-more-container">
        <button className="load-more-btn" onClick={onLoadMore}>
          Load More
        </button>
      </div>
    );
  }
  