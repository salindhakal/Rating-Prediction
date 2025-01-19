import { useLocation } from "react-router-dom";

const ResultPage = () => {
  const { state } = useLocation();
  const { predictedRating, player_name, error } = state || {};

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Player Rating Prediction
      </h1>
      {error ? (
        <div className="text-center">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      ) : predictedRating ? (
        <div className="text-center">
          {player_name ? (
            <h2 className="text-xl font-semibold">
              The rating for the player{" "}
              <span className="font-bold capitalize">{player_name}</span> is{" "}
              <span className="text-indigo-600">{predictedRating}</span>.
            </h2>
          ) : (
            <h2 className="text-xl font-semibold">
              Predicted Rating:{" "}
              <span className="text-indigo-600">{predictedRating}</span>
            </h2>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-600">No rating available.</p>
      )}
    </div>
  );
};

export default ResultPage;
