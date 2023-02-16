function wishListRender() {
	let localWishlist = localStorage.getItem('wishlist') != null && localStorage.getItem('wishlist') ? JSON.parse(localStorage.getItem('wishlist')) : [];

	const hearts = document.querySelectorAll('.add_to_wish');
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
		const price = Shopify.formatMoney(product.price, 'SAR {{amount}}');
		const compare_at_price = Shopify.formatMoney(product.compare_at_price, 'SAR {{amount}}');

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
				<heart class="card__wish-item">
					<i class="iconfont icon-heart-fill card__wish-item heart add_to_wish checked" data-handle="${product.handle}"></i>
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
						<span class="visually-hidden visually-hidden--inline">${price}</span>
						<span class="price-item price-item--sale price-item--last">
							${price}
						</span>
						${
							product.price_varies == false && product.compare_at_price_varies
								? `<span class="visually-hidden visually-hidden--inline">{{ 'products.product.price.regular_price' | t }}</span>
							<span>
								<s class="price-item price-item--regular" style="color: #7C7C46;">
									${compare_at_price}
								</s>
							</span>`
								: ''
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

$(function () {
	wishListRender();
});

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
