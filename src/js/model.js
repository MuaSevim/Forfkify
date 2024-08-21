import { API_KEY, API_URL, MAX_INGREDIENT, RES_PER_PAGE } from './config.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
  ingredients: {
    current: 3,
    max: MAX_INGREDIENT,
  },
};
// sort: [alphabetical, duration, numIngredients, publishedAt],

const createRecipeObject = function (data) {
  // extracting RAW data
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    ingredients: recipe.ingredients,
    cookingTime: recipe.cooking_time,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);
    state.recipe = createRecipeObject(data);
    state.recipe.bookmarked = state.bookmarks.some(
      bookmark => bookmark.id === id
    );
    console.log(state.recipe);
  } catch (err) {
    console.error('model:', err);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    state.search.results = data.data.recipes.map(record => ({
      id: record.id,
      title: record.title,
      imageUrl: record.image_url,
      publisher: record.publisher,
      ...(record.key && { key: record.key }),
    }));
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = function (page = 1) {
  state.search.page = page;
  const start = (page - 1) * 10; // because we don't start from 0 as array index
  const end = page * 10;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity *= newServings / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  // const bookmarks = state.bookmarks.sort((a, b) => a.)
  console.log(state.bookmarks);
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);

  if (state.recipe.id === recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

export const removeBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  if (state.recipe.id === id) state.recipe.bookmarked = false;
  persistBookmarks();
};

const initModel = function () {
  const storage = localStorage.getItem('bookmarks');
  if (!storage) return;

  const storageBookmarks = JSON.parse(storage);

  state.bookmarks = storageBookmarks
    .slice(0)
    .sort((a, b) => a.title.at(0).charCodeAt(0) - b.title.at(0).charCodeAt(0));
};
initModel();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(
        ([input, value]) => input.startsWith('ingredient') && value !== ''
      )
      .map(([_, ingredient]) => {
        const ingArr = ingredient.split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw Error(
            'Wrong ingredient format! Please use the correct format:))'
          );
        const [quantity, unit, description] = ingArr;

        return {
          quantity: quantity ? +quantity : null,
          unit,
          description,
        };
      });

    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      cooking_time: newRecipe.cookingTime,
      servings: newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${API_KEY}`, 'POST', recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

export const removeRecipe = async function (id) {
  try {
    await AJAX(`${API_URL}${id}?key=${API_KEY}`, 'DELETE');
  } catch (err) {
    throw err;
  }
};

export const addIngredient = function () {
  state.ingredients.current++;
};
