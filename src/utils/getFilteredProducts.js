export const getFilteredProducts = (
  arr,
  userName,
  query,
  currentCategories,
) => {
  let filteredProducts = arr.filter(({ user }) => {
    if (userName === 'All') {
      return true;
    } else {
      return user.name === userName;
    }
  });

  if (query) {
    filteredProducts = filteredProducts.filter(({ name }) =>
      name.toLowerCase().includes(query.toLowerCase().trim()),
    );
  }

  if (currentCategories.length) {
    filteredProducts = filteredProducts.filter(({ category }) =>
      currentCategories.includes(category.title),
    );
  }

  return filteredProducts;
};
