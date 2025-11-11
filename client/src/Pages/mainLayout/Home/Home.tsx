import Newsletter from "../../../common/NewsLetter.tsx";
import AllProduct from "./component/AllProduct.tsx";
import CategoryShop from "./component/CategoryShop.tsx";
import FeaturedProduct from "./component/FeaturedProduct.tsx";
import Features from "./component/Features.tsx";
import HeroBanner from "./component/HeroBanner.tsx";
import NewArrivals from "./component/NewArrivals.tsx";

const Home = () => {
  return (
    <div>
      <div className={"mt-5 md:mt-10"}>
        <HeroBanner />
        <Features />
        <CategoryShop />
        <FeaturedProduct />
        <NewArrivals />
        <AllProduct />
        <Newsletter />
      </div>
    </div>
  );
};

export default Home;
