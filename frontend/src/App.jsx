import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import Rating from "./pages/Rating";
import Custom from "./pages/Custom";

const App = () => {
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
          path: "rating",
          element: <Rating />,
        },
        {
          path: "custom",
          element: <Custom />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
