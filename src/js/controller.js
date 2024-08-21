// Application Modules and Classes
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

// Third Party Packages
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { MODAL_CLOSE_SEC } from './config.js';

console.log(model.state.bookmarks);

// Keeping the state of the page
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // to make sure "selected" works, each time user selects a recipe, I needto re-run "result list view"
    resultsView.update(model.getSearchResultsPage());

    bookmarksView.update(model.state.bookmarks);

    // 0 - Spin Wheel while Await
    recipeView.renderSpinnerWheel();

    // 1 - Loading Recipe
    await model.loadRecipe(id);

    // 2 - Rendering Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;

    // 0 - Spin the Whee
    resultsView.renderSpinnerWheel();

    // 1 - Load Search Results
    await model.loadSearchResults(query);

    // 2 - Render the Search Results
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
    resultsView.renderError();
  }
};

const controlPagination = function (page) {
  resultsView.render(model.getSearchResultsPage(page));
  paginationView.render(model.state.search);
};

const controlServings = function (servings) {
  model.updateServings(servings);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);

  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);

  console.log(localStorage.getItem('bookmarks'));
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinnerWheel();

    await model.uploadRecipe(newRecipe);

    recipeView.render(model.state.recipe);

    addRecipeView.renderMessage();

    const closeModal = async () =>
      new Promise(resolve =>
        setTimeout(() => {
          addRecipeView.toggleWindow();
          resolve(true);
        }, MODAL_CLOSE_SEC * 1000)
      );

    await closeModal();

    // Re-render the bookmarks view
    bookmarksView.render(model.state.bookmarks);

    // Change the recipe "id" in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }

  setTimeout(() => {
    addRecipeView.render({});
  }, MODAL_CLOSE_SEC * 1000);
};

// Upload the New Recipe Data

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerRecipeServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();

// addRecipeView.addHandlerTogglewindow();
console.log(window.history);

console.log(model.state.bookmarks);
