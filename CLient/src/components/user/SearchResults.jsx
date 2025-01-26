import { Link } from 'react-router-dom';
import { useSearchStore } from '../../store/useSearchStore';

export default function SearchResults() {
  const { searchResults, isSearching, clearSearch } = useSearchStore();

  if (!isSearching) return null;

  return (
    <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg max-h-[70vh] overflow-y-auto">
      <div className="max-w-3xl mx-auto p-4">
        {searchResults.length > 0 ? (
          <div className="space-y-4">
            {searchResults.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                onClick={clearSearch}
                className="flex items-center gap-4 p-2 hover:bg-gray-50"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-16 h-20 object-cover"
                />
                <div>
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500 capitalize">
                    {product.category}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}