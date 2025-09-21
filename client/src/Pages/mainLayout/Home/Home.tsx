import HeroBanner from "./component/HeroBanner.tsx";
import Features from "./component/Features.tsx";

const Home = () => {
    return (
        <div>
            <div className={"mt-5 md:mt-10"}>
                <HeroBanner/>
                <Features/>
            </div>
        </div>
    );
};

export default Home;