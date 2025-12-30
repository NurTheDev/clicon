import React, { useState } from 'react';
import { FaShieldAlt, FaTruck, FaMoneyBillWave, FaHeadset, FaCreditCard } from 'react-icons/fa';


const ProductTabs: React.FC = ({ productDetails }:any) => {
    const [activeTab, setActiveTab] = useState('description');

    const tabs = [
        { id: 'description', label: 'DESCRIPTION' },
        { id: 'additional', label: 'ADDITIONAL INFORMATION' },
        { id: 'specification', label: 'SPECIFICATION' },
        { id: 'review', label: 'REVIEW' },
    ];

    const features = [
        { icon: <FaShieldAlt className="text-primary-500" />, text: 'Free 1 Year Warranty' },
        { icon: <FaTruck className="text-primary-500" />, text: 'Free Shipping & Fasted Delivery' },
        { icon: <FaMoneyBillWave className="text-primary-500" />, text: '100% Money-back guarantee' },
        { icon: <FaHeadset className="text-primary-500" />, text: '24/7 Customer support' },
        { icon: <FaCreditCard className="text-primary-500" />, text: 'Secure payment method' },
    ];

    const shippingInfo = [
        { label: 'Courier:', value: '2 - 4 days, free shipping' },
        { label: 'Local Shipping:', value: 'up to one week, $19.00' },
        { label: 'UPS Ground Shipping:', value: '4 - 6 days, $29.00' },
        { label: 'Unishop Global Export:', value: '3 - 4 days, $39.00' },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Tabs Header */}
            <div className="flex justify-center border-b border-gray-200">
                <div className="flex gap-4 md:gap-8 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-2 md:px-4 py-3 text-xs md:text-sm font-medium whitespace-nowrap transition-colors ${
                                activeTab === tab.id
                                    ? 'text-gray-900 border-b-2 border-primary-500'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="py-8">
                {activeTab === 'description' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Description */}
                        <div className="lg:col-span-1">
                            <h3 className="font-semibold text-lg mb-4">Description</h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                {productDetails?.description || `No description available`}
                            </p>
                        </div>

                        {/* Features */}
                        <div className="lg:col-span-1">
                            <h3 className="font-semibold text-lg mb-4">Feature</h3>
                            <div className="space-y-4">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <span className="text-lg">{feature.icon}</span>
                                        <span className="text-gray-700 text-sm">{feature.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Information */}
                        <div className="lg:col-span-1">
                            <h3 className="font-semibold text-lg mb-4">Shipping Information</h3>
                            <div className="space-y-3">
                                {shippingInfo.map((item, index) => (
                                    <div key={index} className="text-sm">
                                        <span className="font-medium text-gray-900">{item.label}</span>{' '}
                                        <span className="text-gray-600">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'additional' && (
                    <div className="text-gray-600">
                        <p>Additional information content goes here.</p>
                    </div>
                )}

                {activeTab === 'specification' && (
                    <div className="text-gray-600">
                        <p>Specification content goes here.</p>
                    </div>
                )}

                {activeTab === 'review' && (
                    <div className="text-gray-600">
                        <p>Review content goes here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default React.memo(ProductTabs);
