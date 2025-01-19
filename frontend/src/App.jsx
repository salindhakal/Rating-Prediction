import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import Custom from "./pages/Custom";
import PlayerInputPage from "./pages/PlayerInputPage";
import ResultPage from "./pages/ResultPage";

const App = () => {
  // Function to send prediction request for features
  const predictPlayerRatingByFeatures = async (features) => {
    const res = await fetch("/api/predict/by-features", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(features),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch prediction");
    }

    const data = await res.json();
    return data.rating;
  };

  // Function to send prediction request by player name
  const predictPlayerRatingByName = async (playerName) => {
    const res = await fetch(
      `/api/predict/by-name/${encodeURIComponent(playerName)}`,
      {
        method: "GET",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch player rating");
    }

    const data = await res.json();
    return data.rating;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: "custom",
          element: (
            <PlayerInputPage
              predictPlayerRating={predictPlayerRatingByFeatures}
            />
          ),
        },
        {
          path: "playerrating",
          element: (
            <Custom predictPlayerRatingByName={predictPlayerRatingByName} />
          ),
        },
        {
          path: "result",
          element: <ResultPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
