import View from './View';

import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _message = 'Recipe was successfully added';
  _currentIngredient = 3;

  constructor() {
    super();
    this.addHandlerToggleWindow();
    this.addHandlerUpload();
  }

  toggleWindow() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }

  addHandlerToggleWindow() {
    [this._btnOpen, this._btnClose, this._overlay].forEach(el =>
      el.addEventListener('click', this.toggleWindow.bind(this))
    );
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();

      const arrData = [...new FormData(this)];
      const data = Object.fromEntries(arrData);
      typeof handler === 'function' && handler(data);
    });
  }

  addHandlerIngredient(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.add-ingredient__btn');
      if (!btn) return;

      const { ing } = btn.dataset;
      console.log(+ing);
      if (+ing === 8) return;

      handler();
      btn.dataset.ing = +ing + 1;
    });
  }

  _generateMarkup() {
    return `<div class="upload__column">
          <h3 class="upload__heading">Recipe data</h3>
          <label>Title</label>
          <input value="TEST23" required name="title" type="text" />
          <label>URL</label>
          <input value="TEST23" required name="sourceUrl" type="text" />
          <label>Image URL</label>
          <input value="TEST23" required name="image" type="text" />
          <label>Publisher</label>
          <input value="TEST23" required name="publisher" type="text" />
          <label>Prep time</label>
          <input value="23" required name="cookingTime" type="number" />
          <label>Servings</label>
          <input value="23" required name="servings" type="number" />
        </div>

        <div class="upload__column">
          <h3 class="upload__heading">Ingredients</h3>
          <div class="ingredients">
          <label>Ingredient 1</label>
          <input
            value="0.5,kg,Rice"
            type="text"
            required
            name="ingredient-1"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 2</label>
          <input
            value="1,,Avocado"
            type="text"
            name="ingredient-2"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 3</label>
          <input
            value=",,salt"
            type="text"
            name="ingredient-3"
            placeholder="Format: 'Quantity,Unit,Description'"
          />

        </div>
        <button type="button" class="btn add-ingredient__btn" data-ing="${this._currentIngredient}">
            <svg>
              <use href="${icons}#icon-plus-circle"></use>
            </svg>
            <span>Add Ingredient</span>
        </button>

        <button class="btn upload__btn">
          <svg>
            <use href="${icons}#icon-upload-cloud"></use>
          </svg>
          <span>Upload</span>
        </button>
      </div>`;
  }
}

export default new AddRecipeView();
