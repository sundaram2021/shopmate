import { algoliasearch } from 'algoliasearch';

const appID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY;

if (!appID || !apiKey) {
  console.warn('Algolia keys are missing in environment variables.');
}

export const client = algoliasearch(appID || '', apiKey || '');

const INDEX_NAME = 'styles';

/**
 * Search products by query with optional filters
 */
export async function searchProducts(query: string, filters?: string) {
  try {
    const result = await client.searchSingleIndex({
      indexName: INDEX_NAME,
      searchParams: {
        query,
        filters,
        hitsPerPage: 10,
        attributesToRetrieve: [
          'objectID',
          'name',
          'description',
          'brand',
          'categories',
          'price',
          'price_range',
          'image',
          'url',
          'free_shipping',
          'rating',
          'type',
        ],
      },
    });
    return result.hits;
  } catch (error) {
    console.error('Algolia Search Error:', error);
    return [];
  }
}

/**
 * Get available product categories
 */
export async function getCategories(): Promise<string[]> {
  try {
    const result = await client.searchSingleIndex({
      indexName: INDEX_NAME,
      searchParams: {
        query: '',
        hitsPerPage: 0,
        facets: ['categories'],
      },
    });
    const facets = result.facets?.categories || {};
    return Object.keys(facets).slice(0, 20);
  } catch (error) {
    console.error('Algolia Categories Error:', error);
    return [];
  }
}
