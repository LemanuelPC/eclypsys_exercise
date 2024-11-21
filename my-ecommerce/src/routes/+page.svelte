<script>
    export let products = [];
    export let categories = [];
    let selectedCategory = '';
    let searchTerm = '';
    let loading = !products.length;
  
    // Filter products based on the selected category
    $: filteredProducts = selectedCategory
      ? products.filter((product) => product.categ_id && product.categ_id[1] === selectedCategory)
      : products;
  
    // Further filter products based on the search term
    $: searchedProducts = searchTerm
      ? filteredProducts.filter((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : filteredProducts;
  
    $: if (loading) {
      loading = products.length === 0;
    }
  </script>
  
  <style>
    @import '../app.css';
  </style>
  
  <div>
    <h1>Our Products</h1>
  
    <!-- Loading state -->
    {#if loading}
      <p>Loading products...</p>
    {:else}
      <!-- Category Filter -->
      <select bind:value={selectedCategory}>
        <option value="">All Categories</option>
        {#each categories as category}
          <option value={category.name}>{category.name}</option>
        {/each}
      </select>
  
      <!-- Search Input -->
      <input
        type="text"
        placeholder="Search products..."
        bind:value={searchTerm}
        style="margin: 1rem; padding: 0.5rem; width: 100%; max-width: 400px;"
      />
  
      <!-- Product Cards -->
      <div class="products-container">
        {#each searchedProducts as product}
          <div class="product-card">
            <img src="data:image/png;base64,{product.image_1920}" alt="{product.name}" />
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <span class="price">${product.list_price}</span>
          </div>
        {/each}
      </div>
    {/if}
  </div>
  