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

function wishListRender() {
	let localWishlist = localStorage.getItem('wishlist') != null && localStorage.getItem('wishlist') ? JSON.parse(localStorage.getItem('wishlist')) : [];

	const hearts = document.querySelectorAll('.icon-heart');
	Array.prototype.map.call(hearts, function (item) {
		if (localWishlist.length) {
			localWishlist.map((product) => {
				if (item.getAttribute('data-handle') == product.handle) {
					item.classList.add('checked');
				}
			});
		} else {
			item.classList.remove('checked');
		}
	});

	let html = localWishlist.map((product) => {
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
					<svg class="icon-heart checked" aria-hidden="true" data-handle="${product.handle}">
						<use xlink:href="#icon-Heart"></use>
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

		  </div>
		</div>
	  </div>
	</li>`;
	});

	$('#wishlist').html(html);
}

window.onload = function () {
	wishListRender();
};

class WishList extends HTMLElement {
	constructor() {
		super();
		this.heart = this.querySelector('heart');
		this.heart.addEventListener('click', this.addToWish.bind(this));
	}

	addToWish(event) {
		let handle = event.target.dataset.handle;
		let wish_list =
			localStorage.getItem('wishlist') != null && localStorage.getItem('wishlist') != undefined && localStorage.getItem('wishlist')
				? JSON.parse(localStorage.getItem('wishlist'))
				: [];
		let tp_handles = [];

		wish_list.map(function (item) {
			tp_handles.push(item.handle);
		});

		if (!tp_handles.includes(handle)) {
			// add
			event.target.classList.add('checked');
			$.getJSON(window.Shopify.routes.root + `products/${handle}.js`, function (data) {
				wish_list.push(data);

				localStorage.setItem('wishlist', JSON.stringify(wish_list));
				wishListRender();
			});
		} else {
			// remove
			event.target.classList.remove('checked');
			let fresh_wish_list = wish_list.filter(function (item) {
				return item.handle != handle;
			});

			localStorage.setItem('wishlist', JSON.stringify(fresh_wish_list));
			wishListRender();
		}
	}
}

customElements.define('wish-list', WishList);
