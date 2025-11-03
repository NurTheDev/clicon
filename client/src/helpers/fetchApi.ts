import { useQuery } from "@tanstack/react-query";

const useFetchProducts = (endpoint: string = "") => {
  return useQuery({
    queryKey: ["all-products", endpoint],
    queryFn: async () => {
      const response = await fetch(`https://dummyjson.com/products/${endpoint}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json(); // Return the parsed data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export default useFetchProducts;
