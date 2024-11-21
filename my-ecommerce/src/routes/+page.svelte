<script>
  export let products = [];
  export let categories = [];
  let selectedCategory = "";
  let searchTerm = "";
  let loading = !products.length;

  // Sort categories alphabetically
  $: sortedCategories = [...categories].sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  // Filter products based on the selected category
  $: filteredProducts = selectedCategory
    ? products.filter(
        (product) =>
          product.categ_id && product.categ_id[1] === selectedCategory,
      )
    : products;

  // Further filter products based on the search term
  $: searchedProducts = searchTerm
    ? filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : filteredProducts;

  // Update loading status when products change
  $: loading = products.length === 0;
</script>

<div class="products-page">
  <h1>Our Products</h1>

  <!-- Loading state -->
  {#if loading}
    <p>Loading products...</p>
  {:else}
    <!-- Category Filter -->
    <div class="filters">
      {#if categories.length > 0}
        <select bind:value={selectedCategory} class="category-filter">
          <option value="">All Categories</option>
          {#each sortedCategories as category}
            <option value={category.name}>{category.name}</option>
          {/each}
        </select>
      {:else}
        <p>No categories available</p>
      {/if}

      <!-- Search Input -->
      <input
        type="text"
        placeholder="Search products..."
        bind:value={searchTerm}
        class="search-input"
      />
    </div>

    <!-- Product Cards -->
    <div class="products-container">
      {#each searchedProducts as product}
        <div class="product-card">
          <h2>{product.name}</h2>
          <p>Price: ${product.list_price}</p>
          {#if product.qty_available !== undefined}
            <p>Quantity Available: {product.qty_available}</p>
          {:else}
            <p class="no-quantity">Quantity information not available</p>
          {/if}
          <span class="category"
            >{product.categ_id ? product.categ_id[1] : "No category"}</span
          >
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  @import "../app.css";
</style>
