import PropTypes from 'prop-types';

export default function SizeChart({ category, onClose }) {
  const sizeCharts = {
    women: {
      headers: ['US Size', 'Bust', 'Waist', 'Hips'],
      sizes: [
        ['XS', '32"', '24"', '34"'],
        ['S', '34"', '26"', '36"'],
        ['M', '36"', '28"', '38"'],
        ['L', '38"', '30"', '40"'],
        ['XL', '40"', '32"', '42"'],
      ],
    },
    men: {
      headers: ['Size', 'Chest', 'Waist', 'Hips'],
      sizes: [
        ['S', '36-38"', '30-32"', '36-38"'],
        ['M', '38-40"', '32-34"', '38-40"'],
        ['L', '40-42"', '34-36"', '40-42"'],
        ['XL', '42-44"', '36-38"', '42-44"'],
        ['XXL', '44-46"', '38-40"', '44-46"'],
      ],
    },
  };

  const chart = sizeCharts[category] || sizeCharts.women;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium">Size Guide</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {chart.headers.map((header) => (
                  <th key={header} className="text-left py-2 px-4 bg-gray-50">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chart.sizes.map((size, index) => (
                <tr key={index} className="border-t">
                  {size.map((value, i) => (
                    <td key={i} className="py-2 px-4">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 text-sm text-gray-500">
          <p>Measurements are provided in inches. For the best fit, measure yourself and compare with the size chart above.</p>
        </div>
      </div>
    </div>
  );
}

SizeChart.propTypes = {
  category: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};