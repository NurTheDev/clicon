
import React from "react";
import { useLocation } from "react-router-dom";

const PaymentSuccess: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-16 text-green-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <h2 className="mt-4 text-2xl font-bold text-center text-gray-800">
            Payment Successful!
          </h2>
          <p className="mt-2 text-center text-gray-600">
            Thank you for your purchase. Your order is being processed.
          </p>
        </div>
        <div className="p-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Order Summary
          </h3>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Transaction ID:</span>
              <span className="text-gray-800">{query.get("tran_id")}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Amount:</span>
              <span className="text-gray-800">
                {query.get("currency")} {query.get("amount")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Card Type:</span>
              <span className="text-gray-800">{query.get("card_type")}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">
                Bank Transaction ID:
              </span>
              <span className="text-gray-800">
                {query.get("bank_tran_id")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">
                Transaction Date:
              </span>
              <span className="text-gray-800">{query.get("tran_date")}</span>
            </div>
          </div>
        </div>
        <div className="text-center">
          <button
            onClick={() => (window.location.href = "/")}
            className="px-6 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

