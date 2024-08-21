class SearchView {
  _parentEl = document.querySelector('.search');
  _inputSearch = document.querySelector('.search__field');

  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', e => {
      e.preventDefault();
      handler();
    });
  }

  getQuery() {
    const value = this._inputSearch.value;
    this._clearSearchForm();
    return value;
  }

  _clearSearchForm() {
    this._inputSearch.value = '';
    this._inputSearch.blur();
  }
}

export default new SearchView();
