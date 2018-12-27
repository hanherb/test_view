//menampilkan list item pada halaman supply.html
function listSupply() {
	var query = `query getAllCommerce {
	  commerces {
	    name
	    qty
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
			let medicine: string = data.data.commerces[i].name;
			let qty: number = data.data.commerces[i].qty;
			$('#tableSupply .table-body').append('<tr class="tr_data">'+
				'<td>'+(i+1)+'</td>'+
				'<td>'+medicine+'</td>'+
				'<td>'+qty+'</td>'+
				'<td><input type="number" id="add-qty-'+medicine+'"></td>'+
				'<td><button class="btn btn-primary" name="'+medicine+'" onclick="addSupply(this.name);">Supply</button>'+
			'</tr>');
		}
	});
}
//--

//menambah supply barang
function addSupply(name) {
	let medicine = name;
	let qty = Number($('#add-qty-'+name).val()) as number;
	let currentdate = new Date();
	let date = currentdate.getDate();
	const monthNames = ["January", "February", "March", "April", "May", "June",
	  "July", "August", "September", "October", "November", "December"
	];
	let month = monthNames[(currentdate.getMonth())];
	let year = currentdate.getFullYear();
	let second = currentdate.getSeconds();
	let minute = currentdate.getMinutes();
	let hour = currentdate.getHours();

	let supply_date = date + " " + month + " " + year + " @ " + hour + ":" + minute + ":" + second;

	$.get('http://localhost:3001/check-session', {}, function(data2) {	
		let supplier_name = data2.fullname;
		$.get('http://localhost:3000/add-supply', {supplier_name: supplier_name, medicine: medicine, qty: qty, supply_date: supply_date}, function(data) {
			if(data.ok == 1) {
				let query = `mutation createSingleSupply($input:SupplyInput) {
				  createSupply(input: $input) {
				    supplier_name
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
				        		supplier_name,
						  		medicine,
						  		qty,
						  		supply_date
				      		}
				    	}
				  	})
				}).then(r => r.json()).then(function(data) {
					console.log(data);
					var query = `query getSingleCommerce($medicine: String!) {
					  	commerce(name: $medicine) {
					    	name
						    qty
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
					    		medicine
					    	},
					  	})
					}).then(r => r.json()).then(function(data) {
						console.log(data);
						if(data.data.commerce.name) {
							let totalQty = data.data.commerce.qty + qty;
							$.get('http://localhost:3000/item-supplied', {medicine: medicine, qty: totalQty}, function(data) {
								if(data.ok == 1) {
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
									    		itemName: medicine,
									      		input: {
									        		qty: totalQty
									      		}
									    	}
									  	})
									}).then(r => r.json()).then(function(data) {
										console.log(data);
										alert("Update Supplied Item Success");
										window.location.replace("http://localhost:3001/supply/supply.html");
									});
								}
								else {
									alert("Update Supplied Item Error");
								}
							});
						}
						else {
							alert("No item found");
						}
					});
				});
			}
			else {
				alert("Add Supply Error");
			}
		});
	});
}
//--