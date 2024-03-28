/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import cn from 'classnames';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';
import { getSortedProducts } from './utils/getSortedProducts';
import { categories, female, sortCategories } from './utils/globalConstants';
import { getFilteredProducts } from './utils/getFilteredProducts';

const products = productsFromServer.map(product => {
  const category = categoriesFromServer.find(
    ({ id }) => id === product.categoryId,
  );
  const user = usersFromServer.find(({ id }) => id === category.ownerId);

  return {
    ...product,
    category,
    user,
  };
});

export const App = () => {
  const [nameOfUser, setNameOfUser] = useState('All');
  const [query, setQuery] = useState('');
  const [currentCategories, setCurrentCategories] = useState([]);
  const [currentSortItem, setCurrentSortItem] = useState('');
  const [isReversed, setIsReversed] = useState(false);
  const preparedProducts = getSortedProducts(
    products,
    currentSortItem,
    isReversed,
  );

  const handleSortClicks = sortItem => {
    const isItemEqualToCurrentItem = currentSortItem === sortItem;

    const firstClick = !isItemEqualToCurrentItem;
    const secondClick = !isReversed && isItemEqualToCurrentItem;
    const thirdClick = isReversed && isItemEqualToCurrentItem;

    if (firstClick) {
      setCurrentSortItem(sortItem);
      setIsReversed(false);
    }

    if (secondClick) {
      setIsReversed(true);
    }

    if (thirdClick) {
      setCurrentSortItem('');
      setIsReversed(false);
    }
  };

  const handleAddCategory = category => {
    if (currentCategories.includes(category)) {
      setCurrentCategories(prevCategories =>
        prevCategories.filter(cat => cat !== category),
      );
    } else {
      setCurrentCategories(prevCategories => [...prevCategories, category]);
    }
  };

  const handleResetFilters = () => {
    setNameOfUser('All');
    setQuery('');
    setCurrentCategories([]);
  };

  const filteredProducts = getFilteredProducts(
    preparedProducts,
    nameOfUser,
    query,
    currentCategories,
  );

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                className={cn({ 'is-active': nameOfUser === 'All' })}
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => setNameOfUser('All')}
              >
                All
              </a>
              {usersFromServer.map(user => (
                <a
                  className={cn({ 'is-active': nameOfUser === user.name })}
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  onClick={() => setNameOfUser(user.name)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      onClick={() => setQuery('')}
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                onClick={() => setCurrentCategories([])}
                href="#/"
                data-cy="AllCategories"
                className={cn('button is-success mr-6', {
                  'is-outlined': !!currentCategories.length,
                })}
              >
                All
              </a>
              {categories.map(category => (
                <a
                  onClick={() => handleAddCategory(category)}
                  key={category}
                  data-cy="Category"
                  className={cn('button mr-2 my-1', {
                    'is-info': currentCategories.includes(category),
                  })}
                  href="#/"
                >
                  {category}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                onClick={handleResetFilters}
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {!filteredProducts.length && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}

          {!!filteredProducts.length && (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  {sortCategories.map(item => {
                    const isItemEqualToCurrentItem = item === currentSortItem;

                    return (
                      <th key={item}>
                        <span className="is-flex is-flex-wrap-nowrap">
                          {item}
                          <a href="#/" onClick={() => handleSortClicks(item)}>
                            <span className="icon">
                              <i
                                data-cy="SortIcon"
                                className={cn('fas', {
                                  'fa-sort': !isItemEqualToCurrentItem,
                                  'fa-sort-up':
                                    isItemEqualToCurrentItem && !isReversed,
                                  'fa-sort-down':
                                    isItemEqualToCurrentItem && isReversed,
                                })}
                              />
                            </span>
                          </a>
                        </span>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map(product => {
                  const { id, name, category, user } = product;
                  const { icon, title } = category;
                  const { name: userName, sex } = user;

                  return (
                    <tr data-cy="Product" key={id}>
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {id}
                      </td>

                      <td data-cy="ProductName">{name}</td>
                      <td data-cy="ProductCategory">{`${icon} - ${title}`}</td>

                      <td
                        data-cy="ProductUser"
                        className={cn({
                          'has-text-link': sex !== female,
                          'has-text-danger': sex === female,
                        })}
                      >
                        {userName}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
