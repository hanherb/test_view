let address = 'http://' + window.location.hostname;

//menampilkan list consult pada halaman report.html
function listConsult() {
	let query = `query getAllConsult {
  		consults {
			doctor_name
	    	patient_name
	    	checkin_date
	    	consult_date
	    	status
	  	}
	}`;

	fetch(address + ':3000/graphql', {
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
	  	for(let i = 0; i < data.data.consults.length; i++) {
			let doctor_name: string = data.data.consults[i].doctor_name;
			let patient_name: string = data.data.consults[i].patient_name;
			let checkin_date: string = data.data.consults[i].checkin_date;
			let consult_date: string = data.data.consults[i].consult_date;
			let status: string = data.data.consults[i].status;
			if(doctor_name) {
				$('#tableConsult tbody').append('<tr class="tr_data">'+
					'<td>'+(i+1)+'</td>'+
					'<td>'+doctor_name+'</td>'+
					'<td>'+patient_name+'</td>'+
					'<td>'+checkin_date+'</td>'+
					'<td>'+consult_date+'</td>'+
					'<td>'+status+'</td>'+
				'</tr>');
			}
		}
		$('#tableConsult').after('<button class="btn btn-primary btn-print" name="consult" id="print-consult" onclick="startPrint(this.name)">Print</button>');
	});
}
//--

//mendapatkan data consult
function getConsult(callback) {
	let query = `query getAllConsult {
  		consults {
			doctor_name
	    	patient_name
	    	checkin_date
	    	consult_date
	    	status
	  	}
	}`;

	fetch(address + ':3000/graphql', {
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
		if(callback)
			return callback(data.data.consults);
	});
}
//--

//menampilkan list transaction pada halaman report.html
function listTransaction() {
	let query = `query getAllTransaction {
  		transactions {
			patient_name
	  		medicine
	  		transaction_date
	  		price
	  	}
	}`;

	fetch(address + ':3000/graphql', {
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
	  	for(let i = 0; i < data.data.transactions.length; i++) {
			let patient_name: string = data.data.transactions[i].patient_name;
			let medicine: string = data.data.transactions[i].medicine;
			let transaction_date: string = data.data.transactions[i].transaction_date;
			let price: number = data.data.transactions[i].price;
			$('#tableTransaction tbody').append('<tr class="tr_data">'+
				'<td>'+(i+1)+'</td>'+
				'<td>'+patient_name+'</td>'+
				'<td>'+medicine+'</td>'+
				'<td>'+price+'</td>'+
				'<td>'+transaction_date+'</td>'+
			'</tr>');
		}
		$('#tableTransaction').after('<button class="btn btn-primary btn-print" name="transaction" id="print-transaction" onclick="startPrint(this.name)">Print</button>');
	});
}
//--

//mendapatkan data transaction
function getTransaction(callback) {
	let query = `query getAllTransaction {
  		transactions {
			patient_name
	  		medicine
	  		transaction_date
	  		price
	  	}
	}`;

	fetch(address + ':3000/graphql', {
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
		if(callback)
			return callback(data.data.transactions);
	});
}
//--

//menampilkan list item pada halaman report.html
function listCommerce() {
	let query = `query getAllCommerce {
  		commerces {
			name
	  		qty
	  		price
	  	}
	}`;

	fetch(address + ':3000/graphql', {
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
			let name: string = data.data.commerces[i].name;
			let qty: number = data.data.commerces[i].qty;
			let price: number = data.data.commerces[i].price;
			$('#tableCommerce tbody').append('<tr class="tr_data">'+
				'<td>'+(i+1)+'</td>'+
				'<td>'+name+'</td>'+
				'<td>'+qty+'</td>'+
				'<td>'+price+'</td>'+
			'</tr>');
		}
		$('#tableCommerce').after('<button class="btn btn-primary btn-print" name="commerce" id="print-commerce" onclick="startPrint(this.name)">Print</button>');
	});
}
//--

//mendapatkan data commerce
function getCommerce(callback) {
	let query = `query getAllCommerce {
  		commerces {
			name
	  		qty
	  		price
	  	}
	}`;

	fetch(address + ':3000/graphql', {
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
		if(callback)
			return callback(data.data.commerces);
	});
}
//--

//menampilkan list supply pada halaman report.html
function listSupply() {
	let query = `query getAllSupply {
  		supplies {
			supplier_name
	  		medicine
	  		qty
	  		supply_date
	  	}
	}`;

	fetch(address + ':3000/graphql', {
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
	  	for(let i = 0; i < data.data.supplies.length; i++) {
			let supplier_name: string = data.data.supplies[i].supplier_name;
			let medicine: string = data.data.supplies[i].medicine;
			let qty: number = data.data.supplies[i].qty;
			let supply_date: string = data.data.supplies[i].supply_date;
			$('#tableSupply tbody').append('<tr class="tr_data">'+
				'<td>'+(i+1)+'</td>'+
				'<td>'+supplier_name+'</td>'+
				'<td>'+medicine+'</td>'+
				'<td>'+qty+'</td>'+
				'<td>'+supply_date+'</td>'+
			'</tr>');
		}
		$('#tableSupply').after('<button class="btn btn-primary btn-print" name="supply" id="print-supply" onclick="startPrint(this.name)">Print</button>');
	});
}
//--

//mendapatkan data supply
function getSupply(callback) {
	let query = `query getAllSupply {
  		supplies {
			supplier_name
	  		medicine
	  		qty
	  		supply_date
	  	}
	}`;

	fetch(address + ':3000/graphql', {
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
		if(callback)
			return callback(data.data.supplies);
	});
}
//--

//print kedalam format csv
function startPrint(name) {
	if(name == 'consult') {
		getConsult(function(result) {
			setTimeout(function() {
				downloadCSV({filename: "consult.csv", data: result});
			},2000);
		});
	}
	else if(name == 'transaction') {
		getTransaction(function(result) {
			setTimeout(function() {
				downloadCSV({filename: "transaction.csv", data: result});
			},2000);
		});
	}
	else if(name == 'commerce') {
		getCommerce(function(result) {
			setTimeout(function() {
				downloadCSV({filename: "commerce.csv", data: result});
			},2000);
		});
	}
	else if(name == 'supply') {
		getSupply(function(result) {
			setTimeout(function() {
				downloadCSV({filename: "supply.csv", data: result});
			},2000);
		});
	}
}

function convertArrayOfObjectsToCsv(args) {  
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = args.data || null;
    if (data == null || !data.length) {
        return null;
    }

    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function(item) {
        ctr = 0;
        keys.forEach(function(key) {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];
            ctr++;
        });
        result += lineDelimiter;
    });

    return 'sep=,\r\n' + result;
}

function downloadCSV(args) {
    var data, filename, link;
    var csv = convertArrayOfObjectsToCsv({
        data: args.data
    });
    if (csv == null) return;

    filename = args.filename || 'export.csv';

    if (!csv.match(/^data:text\/csv/i)) {
        csv = 'data:text/csv;charset=utf-8,' + csv;
    }
    data = encodeURI(csv);

    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
}
//--