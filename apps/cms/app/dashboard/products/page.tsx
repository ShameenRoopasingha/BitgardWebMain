import { getProducts } from "@/lib/actions";
import ProductsClient from "./ProductsClient";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
    const products = await getProducts();
    return <ProductsClient initialProducts={JSON.parse(JSON.stringify(products))} />;
}
