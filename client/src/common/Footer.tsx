import { Link } from "react-router-dom";
import Logo from "../assets/logo/clicon-circle.svg";
import Icon from "../helpers/IconProvider";
const Footer = () => {
  const topCategories = [
    { name: "Computer & Laptop", path: "/category/computer-laptop" },
    { name: "SmartPhone", path: "/category/smartphone" },
    { name: "Headphone", path: "/category/headphone" },
    { name: "Accessories", path: "/category/accessories" },
    { name: "Camera & Photo", path: "/category/camera-photo" },
    { name: "TV & Homes", path: "/category/tv-homes" },
  ];

  const quickLinks = [
    { name: "Shop Product", path: "/shop" },
    { name: "Shoping Cart", path: "/cart" },
    { name: "Wishlist", path: "/wishlist" },
    { name: "Compare", path: "/compare" },
    { name: "Track Order", path: "/track-order" },
    { name: "Customer Help", path: "/help" },
    { name: "About Us", path: "/about" },
  ];

  const popularTags = [
    "Game",
    "iPhone",
    "TV",
    "Asus Laptops",
    "Macbook",
    "SSD",
    "Graphics Card",
    "Power Bank",
    "Smart TV",
    "Speaker",
    "Tablet",
    "Microwave",
    "Samsung",
  ];

  return (
    <footer className="bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div>
            <div className="flexRowStart gap-2 mb-6">
              <div className="w-10 h-10 bg-primary-500 rounded-full flexRowCenter">
                <img src={Logo} alt="Logo" />
              </div>
              <h2 className="heading3 text-gray-00">CLICON</h2>
            </div>
            <div className="space-y-3">
              <p className="body-small-400 text-gray-400">Customer Supports:</p>
              <p className="body-large-600 text-gray-00">(629) 555-0129</p>
              <p className="body-small-400 text-gray-400">
                4517 Washington Ave.
                <br />
                Manchester, Kentucky 39495
              </p>
              <p className="body-medium-500 text-gray-00">info@kinbo.com</p>
            </div>
          </div>

          {/* Top Category */}
          <div>
            <h3 className="label2 text-gray-00 mb-6 uppercase">Top Category</h3>
            <ul className="space-y-3">
              {topCategories.map((category) => (
                <li key={category.name}>
                  <Link
                    to={category.path}
                    className="body-small-500 text-gray-400 hover:text-primary-500 transition-colors">
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/products"
                  className="body-small-500 text-warning-500 hover:text-warning-400 transition-colors flexRowStart gap-2">
                  Browse All Product
                  <span className="text-sm">→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="label2 text-gray-00 mb-6 uppercase">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="body-small-500 text-gray-400 hover:text-primary-500 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Download App & Popular Tags */}
          <div>
            <h3 className="label2 text-gray-00 mb-6 uppercase">Download App</h3>
            <div className="space-y-3 mb-8">
              <Link
                to="#"
                className="!flex items-center gap-3 bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded transition-colors">
                <div className="text-2xl">{Icon.googlePlay}</div>
                <div>
                  <p className="body-tiny-400 text-gray-400">Get it now</p>
                  <p className="body-medium-600 text-gray-00">Google Play</p>
                </div>
              </Link>
              <Link
                to="#"
                className="!flex items-center gap-3 bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded transition-colors">
                <div className="text-2xl">{Icon.apple}</div>
                <div>
                  <p className="body-tiny-400 text-gray-400">Get it now</p>
                  <p className="body-medium-600 text-gray-00">App Store</p>
                </div>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="label2 text-gray-00 mb-4 uppercase">Popular Tag</h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <Link
                  key={tag}
                  to={`/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                  className="body-tiny-400 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-gray-00 rounded transition-colors">
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <p className="body-small-400 text-gray-400 text-center">
            Kinbo -eCommerce Template © 2025. Design by Tamsdancookie modify by
            wasim
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
