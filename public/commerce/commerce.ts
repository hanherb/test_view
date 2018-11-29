//menampilkan list item pada halaman commerce.html
function listCommerce() {
	var query = `query getAllCommerce {
	  commerces {
	    name
	    price
	    qty
	    description
	    user
	    image
	  }
	}`;

	fetch('http://localhost:3000/graphql', {
  		method: 'POST',
	  	headers: {
	    	'Content-Type': 'application/json',
	    	'Accept': 'application/json',
	  	},
	  	body: JSON.stringify({
	    	query,
	    	variables: {},
	  	})
	}).then(r => r.json()).then(function(data) {
	  	for(let i = 0; i < data.data.commerces.length; i++) {
			$('.container-item').append('<div class="col-md-3">'+
	      		'<div class="item-detail">'+
            		'<a href="#"><img class="item-img" src="'+data.data.commerces[i].image+'" style="width: 150px; height: 150px;"></a>'+
        			'<div class="item-body">'+
              			'<div class="item-name"><a href="#">'+data.data.commerces[i].name+'</a></div>'+
              			'<ul class="item-text list-inline pr-2">'+
			                '<li class="list-inline-item"><span class="price">Rp '+data.data.commerces[i].price+'</span></li>'+
              			'</ul>'+
              			'<div class="btn-group">'+
              				'<button class="btn btn-success">Buy</button>'+
			                '<button class="btn btn-primary" name="'+data.data.commerces[i].name+'" onclick="formItem(this.name);">Edit</button>'+
			                '<button class="btn btn-danger" name="'+data.data.commerces[i].name+'" onclick="checkDeleteItem(this.name);">Delete</button>'+
              			'</div>'+
            		'</div>'+
          		'</div>'+
	        '</div>');
		}
	});
}
//--


//menambah item untuk plugin e-commerce
function addItem() {
	let name = $('#add-item-name').val() as string;
	let price = Number($('#add-item-price').val()) as number;
	let qty = Number($('#add-item-qty').val()) as number;
	let description = $('#add-item-description').val() as string;
	let image = $('#add-item-image').val() as string;

	$.get('http://localhost:3001/check-session', {}, function(data2) {	
		$.get('http://localhost:3000/add-item', {name: name, price: price, qty: qty, description: description, user: data2.fullname, image: image}, function(data) {
			if(data.ok == 1) {
				let user = data2.fullname;
				let query = `mutation createSingleItem($input:CommerceInput) {
				  createCommerce(input: $input) {
				    name
				  }
				}`;

				fetch('http://localhost:3000/graphql', {
			  		method: 'POST',
				  	headers: {
				    	'Content-Type': 'application/json',
				    	'Accept': 'application/json',
				  	},
				  	body: JSON.stringify({
	    				query,
				    	variables: {
				      		input: {
				        		name,
				        		price,
				        		qty,
				        		description,
				        		user,
				        		image
				      		}
				    	}
				  	})
				}).then(r => r.json()).then(function(data) {
					console.log(data);
				});
				alert("Add Item Success");
				window.location.replace("http://localhost:3001/commerce/commerce.html");
			}
			else {
				alert("Add Item Error");
			}
		});
	});
}
//--

//mengambil data item pada halaman commerce untuk di update dan eksekusi update
function formItem(name) {
	window.location.replace("http://localhost:3001/commerce/edit-item.html?name="+name);
}

function formItemValue() {
	let name = window.location.href.split("?name=")[1].replace(/%20/g, " ");
	let itemName = name;
	let query = `query getSingleItem($itemName: String!) {
	  commerce(name: $itemName) {
	    name
	    price
	    qty
	    description
	    image
	  }
	}`;

	fetch('http://localhost:3000/graphql', {
  		method: 'POST',
	  	headers: {
	    	'Content-Type': 'application/json',
	    	'Accept': 'application/json',
	  	},
	  	body: JSON.stringify({
	    	query,
	    	variables: {itemName},
	  	})
	}).then(r => r.json()).then(function(data) {
		console.log(data);
	  	$('#update-item-name').val(data.data.commerce.name);
		$('#update-item-price').val(data.data.commerce.price);
		$('#update-item-qty').val(data.data.commerce.qty);
		$('#update-item-description').val(data.data.commerce.description);
		$('#update-item-image').val(data.data.commerce.image);
	});
}

function updateItem() {
	let oldName = window.location.href.split("?name=")[1].replace(/%20/g, " ");
	let name = $('#update-item-name').val() as string;
	let price = Number($('#update-item-price').val()) as number;
	let qty = Number($('#update-item-qty').val()) as number;
	let description = $('#update-item-description').val() as string;
	let image = $('#update-item-image').val() as string;

	$.get('http://localhost:3000/update-item', {old: oldName, name: name, price: price, qty: qty, description: description}, function(data) {
		if(data.ok == 1) {
			let itemName = oldName;
			let query = `mutation updateSingleItem($itemName:String!, $input:CommerceInput) {
			  	updateCommerce(name: $itemName, input: $input) {
			    	name
		  		}
			}`;

			fetch('http://localhost:3000/graphql', {
		  		method: 'POST',
			  	headers: {
			    	'Content-Type': 'application/json',
			    	'Accept': 'application/json',
			  	},
			  	body: JSON.stringify({
    				query,
			    	variables: {
			    		itemName,
			      		input: {
			        		name,
			        		price,
			        		qty,
			        		description,
			        		image
			      		}
			    	}
			  	})
			}).then(r => r.json()).then(function(data) {
				console.log(data);
			});
			alert("Update Item Success");
			window.location.replace("http://localhost:3001/commerce/commerce.html");
		}
		else {
			alert("Update Item Error");
		}
	});
}
//--

//menghapus item dari halaman commerce
function checkDeleteItem(name) {
	$('#modalDeleteItem').modal('toggle');
	$('#delete-check').html(name);
}

function deleteItem() {
	let name = $('#delete-check').html() as string;

	$.get('http://localhost:3000/delete-item', {name: name}, function(data) {
		if(data.ok == 1) {
			let itemName = name;
			let query = `mutation deleteSingleItem($itemName:String!) {
			  	deleteCommerce(name: $itemName) {
			    	name
		  		}
			}`;

			fetch('http://localhost:3000/graphql', {
		  		method: 'POST',
			  	headers: {
			    	'Content-Type': 'application/json',
			    	'Accept': 'application/json',
			  	},
			  	body: JSON.stringify({
    				query,
			    	variables: {
			    		itemName
			    	}
			  	})
			}).then(r => r.json()).then(function(data) {
				console.log(data);
			});
			alert("Delete Item Success");
			window.location.replace("http://localhost:3001/commerce/commerce.html");
		}
		else {
			alert("Delete Item Error");
		}
	});
}
//--