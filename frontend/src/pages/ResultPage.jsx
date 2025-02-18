import { useLocation } from "react-router-dom";

const ResultPage = () => {
  const { state } = useLocation();
  const { predictedRating, player_name, attributes, error } = state || {};

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
        <div className="space-y-6">
          {/* Display player name and rating */}
          {player_name && (
            <div className="text-center">
              <h2 className="text-xl font-semibold">
                The rating for the player{" "}
                <span className="font-bold capitalize">{player_name}</span> is{" "}
                <span className="text-indigo-600">{predictedRating}</span>.
              </h2>
            </div>
          )}

          {/* rating is based on features,  just the rating */}
          {!player_name && (
            <div className="text-center">
              <h2 className="text-xl font-semibold">
                Predicted Rating:{" "}
                <span className="text-indigo-600">{predictedRating}</span>
              </h2>
            </div>
          )}

          {/*  attributes */}
          {attributes && Object.keys(attributes).length > 0 && (
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Player Attributes
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(attributes).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b py-2">
                    <span className="font-medium text-gray-700 capitalize">
                      {key.replace(/_/g, " ")}
                    </span>
                    <span className="text-indigo-600">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-600">No rating available.</p>
      )}
    </div>
  );
};

export default ResultPage;
