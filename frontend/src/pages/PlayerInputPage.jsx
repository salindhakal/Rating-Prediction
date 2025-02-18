import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinners from "../components/Spinners";

const PlayerInputPage = ({ predictPlayerRating }) => {
  const navigate = useNavigate();

  const initialFeatures = {
    name: "Player Name",
    crossing: 50,
    finishing: 50,
    heading_accuracy: 50,
    short_passing: 50,
    volleys: 50,
    dribbling: 50,
    curve: 50,
    fk_accuracy: 50,
    long_passing: 50,
    ball_control: 50,
    reactions: 50,
    jumping: 50,
    stamina: 50,
    strength: 50,
    positioning: 50,
    vision: 50,
    composure: 50,
    interceptions: 50,
    defensive_awareness: 50,
  };

  const [features, setFeatures] = useState(initialFeatures);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      // If the field is 'name', treat the value as a string
      setFeatures({ ...features, [name]: value });
    } else {
      // For other fields, parse the value as an integer
      setFeatures({ ...features, [name]: parseInt(value, 10) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const playerData = { ...features, name: features.name };
      const { rating, attributes } = await predictPlayerRating(playerData);
      navigate("/result", {
        state: { predictedRating: rating, attributes },
      });
    } catch (error) {
      console.error("Error predicting player rating", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Predict Football Player Rating
      </h1>
      {loading ? (
        <Spinners loading={loading} />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-5 max-w-3xl mx-auto w-full"
        >
          {/* Player Name Input */}
          <div className="grid grid-cols-4 gap-4 items-center">
            <label
              htmlFor="name"
              className="text-gray-700 font-medium capitalize text-right"
            >
              Player Name
            </label>
            <div className="col-span-3">
              <input
                type="text"
                id="name"
                name="name"
                value={features.name}
                onChange={handleChange}
                className="input w-full"
                placeholder="Enter player name"
              />
            </div>
          </div>

          {/* Player Attributes */}
          {Object.keys(features).map((feature) => {
            if (feature !== "name") {
              return (
                <div
                  key={feature}
                  className="grid grid-cols-4 gap-4 items-center"
                >
                  <label
                    htmlFor={feature}
                    className="text-gray-700 font-medium capitalize text-right"
                  >
                    {feature.replace("_", " ")}
                  </label>
                  <div className="relative col-span-3">
                    <input
                      type="range"
                      id={feature}
                      name={feature}
                      min="0"
                      max="100"
                      value={features[feature]}
                      onChange={handleChange}
                      className="slider w-full"
                    />

                    <span className="absolute -top-4 right-0 text-gray-600 text-sm font-semibold">
                      {features[feature]}
                    </span>
                  </div>
                </div>
              );
            }
            return null;
          })}

          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg w-full"
          >
            Predict Rating
          </button>
        </form>
      )}
    </div>
  );
};

export default PlayerInputPage;
