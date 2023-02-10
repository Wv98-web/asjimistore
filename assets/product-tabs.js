window.onload = function () {
	var oTab = document.getElementById('product-tab');
	var aLi = oTab.getElementsByClassName('tab-header__item');
	var oTabBox = oTab.getElementsByClassName('tab-content')[0];
	var aBox = oTabBox.getElementsByClassName('tab-content__item');

	for (var i = 0; i < aLi.length; i++) {
		aLi[i].index = i;
		aLi[i].addEventListener('click', function () {
			for (var j = 0; j < aLi.length; j++) {
				aLi[j].classList.remove('active');
				aBox[j].classList.remove('active');
			}
			aLi[this.index].classList.add('active');
			aBox[this.index].classList.add('active');
		});
	}
};
