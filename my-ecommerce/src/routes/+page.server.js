import { getProducts, getCategories } from '$lib/server/odoo';

export async function load() {
  try {
    const products = await getProducts(); // Fetch products
    const categories = await getCategories(); // Fetch categories
    return { products, categories };
  } catch (error) {
    console.error('Failed to load data:', error);
    return { products: [], categories: [] };
  }
}