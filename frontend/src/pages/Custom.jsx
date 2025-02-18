import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinners from "../components/Spinners";

const Custom = ({ predictPlayerRatingByName }) => {
  const [playerName, setPlayerName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { rating, attributes } = await predictPlayerRatingByName(
        playerName
      );
      navigate("/result", {
        state: { predictedRating: rating, player_name: playerName, attributes },
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail ||
        "The Player's Stats is not in the Database!!";
      navigate("/result", { state: { error: errorMessage } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Search Player Rating by Name
      </h1>
      {loading ? (
        <Spinners loading={loading} />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-5 max-w-md mx-auto w-full"
        >
          <div>
            <label
              htmlFor="playerName"
              className="block text-gray-700 font-medium mb-2"
            >
              Player Name
            </label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Enter player name"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg w-full"
          >
            Search Rating
          </button>
        </form>
      )}
    </div>
  );
};

export default Custom;
