import React, {useState} from 'react';
import Breadcrumbs from "../../../common/Breadcrumbs.tsx";
import {FaStar, FaHeart, FaExchangeAlt, FaFacebookF, FaTwitter, FaPinterest} from 'react-icons/fa';
import {FiCopy} from 'react-icons/fi';
import {IoChevronBack, IoChevronForward} from 'react-icons/io5';
import {HiMinus, HiPlus} from 'react-icons/hi';
import {BsCart2} from 'react-icons/bs';
import {useParams} from "react-router-dom";

const ProductDetails = () => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(0);
    const params = useParams();
    console.log(params.productId);

    const images = [
        '/imac.png',
        '/imac.png',
        '/imac.png',
        '/imac.png',
        '/imac.png',
        '/imac.png',
    ];

    const colors = ['#FFB800', '#E0E0E0'];

    return (
        <div className="min-h-screen">
            <Breadcrumbs/>
            <div className="container mx-auto px-4 py-4 md:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {/* Left - Image Gallery */}
                    <div className="w-full">
                        {/* Main Image */}
                        <div className="border border-gray-200 rounded-lg p-4 mb-4">
                            <img
                                src={images[selectedImage]}
                                alt="Product"
                                className="w-full h-[250px] sm:h-[350px] md:h-[400px] object-contain"
                            />
                        </div>

                        {/* Thumbnail Gallery */}
                        <div className="flex items-center gap-2">
                            <button
                                className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary-500 text-white flex items-center justify-center flex-shrink-0">
                                <IoChevronBack/>
                            </button>
                            <div className="flex gap-2 overflow-x-auto flex-1">
                                {images.map((img, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`w-14 h-14 md:w-20 md:h-20 border-2 rounded cursor-pointer p-1 flex-shrink-0 ${
                                            selectedImage === index ? 'border-primary-500' : 'border-gray-200'
                                        }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-contain"/>
                                    </div>
                                ))}
                            </div>
                            <button
                                className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary-500 text-white flex items-center justify-center flex-shrink-0">
                                <IoChevronForward/>
                            </button>
                        </div>
                    </div>

                    {/* Right - Product Info */}
                    <div className="w-full">
                        {/* Rating */}
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <div className="flex text-primary-500">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className="w-4 h-4"/>
                                ))}
                            </div>
                            <span className="font-semibold text-sm md:text-base">4.7 Star Rating</span>
                            <span className="text-gray-500 text-xs md:text-sm">(21,671 User feedback)</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-lg md:text-2xl font-semibold mb-4">
                            2020 Apple MacBook Pro with Apple M1 Chip (13-inch, 8GB RAM, 256GB SSD Storage) - Space Gray
                        </h1>

                        {/* SKU & Availability */}
                        <div className="flex flex-col sm:flex-row sm:justify-between text-sm mb-2 gap-1">
                            <span><span className="text-gray-500">Sku:</span> A264671</span>
                            <span><span className="text-gray-500">Availability:</span> <span className="text-green-500">In Stock</span></span>
                        </div>

                        {/* Brand & Category */}
                        <div className="flex flex-col sm:flex-row sm:justify-between text-sm mb-4 gap-1">
                            <span><span className="text-gray-500">Brand:</span> Apple</span>
                            <span><span className="text-gray-500">Category:</span> Electronics Devices</span>
                        </div>

                        {/* Price */}
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-6">
                            <span className="text-xl md:text-2xl font-semibold text-primary-500">$1699</span>
                            <span className="text-gray-400 line-through text-sm md:text-base">$1999.00</span>
                            <span
                                className="bg-yellow-400 text-white px-2 py-1 text-xs md:text-sm rounded">21% OFF</span>
                        </div>

                        <hr className="mb-6"/>

                        {/* Color & Size */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-sm text-gray-500 mb-2 block">Color</label>
                                <div className="flex gap-2">
                                    {colors.map((color, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedColor(index)}
                                            className={`w-8 h-8 rounded-full border-2 ${
                                                selectedColor === index ? 'border-primary-500' : 'border-gray-300'
                                            }`}
                                            style={{backgroundColor: color}}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500 mb-2 block">Size</label>
                                <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                                    <option>14-inch Liquid Retina XDR display</option>
                                </select>
                            </div>
                        </div>

                        {/* Memory & Storage */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="text-sm text-gray-500 mb-2 block">Memory</label>
                                <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                                    <option>16GB unified memory</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500 mb-2 block">Storage</label>
                                <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                                    <option>1TV SSD Storage</option>
                                </select>
                            </div>
                        </div>

                        {/* Quantity & Buttons */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
                            <div className="flex items-center border border-gray-300 rounded self-start">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-3 py-2 text-gray-500 hover:bg-gray-100"
                                >
                                    <HiMinus/>
                                </button>
                                <span className="px-4 py-2 border-x">{String(quantity).padStart(2, '0')}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-3 py-2 text-gray-500 hover:bg-gray-100"
                                >
                                    <HiPlus/>
                                </button>
                            </div>
                            <div className="flex flex-1 gap-3">
                                <button
                                    className="flex-1 bg-primary-500 text-white py-3 rounded flex items-center justify-center gap-2 hover:bg-primary-600 text-sm md:text-base">
                                    ADD TO CART <BsCart2/>
                                </button>
                                <button
                                    className="border-2 border-primary-500 text-primary-500 px-4 md:px-6 py-3 rounded hover:bg-primary-50 text-sm md:text-base whitespace-nowrap">
                                    BUY NOW
                                </button>
                            </div>
                        </div>

                        {/* Wishlist & Compare */}
                        <div
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                            <div className="flex flex-wrap gap-4 md:gap-6">
                                <button
                                    className="flex items-center gap-2 text-gray-600 hover:text-primary-500 text-sm">
                                    <FaHeart/> Add to Wishlist
                                </button>
                                <button
                                    className="flex items-center gap-2 text-gray-600 hover:text-primary-500 text-sm">
                                    <FaExchangeAlt/> Add to Compare
                                </button>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-gray-500 text-sm">Share:</span>
                                <FiCopy className="cursor-pointer hover:text-primary-500 w-4 h-4"/>
                                <FaFacebookF className="cursor-pointer hover:text-primary-500 w-4 h-4"/>
                                <FaTwitter className="cursor-pointer hover:text-primary-500 w-4 h-4"/>
                                <FaPinterest className="cursor-pointer hover:text-primary-500 w-4 h-4"/>
                            </div>
                        </div>
                        {/* Safe Checkout */}
                        <div className="border border-gray-200 rounded p-4">
                            <p className="font-semibold mb-3 text-sm md:text-base">100% Guarantee Safe Checkout</p>
                            <div className="flex items-center gap-3 flex-wrap">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                                     alt="Visa" className="w-10 object-contain"/>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                                     alt="Mastercard"
                                     className="w-10 object-contain"/>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal"
                                     className="w-10 object-contain"/>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ProductDetails);
