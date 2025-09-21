import HeroBanner from "./component/HeroBanner.tsx";
import Features from "./component/Features.tsx";
import CategoryShop from "./component/CategoryShop.tsx";

const Home = () => {
    return (
        <div>
            <div className={"mt-5 md:mt-10"}>
                <HeroBanner/>
                <Features/>
                <CategoryShop/>
            </div>
        </div>
    );
};

export default Home;