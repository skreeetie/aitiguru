import { baseApi } from './baseApi';

interface ProductDTO {
  id: number;
  title: string;
  category: string;
  price: number;
  rating: number;
  brand: string;
  sku: string;
  thumbnail: string;
}

interface ProductsResponseDTO {
  products: ProductDTO[];
  total: number;
  skip: number;
  limit: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  vendor: string;
  article: string;
  rating: number;
  price: number;
  image: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
}

export interface ProductParams {
  limit: number;
  skip: number;
  q?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

const USD_TO_RUB_RATE = 78;

export const productsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<ProductsResponse, ProductParams>({
      query: ({ q, limit, skip, sortBy, order }) => {
        const url = q ? 'products/search' : 'products';
        
        const params: Record<string, string | number> = {
          limit,
          skip,
        };

        if (q) params.q = q;
        if (sortBy) params.sortBy = sortBy;
        if (order) params.order = order;

        return {
          url,
          params,
        };
      },
      transformResponse: (response: ProductsResponseDTO): ProductsResponse => {
        return {
          total: response.total,
          products: response.products.map((item) => ({
            id: String(item.id),
            name: item.title,
            category: item.category,
            vendor: item.brand || 'No Brand',
            article: item.sku,
            rating: item.rating,
            price: item.price * USD_TO_RUB_RATE,
            image: item.thumbnail,
          })),
        };
      },
    }),
  }),
});

export const { useGetProductsQuery } = productsApi;