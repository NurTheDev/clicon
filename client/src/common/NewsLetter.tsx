import { useState } from "react";
import Icon from "../helpers/IconProvider";
import { brands } from "../helpers/assetsProvider";
const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Subscribed with email:", email);
    setEmail("");
  };

  return (
    <section className="bg-gradient-to-br mt-10 lg:mt-20 from-[#2B6A8F] to-[#1E4A66] py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Newsletter Heading */}
        <div>
          <h2 className="heading2 text-gray-00 mb-8">
            Subscribe to our newsletter
          </h2>

          {/* Newsletter Description */}
          <p className="body-large-400 text-gray-100 mb-8 mt-4 max-w-2xl mx-auto">
            Praesent fringilla erat a lacinia egestas. Donec vehicula tempor
            libero et cursus. Donec non quam urna. Quisque vitae porta ipsum.
          </p>
        </div>

        {/* Email Subscription Form */}
        <form onSubmit={handleSubmit} className="mb-12">
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              className="flex-1 px-4 py-3 rounded-sm text-gray-700 bg-gray-00 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              className="bg-primary-500 hover:bg-primary-600 text-gray-00 font-semibold px-8 py-3 rounded-sm flexRowCenter gap-2 transition-colors label2">
              SUBSCRIBE
              {Icon.send}
            </button>
          </div>
        </form>

        {/* Brand Logos */}
        <div className="flexRowCenter flex-wrap gap-8 md:gap-12 opacity-80">
          {brands.map((brand) => (
            <img
              key={brand.name}
              src={brand.logo}
              alt={brand.name}
              className="h-8 md:h-10 object-contain filter brightness-0 invert opacity-70 hover:opacity-100 transition-opacity"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
