$(document).ready(function () {
	let wish_list = [];
	let addBtn = $('.add_to_wish');

	addBtn.map((index, item) => {
		const $item = $(item);
		$item.click(function () {
			const handle = $(this).data('handle');

			JSON.parse(localStorage.getItem('wish_list')).map((prod, index) => {
        if (prod.handle == handle) {
          wish_list = JSON.parse(localStorage.getItem('wish_list'))
				} else {
					// ajax api
					$.getJSON(window.Shopify.routes.root + `products/${handle}.js`, function (product) {
						wish_list.push(product);
						// 临时存储
						localStorage.setItem('wish_list', wish_list.length ? JSON.stringify(wish_list) : []);

						isWish();
					});
				}
			});
		});
	});

	function isWish() {
		const wishList = JSON.parse(localStorage.getItem('wish_list'));

		let html = wishList.map((product) => {
			const price = Shopify.formatMoney(product.price, '${{amount}}');
			const compare_at_price = Shopify.formatMoney(product.compare_at_price, '${{amount}}');

			return `
      <li class="grid__item">
        <div class="card-wrapper product-card-wrapper underline-links-hover card-product-1">
          <div
            class="card card--standard card--media"
            style="--ratio-percent: 100%;"
          >
            <div class="card__inner color-background-2 gradient ratio" style="--ratio-percent: 100%;">
              <div class="card__media">
                <div class="media media--transparent media--hover-effect">
                  <img
                    src=${product.featured_image}
                    sizes="(min-width: 1200px) 267px, (min-width: 990px) calc((100vw - 130px) / 4), (min-width: 750px) calc((100vw - 120px) / 3), calc((100vw - 35px) / 2)"
                    alt=${product.title}
                    class="motion-reduce"
                    loading="lazy"
                    width="1080"
                    height="1350"
                  >
                </div>
              </div>
              <div class="card__content">
                <div class="card__information">
                  <h3 class="card__heading">
                    <a
                      href=${product.url}
                      class="full-unstyled-link"
                    >
                      ${product.title}
                    </a>
                  </h3>
                </div>
      
                <div class="card__badge top right card__wish add_to_wish" data-handle=${product.handle} style="z-index: 2;">
                  <div class="card__wish-item">
                    <svg
                      viewBox="0 0 20 19"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                    >
                      <title>爱心备份 2</title>
                      <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                          <g id="详情页" transform="translate(-521.000000, -707.000000)" fill-rule="nonzero" stroke="#EF422B">
                              <g id="爱心备份-2" transform="translate(522.000000, 708.000000)">
                                  <path d="M9.00562852,16.7954972 C8.7129456,16.7954972 8.44277674,16.7054409 8.20637898,16.5140713 C8.01500936,16.3564728 3.34333959,12.7429643 1.47467168,9.80487804 C0.85553472,8.83677298 0,7.51969982 0,5.6510319 C0,2.53283303 2.33020638,0 5.1782364,0 C6.63039399,0 8.01500939,0.664165107 9.00562852,1.82363978 C9.98499061,0.652908071 11.358349,0 12.8217636,0 C15.6810507,0 18,2.53283301 18,5.6510319 C18,7.48592871 17.2007505,8.74671669 16.5478424,9.77110695 L16.5253283,9.80487804 C14.6566604,12.7429643 9.98499061,16.3677298 9.79362102,16.5140713 C9.5684803,16.6941839 9.29831146,16.7954972 9.00562852,16.7954972 Z" id="形状"></path>
                              </g>
                          </g>
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div class="card__content">
              <div class="card__information">
                <h3
                  class="card__heading h5"
                >
                  <a
                    href=${product.url}
                    class="full-unstyled-link"
                  >
                    ${product.title}
                  </a>
                </h3>
                <div class="card-information">
                  <div class="price  price--on-sale ">
                    <div class="price__container">
                      <div class="price__regular">
                        <span class="price-item price-item--regular"> $9.99 USD </span>
                      </div>
                      <div class="price__sale">
                        <span class="price-item price-item--sale price-item--last"> ${price} </span>
                        ${
							product.price_varies
								? `<span>
                          <s class="price-item price-item--regular" style="color: #7C7C46;"> ${compare_at_price} </s>
                        </span>`
								: ``
						}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="quick-add no-js-hidden">
                <product-form>
                  <form
                    method="post"
                    action="/ar/cart/add"
                    id=${`quick-add-` + product.id}
                    accept-charset="UTF-8"
                    class="form"
                    enctype="multipart/form-data"
                    novalidate="novalidate"
                    data-type="add-to-cart-form"
                  >
                    <input type="hidden" name="form_type" value="product"><input type="hidden" name="utf8" value="✓"
                    ><input type="hidden" name="id" value=${product.variants.length ? product.variants[0].id : product.id}>
                    <button
                      id=${`quick-add-` + product.id + `-submit`}
                      type="submit"
                      name="add"
                      class="quick-add__submit button button--full-width button--secondary"
                      aria-haspopup="dialog"
                      aria-live="polite"
                      data-sold-out-message="true"
                    >
                      <span>أضف للسلة </span>
                      <span class="sold-out-message hidden"> مباع </span>
                      <div class="loading-overlay__spinner hidden">
                        <svg
                          aria-hidden="true"
                          focusable="false"
                          role="presentation"
                          class="spinner"
                          viewBox="0 0 66 66"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle class="path" fill="none" stroke-width="6" cx="33" cy="33" r="30"></circle>
                        </svg>
                      </div>
                    </button>
                  </form>
                </product-form>
              </div>

            </div>
          </div>
        </div>
      </li>`;
		});
		$('#wishlist').html(html);
	}

	isWish();
});

var Shopify = Shopify || {};
Shopify.money_format = '{{ shop.money_format }}';
Shopify.formatMoney = function (cents, format) {
	if (typeof cents == 'string') {
		cents = cents.replace('.', '');
	}
	var value = '';
	var placeholderRegex = /{{\s*(\w+)\s*}}/;
	var formatString = format || this.money_format;

	function defaultOption(opt, def) {
		return typeof opt == 'undefined' ? def : opt;
	}

	function formatWithDelimiters(number, precision, thousands, decimal) {
		precision = defaultOption(precision, 2);
		thousands = defaultOption(thousands, ',');
		decimal = defaultOption(decimal, '.');

		if (isNaN(number) || number == null) {
			return 0;
		}

		number = (number / 100.0).toFixed(precision);

		var parts = number.split('.'),
			dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
			cents = parts[1] ? decimal + parts[1] : '';

		return dollars + cents;
	}

	switch (formatString.match(placeholderRegex)[1]) {
		case 'amount':
			value = formatWithDelimiters(cents, 2);
			break;
		case 'amount_no_decimals':
			value = formatWithDelimiters(cents, 0);
			break;
		case 'amount_with_comma_separator':
			value = formatWithDelimiters(cents, 2, '.', ',');
			break;
		case 'amount_no_decimals_with_comma_separator':
			value = formatWithDelimiters(cents, 0, '.', ',');
			break;
	}

	return formatString.replace(placeholderRegex, value);
};