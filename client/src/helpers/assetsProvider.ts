import featureProductBg from "../../public/Image.jpg";
import blackLogo from "../assets/logo/Black-logo.png";
import cliconCircle from "../assets/logo/clicon-circle.svg";
import phone from "../assets/phone.png";
import speaker from "../assets/speaker.png";
import Amazon from "./../assets/brands/Frame.svg";
import Google from "./../assets/brands/google.svg";
import Philips from "./../assets/brands/philips.svg";
import Samsung from "./../assets/brands/samsung.svg";
import Toshiba from "./../assets/brands/toshiba.svg";
type Assets = {
  blackLogo: string;
  cliconCircle: string;
  featureProductBg?: string;
  speaker?: string;
  phone?: string;
};
const assets: Assets = {
  blackLogo: blackLogo,
  cliconCircle: cliconCircle,
  featureProductBg: featureProductBg,
  speaker: speaker,
  phone: phone,
};
export const brands = [
  { name: "Google", logo: Google },
  { name: "Amazon", logo: Amazon },
  { name: "Philips", logo: Philips },
  { name: "Toshiba", logo: Toshiba },
  { name: "Samsung", logo: Samsung },
];
export default assets;
