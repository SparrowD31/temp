import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Heart } from 'lucide-react';
import SizeChart from '../../components/user/SizeChart';
import { useCartStore } from '../../store/useCartStore';
import { useFavoriteStore } from '../../store/useFavoriteStore';
import { mockProducts } from '../../data/mockData';
import Loader from '../../components/loader/Loader';

export default function ProductDetail() {
  const { id } = useParams();
  const product = mockProducts.find((p) => p.id === id);
  const [selectedSize, setSelectedSize] = useState('');
  const [currentImage, setCurrentImage] = useState(0);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { toggleFavorite, isFavorite } = useFavoriteStore();
  const favorite = isFavorite(product?.id);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Your product fetching logic here
    try {
      // Fetch product details
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setIsLoading(false);
    }
  }, [id]);

  if (!product) {
    return <div className="pt-24 text-center">Product not found</div>;
  }

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addItem(product, selectedSize);
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="pt-16 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative">
            <img
              src={product.images[currentImage]}
              alt={product.name}
              className="w-full object-contain max-h-[80vh]"
            />
            <button
              onClick={() => toggleFavorite(product.id)}
              className="absolute top-4 right-4 p-3 rounded-full bg-white shadow-md hover:scale-110 transition-transform"
            >
              <Heart
                size={24}
                className={favorite ? 'fill-black stroke-black' : 'stroke-gray-600'}
              />
            </button>
            <div className="flex mt-4 gap-4 overflow-x-auto px-4 md:px-0">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`w-16 h-16 md:w-20 md:h-20 flex-shrink-0 ${
                    currentImage === index ? 'ring-2 ring-black' : ''
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="px-4 md:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-light mb-4">{product.name}</h1>
            <p className="text-xl mb-6">Rs:{product.price.toFixed(2)}</p>
            
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-medium">SIZE</h2>
                <button
                  onClick={() => setShowSizeChart(true)}
                  className="text-sm underline"
                >
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 text-sm border ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className="w-full bg-black text-white py-4 px-6 disabled:bg-gray-200 disabled:cursor-not-allowed"
            >
              ADD TO CART
            </button>

            <div className="mt-8 prose prose-sm">
              <h2 className="text-sm font-medium mb-4">DESCRIPTION</h2>
              <p className="text-gray-600">{product.description}</p>
            </div>
          </div>
        </div>

        {showSizeChart && (
          <SizeChart
            category={product.category}
            onClose={() => setShowSizeChart(false)}
          />
        )}
      </div>
    </>
  );
}