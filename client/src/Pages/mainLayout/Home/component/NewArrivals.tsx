import Container from "../../../../common/Container";
import PrimaryButton from "../../../../common/PrimaryButton";
import Icons from "../../../../helpers/IconProvider";
import assets from "../../../../helpers/assetsProvider";
function NewArrivals() {
  return (
    <div className="mt-10 mb-10 lg:mt-20 lg:mb-20 font-public-sans text-gray-900">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex justify-between items-center lg:gap-x-10 bg-gray-50 px-5 lg:px-10 py-10 lg:py-0 lg:h-96 cursor-pointer">
            <div className="flex flex-col justify-center h-full py-10 lg:py-0 lg:h-full items-start space-y-4">
              <p className="text-gray-00 text-body-small-600 bg-secondary-500 px-3 py-2 ">
                INTRODUCING
              </p>
              <h3 className="heading1">New Apple Homepod Mini</h3>
              <p className="body-medium-400 text-gray-700">
                Jam-packed with innovation, HomePod mini delivers unexpectedly.
              </p>
              <div className="inline-block transition-transform duration-200 hover:scale-105">
                <PrimaryButton
                  className={
                    "body-medium-600 py-2 sm:py-3 text-gray-00 bg-primary-500 px-5 sm:px-4" +
                    " rounded-xs lg:px-8" +
                    " flex items-center gap-2"
                  }
                  aria-label="Shop now">
                  <span>Shop Now</span>
                  <span>{Icons.rightArrow}</span>
                </PrimaryButton>
              </div>
            </div>
            <div>
              <img
                src={assets.speaker}
                alt="Speaker.png"
                className="hover:scale-105 duration-500 transition-all"
              />
            </div>
            ·
          </div>
          <div className="flex justify-between items-center lg:gap-x-10 bg-gray-900 px-5 lg:px-10 py-10 lg:py-0 lg:h-96 cursor-pointer">
            <div className="flex flex-col justify-center h-full py-10 lg:py-0 lg:h-full items-start space-y-4">
              <p className="text-body-small-600 bg-warning-400 px-3 py-2 ">
                INTRODUCING NEW
              </p>
              <h3 className="heading1 text-gray-00">
                Xiaomi Mi 11 Ultra 12GB+256GB
              </h3>
              <p className="body-medium-400 text-gray-300">
                *Data provided by internal laboratories. Industry measurement.
              </p>
              <div className="inline-block transition-transform duration-200 hover:scale-105">
                <PrimaryButton
                  className={
                    "body-medium-600 py-2 sm:py-3 text-gray-00 bg-primary-500 px-5 sm:px-4" +
                    " rounded-xs lg:px-8" +
                    " flex items-center gap-2"
                  }
                  aria-label="Shop now">
                  <span>Shop Now</span>
                  <span>{Icons.rightArrow}</span>
                </PrimaryButton>
              </div>
            </div>
            <div className="relative">
              <img
                src={assets.phone}
                alt="Phone.png"
                className="hover:scale-105 duration-500 transition-all"
              />
              <p className="text-gray-00 body-xl-600 w-20 h-20 rounded-full bg-secondary-500 flex justify-center items-center absolute right-0 top-0">
                $590
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default NewArrivals;
