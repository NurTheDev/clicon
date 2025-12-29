import React, { useState } from 'react';
import Breadcrumbs from "../../../common/Breadcrumbs.tsx";
import { FaStar, FaHeart, FaExchangeAlt, FaFacebookF, FaTwitter, FaPinterest } from 'react-icons/fa';
import { FiCopy } from 'react-icons/fi';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { HiMinus, HiPlus } from 'react-icons/hi';
import { BsCart2 } from 'react-icons/bs';

const ProductDetails = () => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(0);

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
        <div>
            <Breadcrumbs />
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left - Image Gallery */}
                    <div>
                        {/* Main Image */}
                        <div className="border border-gray-200 rounded-lg p-4 mb-4">
                            <img
                                src={images[selectedImage]}
                                alt="Product"
                                className="w-full h-[400px] object-contain"
                            />
                        </div>

                        {/* Thumbnail Gallery */}
                        <div className="flex items-center gap-2">
                            <button className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center">
                                <IoChevronBack />
                            </button>
                            <div className="flex gap-2 overflow-hidden">
                                {images.map((img, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`w-20 h-20 border-2 rounded cursor-pointer p-1 ${
                                            selectedImage === index ? 'border-primary-500' : 'border-gray-200'
                                        }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-contain" />
                                    </div>
                                ))}
                            </div>
                            <button className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center">
                                <IoChevronForward />
                            </button>
                        </div>
                    </div>

                    {/* Right - Product Info */}
                    <div>
                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} />
                                ))}
                            </div>
                            <span className="font-semibold">4.7 Star Rating</span>
                            <span className="text-gray-500">(21,671 User feedback)</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl font-semibold mb-4">
                            2020 Apple MacBook Pro with Apple M1 Chip (13-inch, 8GB RAM, 256GB SSD Storage) - Space Gray
                        </h1>

                        {/* SKU & Availability */}
                        <div className="flex justify-between text-sm mb-2">
                            <span><span className="text-gray-500">Sku:</span> A264671</span>
                            <span><span className="text-gray-500">Availability:</span> <span className="text-green-500">In Stock</span></span>
                        </div>

                        {/* Brand & Category */}
                        <div className="flex justify-between text-sm mb-4">
                            <span><span className="text-gray-500">Brand:</span> Apple</span>
                            <span><span className="text-gray-500">Category:</span> Electronics Devices</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-2xl font-semibold text-primary-500">$1699</span>
                            <span className="text-gray-400 line-through">$1999.00</span>
                            <span className="bg-yellow-400 text-white px-2 py-1 text-sm rounded">21% OFF</span>
                        </div>

                        <hr className="mb-6" />

                        {/* Color & Size */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
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
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500 mb-2 block">Size</label>
                                <select className="w-full border border-gray-300 rounded px-3 py-2">
                                    <option>14-inch Liquid Retina XDR display</option>
                                </select>
                            </div>
                        </div>

                        {/* Memory & Storage */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="text-sm text-gray-500 mb-2 block">Memory</label>
                                <select className="w-full border border-gray-300 rounded px-3 py-2">
                                    <option>16GB unified memory</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500 mb-2 block">Storage</label>
                                <select className="w-full border border-gray-300 rounded px-3 py-2">
                                    <option>1TV SSD Storage</option>
                                </select>
                            </div>
                        </div>

                        {/* Quantity & Buttons */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center border border-gray-300 rounded">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-3 py-2 text-gray-500 hover:bg-gray-100"
                                >
                                    <HiMinus />
                                </button>
                                <span className="px-4 py-2 border-x">{String(quantity).padStart(2, '0')}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-3 py-2 text-gray-500 hover:bg-gray-100"
                                >
                                    <HiPlus />
                                </button>
                            </div>
                            <button className="flex-1 bg-primary-500 text-white py-3 rounded flex items-center justify-center gap-2 hover:bg-primary-600">
                                ADD TO CARD <BsCart2 />
                            </button>
                            <button className="border-2 border-primary-500 text-primary-500 px-6 py-3 rounded hover:bg-primary-50">
                                BUY NOW
                            </button>
                        </div>

                        {/* Wishlist & Compare */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex gap-6">
                                <button className="flex items-center gap-2 text-gray-600 hover:text-primary-500">
                                    <FaHeart /> Add to Wishlist
                                </button>
                                <button className="flex items-center gap-2 text-gray-600 hover:text-primary-500">
                                    <FaExchangeAlt /> Add to Compare
                                </button>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-gray-500">Share product:</span>
                                <FiCopy className="cursor-pointer hover:text-primary-500" />
                                <FaFacebookF className="cursor-pointer hover:text-primary-500" />
                                <FaTwitter className="cursor-pointer hover:text-primary-500" />
                                <FaPinterest className="cursor-pointer hover:text-primary-500" />
                            </div>
                        </div>

                        {/* Safe Checkout */}
                        <div className="border border-gray-200 rounded p-4">
                            <p className="font-semibold mb-3">100% Guarantee Safe Checkout</p>
                            <div className="flex gap-2">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ProductDetails);
