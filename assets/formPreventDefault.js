$(function () {
	// Retrieves input data from a form and returns it as a JSON object:
	function formToJSON(elements) {
		return [].reduce.call(
			elements,
			function (data, element) {
				data[element.name] = element.value;
				return data;
			},
			{}
		);
	}

	// Get Shopify Friendly URL String
	function getUrlString(data) {
		var urlParameters = Object.entries(data)
			.map(function (e) {
				return e.join('=');
			})
			.join('&');

		return urlParameters;
	}

	var form = document.getElementById('ContactFooter_jax');
	var form_type = form.querySelector('[name=form_type]').value,
		inputs = form.querySelectorAll('[name]');

	form.addEventListener('submit', function (e) {
		e.preventDefault();

		var action = form.getAttribute('data-action');
		// var action = '/contact';

		console.log('Form Action: ' + action);
		console.log('Submitting ' + form_type + ' form...');

		fetch(action, {
			method: 'POST',
			body: getUrlString(formToJSON(inputs)),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				Accept: 'text/html, */*; q=0.01',
				'X-Requested-With': 'XMLHttpRequest'
			}
		})
			.then(function (response) {
				console.log(response);
				console.log(response.status);
			})
			.catch(function (err) {
				console.error(err);
			});
	});
});
