import React from "react";
import {FaXTwitter,FaArrowRightLong, FaMagnifyingGlass} from "react-icons/fa6";
import {FaFacebook, FaPinterestP, FaRedditAlien, FaYoutube, FaInstagram, FaCartArrowDown, FaHeart, FaUser} from "react-icons/fa";

type Icons = {
    [key: string]: React.ReactNode
}
const Icons : Icons = {
    "twitter":<FaXTwitter/>,
    "facebook":<FaFacebook/>,
    "pinterest":<FaPinterestP/>,
    "reddit":<FaRedditAlien/>,
    "youtube":<FaYoutube/>,
    "instagram":<FaInstagram/>,
    "cart":<FaCartArrowDown/>,
    "heart":<FaHeart/>,
    "user":<FaUser/>,
    "rightArrow":<FaArrowRightLong/>,
    "search":<FaMagnifyingGlass/>
}
export default Icons