import PropTypes from 'prop-types';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFavoriteStore } from '../../store/useFavoriteStore';

export default function ProductCard({ product }) {
  const { toggleFavorite, isFavorite } = useFavoriteStore();
  const favorite = isFavorite(product.id);

  return (
    <div className="group relative w-full">
      <Link to={`/user/product/${product.id}`}>
        <div className="aspect-square w-full overflow-hidden bg-gray-200">
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity"
          />
        </div>
        <div className="mt-4 space-y-1">
          <h3 className="text-sm text-gray-700">{product.name}</h3>
          <p className="text-sm text-gray-900">${product.price.toFixed(2)}</p>
        </div>
      </Link>
      <button
        onClick={() => toggleFavorite(product.id)}
        className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md hover:scale-110 transition-transform"
      >
        <Heart
          size={20}
          className={favorite ? 'fill-black stroke-black' : 'stroke-gray-600'}
        />
      </button>
    </div>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};