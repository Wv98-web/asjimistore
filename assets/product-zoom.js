// 放大镜功能
$(document).ready(function () {
	$('.product__media-item').mouseover(function (e) {
		const _self = $(this);

		_self.find('.float_layer').show();
		_self.find('.big_box').show();
	});

	$('.product__media-item').mouseout(function (e) {
		const _self = $(this);

		_self.find('.float_layer').hide();
		_self.find('.big_box').hide();
	});

	$('.product__media-item').mousemove(function (e) {
        const _self = $(this);
        
        const small_box = $(this).find('.small_box');
        const float_layer = $(this).find('.float_layer');
        const mask = $(this).find('.mask');
        const big_box = $(this).find('.big_box');
        const big_box_img = $(this).find('.big_box img');

		var l = e.pageX - small_box.offset().left - (float_layer.width() / 2);
		var t = e.pageY - small_box.offset().left - (float_layer.height() / 2);
		if (l < 0) {
			l = 0;
		}
		if (l > $(this).width() - float_layer.width()) {
			l = $(this).width() - float_layer.width();
		}
		if (t < 0) {
			t = 0;
		}
		if (t > $(this).height() - float_layer.height()) {
			t = $(this).height() - float_layer.height();
		}

		float_layer.css({
			left: l,
			top: t
		});
		var pX = l / (mask.width() - float_layer.width());
		var pY = t / (mask.height() - float_layer.height());
		big_box_img.css({
			left: -pX * (big_box_img.width() - big_box.width()),
			top: -pY * (big_box_img.height() - big_box.height())
		});
	});
});
