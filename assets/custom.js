function wishListRender() {
	let addBtns = $('.add_to_wish');
	const localWishlist = localStorage.getItem('wishlist') != null && localStorage.getItem('wishlist') ? JSON.parse(localStorage.getItem('wishlist')) : [];
	addBtns.map((index, item) => {
		if (localWishlist.length) {
			localWishlist.map((product) => {
				if ($(item).data('handle') == product.handle) {
					$(item).addClass('checked');
				}
			});
		} else {
			$(item).removeClass('checked');
		}
	});

	const html = localWishlist.map((product) => {
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
              <wish-list class="card__badge top right card__wish" style="z-index: 2;">
                <heart class="card__wish-item heart add_to_wish" data-handle="${product.handle}">
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
                </heart>
              </wish-list>
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
                      <span class="price-item price-item--regular"> ${price} </span>
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

          </div>
        </div>
      </div>
    </li>`;
	});

	$('#wishlist')
		.html(html)
		.promise()
		.done(function () {});
}

function addToWish() {
	$('.add_to_wish').click(function () {
		let wish_list =
			localStorage.getItem('wishlist') != null && localStorage.getItem('wishlist') != undefined && localStorage.getItem('wishlist')
				? JSON.parse(localStorage.getItem('wishlist'))
				: [];
		let tp_handles = [];

		wish_list.map(function (item) {
			tp_handles.push(item.handle);
		});

		const _self = $(this);
		const handle = $(this).data('handle');

		console.log($(this).get(0));

		if (!tp_handles.includes(handle)) {
			// add
			_self.addClass('checked');
			$.getJSON(window.Shopify.routes.root + `products/${handle}.js`, function (data) {
				wish_list.push(data);

				localStorage.setItem('wishlist', JSON.stringify(wish_list));
				wishListRender();
			});
		} else {
			// remove
			_self.removeClass('checked');
			let fresh_wish_list = wish_list.filter(function (item) {
				return item.handle != handle;
			});

			localStorage.setItem('wishlist', JSON.stringify(fresh_wish_list));
			wishListRender();
		}
	});
}

$(document).ready(function () {
	wishListRender();
	addToWish();
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
