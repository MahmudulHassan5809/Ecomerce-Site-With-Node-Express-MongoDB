jQuery(document).ready(function($) {

	//Search
	$("#q").keyup(function(event) {
		var q = $(this).val();

		$.ajax({
			url: '/api/search',
			method: 'POST',
			dataType: 'json',
			data: {q},
		})
		.done(function(products) {
			//console.log(products);
			//console.log(products[0].name);
			$('#search_result').empty();
			for (var i = 0; i < products.length; i++) {
				var html = `
					<div class="col-md-4 mt-3">

				<a href="/product/${products[i]._id}">
					<figure class="figure">
						  <img src='${products[i].image}' class="figure-img img-fluid rounded">
						  <figcaption class="figure-caption">
						  	<h3>${products[i].name}</h3>
						  	<p>${products[i].category.name}</p>
						  	<p>${products[i].price}</p>
						  </figcaption>
					</figure>
				</a>

			</div>
				`;


			$('#search_result').append(html);
			}
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});

	});


	//Cart
	$(document).on('click', '#plus', function(event) {
		event.preventDefault();
		var priceValue = parseFloat($('#priceValue').val());
		var quantity = parseFloat($('#quantity').val());


		priceValue += parseFloat($('#priceHidden').val());
		quantity += 1

		$('#quantity').val(quantity);
		$('#priceValue').val(priceValue.toFixed(2));
		$('#total').html(quantity);

	});

	$(document).on('click', '#minus', function(event) {
		event.preventDefault();
		var priceValue = parseFloat($('#priceValue').val());
		var quantity = parseFloat($('#quantity').val());

		if(quantity == 1){
			priceValue = $('#priceHidden').val();
			quantity = 1
		}else{
			priceValue -= parseFloat($('#priceHidden').val());
			quantity -= 1
		}


		$('#quantity').val(quantity);
		$('#priceValue').val(priceValue.toFixed(2));
		$('#total').html(quantity);

	});





});
