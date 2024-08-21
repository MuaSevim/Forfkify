import View from './View';

import icons from 'url:../../img/icons.svg';

class PreviewView extends View {
  _generateMarkup() {
    return this._data
      .map(result => this._generateMarkupPreview(result))
      .join('');
  }

  _generateMarkupPreview(result) {
    const id = window.location.hash.slice(1);
    console.log(result);

    return `
        <li class="preview">
            <a class="preview__link 
                ${id === result.id ? 'preview__link--active' : ''}" 
                href="#${result.id}"
            >
            <figure class="preview__fig">
                <img src="${result.image || result.imageUrl}" 
                alt="${result.title}" />
            </figure>
            <div class="preview__data">
                <h4 class="preview__title">${result.title}</h4>
              <p class="preview__publisher">${result.publisher}</p>
                ${
                  result.key
                    ? `<div class="preview__user-generated">
                      <svg>
                        <use href="${icons}#icon-user"></use>
                      </svg>
                    </div>`
                    : ''
                }
            </div>
            </a>
         </li>`;
  }
}

export default PreviewView;
