const heroBannerInfo: {
    id: number;
    heading: string;
    title: string;
    description: string;
    price: string;
    image: string
    rating?: number;
    ratedBy?: number;
    category?: string;
    name?: string
}[] = [
    {
        id: 1,
        heading: "Pixel 5a",
        title: "THE BEST PLACE TO PLAY",
        description: "Save up to 50% on select Xbox games. Get 3 months of PC Game Pass for $2 USD.",
        price: "$299",
        image: "pixel5.png",
        rating: 4.5,
        ratedBy: 1200,
        category: "SmartPhone",
        name: "Google Pixel 5a"
    },
    {
        id: 2,
        heading: "PlayStation 5",
        title: "PLAY HAS NO LIMITS",
        description: "Exclusive hits and lightning-fast load times with PS5.",
        price: "$499",
        image: "ps5.png",
        rating: 4.8,
        ratedBy: 2500,
        category: "Gaming Console",
        name: "Sony PlayStation 5"
    },
    {
        id: 3,
        heading: "Nintendo Switch",
        title: "PLAY ANYWHERE",
        description: "Portable fun with a vibrant library of Nintendo classics.",
        price: "$349",
        image: "phone.png",
        rating: 4.6,
        ratedBy: 1800,
        category: "Gaming Console",
        name: "Nintendo Switch OLED Model"
    },
    {
        id: 4,
        heading: "TWS Earbuds",
        title: "BUILD YOUR RIG",
        description: "High-performance components and accessories for every budget.",
        price: "$99",
        image: "earbards.png",
        rating: 4.3,
        ratedBy: 900,
        category: "Accessories",
        name: "Soundcore by Anker Life P2"
    },
    {
        id: 5,
        heading: "Cameras & Photo",
        title: "STEP INTO NEW WORLDS",
        description: "Immersive experiences with next-gen tracking and optics.",
        price: "$299",
        image: "camera.png",
        rating: 4.7,
        ratedBy: 1100,
        category: "Camera & Photo",
        name: "GoPro HERO9 Black"
    },
    {
        id: 6,
        heading: "TV & Home",
        title: "POWER ON THE GO",
        description: "Thin, powerful laptops with high-refresh displays.",
        price: "$899",
        image: "tv.png",
        rating: 4.4,
        ratedBy: 1300,
        category: "TV & Home",
        name: "Samsung 55-inch QLED 4K Smart TV"
    },
    {
        id: 7,
        heading: "Accessories",
        title: "LEVEL UP YOUR SETUP",
        description: "Controllers, headsets, and gear for every platform.",
        price: "$29",
        image: "keyboard.png",
        rating: 4.2,
        ratedBy: 800,
        category: "Accessories",
        name: "Logitech G502 HERO"
    },
    {
        id: 8,
        heading: "AC Cooling",
        title: "STAY COOL UNDER PRESSURE",
        description: "High-performance cooling solutions for optimal comfort.",
        price: "$399",
        image: "ac.png",
        rating: 4.5,
        ratedBy: 950,
        category: "Home Appliances",
        name: "LG Dual Inverter AC"
    }, {
        id: 9,
        heading: "Drone Tech",
        title: "SOAR TO NEW HEIGHTS",
        description: "Capture stunning aerial footage with advanced drone technology.",
        price: "$599",
        image: "drone.png",
        rating: 4.6,
        ratedBy: 1150,
        category: "Drones",
        name: "DJI Mavic Air 2"
    }, {
        id: 10,
        heading: "Music Systems",
        title: "IMMERSIVE SOUND EXPERIENCE",
        description: "High-fidelity audio systems for music lovers.",
        price: "$199",
        image: "headphone2.png",
        rating: 4.4,
        ratedBy: 700,
        category: "Audio Equipment",
        name: "Bose SoundLink Revolve"
    }, {
        id: 11,
        heading: "Xiaomi 12",
        title: "EXPERIENCE INNOVATION",
        description: "Cutting-edge technology with sleek design and powerful performance.",
        price: "$749",
        image: "phone2.png",
        rating: 4.5,
        ratedBy: 1400,
        category: "SmartPhone",
        name: "Xiaomi 12 Pro"
    }, {
        id: 12,
        heading: "Soney WH-1000XM4",
        title: "UNPARALLELED NOISE CANCELLATION",
        description: "Industry-leading noise cancellation with superior sound quality.",
        price: "$349",
        image: "phone3.png",
        rating: 4.8,
        ratedBy: 2200,
        category: "Headphones",
        name: "Sony WH-1000XM4"
    },
    {
        id: 13,
        heading: "Tecon sparck",
        title: "Capture Your Moments",
        description: "Compact and powerful drone for stunning aerial photography.",
        price: "$399",
        image: "phone4.png",
        rating: 4.3,
        ratedBy: 600,
        category: "Drones",
        name: "DJI Spark"
    }
];
const categoryShop: { title: string; image: string }[] = [
    {
        title: "Pixel",
        image: "pixel5.png",
    },
    {
        title: "Gaming Console",
        image: "ps5.png",
    },
    {
        title: "SmartPhone",
        image: "phone.png",
    },
    {
        title: "TWS wireless",
        image: "earbards.png",
    },
    {
        title: "Camera & Photo",
        image: "camera.png",
    },
    {
        title: "TV & Homes",
        image: "tv.png",
    },
    {
        title: "Accessories",
        image: "keyboard.png",
    },
    {
        title: "Headphones",
        image: "headphone.png",
    }
];
export {heroBannerInfo, categoryShop};