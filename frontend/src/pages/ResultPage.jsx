import { useLocation } from "react-router-dom";

const ResultPage = () => {
  const { state } = useLocation();
  const { predictedRating } = state || {};

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Player Rating Prediction
      </h1>
      {predictedRating ? (
        <div className="text-center">
          <h2 className="text-xl font-semibold">
            Predicted Rating: {predictedRating}
          </h2>
        </div>
      ) : (
        <p className="text-center text-gray-600">No rating available.</p>
      )}
    </div>
  );
};

export default ResultPage;
