import View from './View';

import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest("[class*='pagination__btn']");
      if (!btn) return;

      handler(+btn.dataset.goto);
    });
  }

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const currentPage = this._data.page;
    const elPageNumber = `<p class="page-number">${currentPage}/${numPages}</p>`;

    if (currentPage === 1 && numPages > 1) {
      return elPageNumber.concat(
        this._generateMarkupButton('next', currentPage)
      );
    }

    // Last Page
    if (currentPage === numPages && numPages > 1) {
      return this._generateMarkupButton('prev', currentPage).concat(
        elPageNumber
      );
    }

    if (numPages > 1) {
      return this._generateMarkupButton('prev', currentPage)
        .concat(elPageNumber)
        .concat(this._generateMarkupButton('next', currentPage));
    }

    return '';
  }

  _generateMarkupButton(type, current) {
    return `
    <button class="btn--inline pagination__btn--${type}" data-goto="${
      type === 'next' ? current + 1 : current - 1
    }">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-${
      type === 'next' ? 'right' : 'left'
    }"></use>
          </svg>
          <span>Page ${type === 'next' ? current + 1 : current - 1}</span>
    </button>`;
  }
}

export default new PaginationView();
