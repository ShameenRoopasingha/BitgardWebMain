/**
 * =============================================================================
 * BITGARD WEBSITE - PRODUCTS SECTION (SERVER WRAPPER)
 * =============================================================================
 * 
 * Server component that fetches data and passes to client component.
 * 
 * @author Bitgard Development Team
 * @version 1.1.0
 */

import { getActiveProducts } from "@/lib/db";
import { ProductsClient, type ProductData } from "./ProductsClient";

export async function Products() {
    // Fetch products from database
    const dbProducts = await getActiveProducts();

    // Transform database records to client-friendly format
    const products: ProductData[] = dbProducts.map((product) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        tagline: product.tagline,
        description: product.description,
        icon: product.icon,
        features: ((product.features as { title?: string }[])?.map(f => f.title || f) || []) as string[],
    }));

    return <ProductsClient products={products} />;
}

export default Products;
