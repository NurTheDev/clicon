import React from "react";
import {FaXTwitter, FaArrowRightLong, FaMagnifyingGlass, FaArrowsRotate} from "react-icons/fa6";
import {
    FaFacebook,
    FaPinterestP,
    FaRedditAlien,
    FaYoutube,
    FaInstagram,
    FaCartArrowDown,
    FaHeart,
    FaUser, FaHeadphones, FaStar, FaRegStar
} from "react-icons/fa";
import {LuMenu} from "react-icons/lu";
import {IoClose, IoTrophyOutline} from "react-icons/io5";
import {TfiLocationPin} from "react-icons/tfi";
import {IoMdHelp} from "react-icons/io";
import {MdWifiCalling3} from "react-icons/md";
import {BsBoxSeam, BsCreditCard} from "react-icons/bs";
import {BiHeadphone} from "react-icons/bi";

type Icons = {
    [key: string]: React.ReactNode
}
const Icons: Icons = {
    "twitter": <FaXTwitter/>,
    "facebook": <FaFacebook/>,
    "pinterest": <FaPinterestP/>,
    "reddit": <FaRedditAlien/>,
    "youtube": <FaYoutube/>,
    "instagram": <FaInstagram/>,
    "cart": <FaCartArrowDown/>,
    "heart": <FaHeart/>,
    "user": <FaUser/>,
    "rightArrow": <FaArrowRightLong/>,
    "search": <FaMagnifyingGlass/>,
    "menu": <LuMenu/>,
    "close": <IoClose/>,
    "location": <TfiLocationPin />,
    "compare": <FaArrowsRotate />,
    "support": <FaHeadphones/>,
    "help": <IoMdHelp/>,
    "phone" : <MdWifiCalling3/>,
    "box": <BsBoxSeam />,
    "trophy": <IoTrophyOutline/>,
    "creditCard": <BsCreditCard/>,
    "headphones": <BiHeadphone/>,
    "starFilled": <FaStar/>,
    "starEmpty": <FaRegStar/>
}
export default Icons