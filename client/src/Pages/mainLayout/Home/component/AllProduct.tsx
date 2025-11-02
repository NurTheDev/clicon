import { useState } from "react";
import Container from "../../../../common/Container";
import useFetchProducts from "../../../../helpers/fetchApi";

function Item({ item }) {
  return (
    <div>
      <h4 className="body-medium-600">FLASH SALE TODAY</h4>
    </div>
  );
}

function AllProduct() {
  const [endpoint, setEndpoint] = useState("");
  const { data, isLoading } = useFetchProducts(endpoint);
  const products = data?.products || [];
  return (
    <div>
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {/* Product cards will go here */}
          <div>
            <h4 className="body-medium-600">FLASH SALE TODAY</h4>
            {products.slice(0, 4).map((item) => (
              <Item key={item.id} item={item} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default AllProduct;
