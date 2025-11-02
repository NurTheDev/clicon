import featureProductBg from "../../public/Image.jpg";
import blackLogo from "../assets/logo/Black-logo.png";
import cliconCircle from "../assets/logo/clicon-circle.svg";
import phone from "../assets/phone.png";
import speaker from "../assets/speaker.png";
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
export default assets;
