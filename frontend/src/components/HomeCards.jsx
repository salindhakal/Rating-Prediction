import Card from "./Card";
import { Link } from "react-router-dom";

const HomeCards = () => {
  return (
    <section className="py-4">
      <div className="container-xl lg:container m-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
          <Card>
            <h2 className="text-2xl font-bold">Rating Prediction</h2>
            <p className="mt-2 mb-4">Prediction at your finger tip</p>
            <Link
              to="/playerrating"
              className="inline-block bg-black text-white rounded-lg px-4 py-2 hover:bg-gray-700"
            >
              View Ratings
            </Link>
          </Card>
          <Card bg="bg-indigo-100">
            <h2 className="text-2xl font-bold">Custom</h2>
            <p className="mt-2 mb-4">Generate your own player</p>
            <Link
              to="/custom"
              className="inline-block bg-indigo-500 text-white rounded-lg px-4 py-2 hover:bg-indigo-600"
            >
              Custom player
            </Link>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HomeCards;
