export function getSortedProducts(productsArr, sortType, isReversed) {
  const productsArrCopy = [...productsArr].sort((a, b) => {
    switch (sortType) {
      case 'ID':
        return a.id - b.id;
      case 'Product':
        return a.name.localeCompare(b.name);
      case 'Category':
        return a.category.title.localeCompare(b.category.title);
      case 'User':
        return a.user.name.localeCompare(b.user.name);
      default:
        return 0;
    }
  });

  if (isReversed) {
    return productsArrCopy.reverse();
  }

  return productsArrCopy;
}
