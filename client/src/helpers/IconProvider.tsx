import React from "react";
import { BiHeadphone } from "react-icons/bi";
import { BsBoxSeam, BsCreditCard } from "react-icons/bs";
import {
  FaApple, FaArrowDown,
  FaCartArrowDown,
  FaFacebook,
  FaGooglePlay,
  FaHeadphones,
  FaHeart,
  FaInstagram,
  FaPinterestP,
  FaRedditAlien,
  FaRegStar,
  FaStar,
  FaUser,
  FaYoutube,
} from "react-icons/fa";
import {
  FaArrowRightLong,
  FaArrowsRotate,
  FaMagnifyingGlass,
  FaRegEye,
  FaXTwitter,
} from "react-icons/fa6";
import { IoMdHelp, IoMdSend } from "react-icons/io";
import { IoClose, IoTrophyOutline } from "react-icons/io5";
import { LuMenu } from "react-icons/lu";
import { MdWifiCalling3 } from "react-icons/md";
import { TfiLocationPin } from "react-icons/tfi";

type Icons = {
  [key: string]: React.ReactNode;
};
const Icons: Icons = {
  twitter: <FaXTwitter />,
  facebook: <FaFacebook />,
  pinterest: <FaPinterestP />,
  reddit: <FaRedditAlien />,
  youtube: <FaYoutube />,
  instagram: <FaInstagram />,
  cart: <FaCartArrowDown />,
  heart: <FaHeart />,
  user: <FaUser />,
  rightArrow: <FaArrowRightLong />,
  downArrow: <FaArrowDown />,
  search: <FaMagnifyingGlass />,
  menu: <LuMenu />,
  close: <IoClose />,
  location: <TfiLocationPin />,
  compare: <FaArrowsRotate />,
  support: <FaHeadphones />,
  help: <IoMdHelp />,
  phone: <MdWifiCalling3 />,
  box: <BsBoxSeam />,
  trophy: <IoTrophyOutline />,
  creditCard: <BsCreditCard />,
  headphones: <BiHeadphone />,
  starFilled: <FaStar />,
  starEmpty: <FaRegStar />,
  openEye: <FaRegEye />,
  send: <IoMdSend />,
  googlePlay: <FaGooglePlay />,
  apple: <FaApple />,
};
export default Icons;
