import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import Custom from "./pages/Custom";
import PlayerInputPage from "./pages/PlayerInputPage";
import ResultPage from "./pages/ResultPage";

const App = () => {
  // Function to send prediction request
  const predictPlayerRating = async (features) => {
    const res = await fetch("/api/predict", {
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
          path: "playerrating",
          element: (
            <PlayerInputPage predictPlayerRating={predictPlayerRating} />
          ),
        },
        {
          path: "custom",
          element: <Custom />,
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
