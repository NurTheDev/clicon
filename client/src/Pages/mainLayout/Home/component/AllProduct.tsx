import Container from "../../../../common/Container";
import useFetchProducts from "../../../../helpers/fetchApi";

function ItemSkeleton() {
  return (
    <div className="flex gap-4 mb-1 items-center py-3 border border-gray-100 rounded-xs">
      <div className="flex-shrink-0">
        <div className="w-16 h-16 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
      </div>
    </div>
  );
}
function Item({ title, endpoint }: { item: object; endpoint: string }) {
  const { data, isLoading } = useFetchProducts(endpoint);
  const products = data?.products || [];
  return (
    <div>
      <h3 className="body-small-600 mb-3">{title}</h3>
      {products.slice(0, 4).map((item) => {
        return isLoading ? (
          <ItemSkeleton key={Math.random()} />
        ) : (
          <div
            key={item.id}
            className="flex gap-4 mb-1 items-center py-3 border border-gray-100 rounded-xs cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex-shrink-0">
              <img
                src={item?.thumbnail}
                alt={item.title}
                className="w-16 h-16 object-cover rounded"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <p className="body-small-400">{item.title}</p>
              <p className="body-small-400 text-gray-600 truncate">
                {item.description}
              </p>
              <p className="body-small-600 text-secondary-500">${item.price}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AllProduct() {
  return (
    <div>
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Product cards will go here */}
          <Item endpoint="category/smartphones" title="Flash Sale Today" />
          <Item endpoint="category/laptops" title="BEST SELLERS" />
          <Item endpoint="category/vehicle" title="TOP RATED" />
          <Item endpoint="category/sunglasses" title="NEW ARRIVALS" />
        </div>
      </Container>
    </div>
  );
}

export default AllProduct;
