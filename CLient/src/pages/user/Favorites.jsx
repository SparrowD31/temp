import { mockProducts } from '../../data/mockData';
import { useFavoriteStore } from '../../store/useFavoriteStore';
import ProductCard from '../../components/user/ProductCard';

export default function Favorites() {
  const favoriteIds = useFavoriteStore((state) => state.items);
  const favoriteProducts = mockProducts.filter((product) => 
    favoriteIds.includes(product.id)
  );

  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-light mb-8">MY FAVORITES</h1>
      
      {favoriteProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No favorite items yet.</p>
        </div>
      )}
    </div>
  );
}