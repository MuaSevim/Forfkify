import View from './View';

class AddIngredientView extends View {
  _parentElement = document.querySelector('.ingredients');

  render(data) {
    this._data = data;
    const markup = this._generateMarkup();
    this._parentElement.insertAdjacentHTML('beforeend', markup);
  }

  _generateMarkup() {
    return `
    <label>Ingredient ${this._data.current}</label>
    <input type="text" name="ingredient-4" placeholder="Format: 'Quantity,Unit,Description'">`;
  }
}

export default new AddIngredientView();
