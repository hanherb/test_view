//menampilkan list doctor pada halaman consult.html
function listDoctor() {
	let query = `query getAllUser {
  		users {
			fullname
	    	email
	    	role
	    	authority {
	      		user {
	        		read
			        create
			        update
			        delete
	      		}
		    	api {
		        	user
		        	plugin
	      		}
	    	}
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
		let count = 0;
	  	for(let i = 0; i < data.data.users.length; i++) {
			let fullname: string = data.data.users[i].fullname;
			let email: string = data.data.users[i].email;
			let role: string = data.data.users[i].role;
			if(role == 'doctor') {
				count++;
				$('#tableDoctor tbody').append('<tr class="tr_data">'+
					'<td>'+count+'</td>'+
					'<td>'+fullname+'</td>'+
					'<td>'+role+'</td>'+
					'<td><button class="btn btn-primary" name="'+email+'" onclick="checkConsultDoctor(this.name);">Consult</button>'+
				'</tr>');
			}
		}
	});
}
//--

//menampilkan list patient pada halaman list-consult.html
function listPatient() {
	let query = `query getAllConsult {
  		consults {
			doctor_name
	    	patient_name
	    	fulldate
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
		let count = 0;
	  	for(let i = 0; i < data.data.consults.length; i++) {
			let doctor_name: string = data.data.consults[i].doctor_name;
			let patient_name: string = data.data.consults[i].patient_name;
			let fulldate: string = data.data.consults[i].fulldate;
			$.get('http://localhost:3001/check-session', {}, function(data2) {
				if(doctor_name == data2.fullname) {
					count++;
					$('#tablePatient tbody').append('<tr class="tr_data">'+
						'<td>'+count+'</td>'+
						'<td>'+patient_name+'</td>'+
						'<td>'+fulldate+'</td>'+
					'</tr>');
				}
			});
		}
	});
}
//

//menampilkan semua list konsultasi pada halaman admin-consult.html
function listConsult() {
	let query = `query getAllConsult {
  		consults {
			doctor_name
	    	patient_name
	    	fulldate
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
	  	for(let i = 0; i < data.data.consults.length; i++) {
			let doctor_name: string = data.data.consults[i].doctor_name;
			let patient_name: string = data.data.consults[i].patient_name;
			let fulldate: string = data.data.consults[i].fulldate;
			$('#tablePatient tbody').append('<tr class="tr_data">'+
				'<td>'+(i+1)+'</td>'+
				'<td>'+doctor_name+'</td>'+
				'<td>'+patient_name+'</td>'+
				'<td>'+fulldate+'</td>'+
			'</tr>');
		}
	});
}
//--

//memilih dokter untuk konsultasi
function checkConsultDoctor(name) {
	$('#modalConsult').modal('toggle');
	let userEmail = name;
	let query = `query getSingleUser($userEmail: String!) {
	    user(email: $userEmail) {
    		fullname
	        email
	        role
	    		authority {
	          user {
	            read
	            create
	            update
	            delete
	          }
	        	api {
	            user
	            plugin
	          }
	        }
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
	    		userEmail
	    	},
	  	})
	}).then(r => r.json()).then(function(data) {
		$('#consult-check').html(data.data.user.fullname);
	});
}

function consultDoctor() {
	$.get('http://localhost:3001/check-session', {}, function(data) {
		let doctor_name = $('#consult-check').html() as string;
		let patient_name = data.fullname;
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

		let fulldate = date + " " + month + " " + year + " @ " + hour + ":" + minute + ":" + second;
		
		let patientName = patient_name;
		let query = `query getSingleConsult($patientName: String!) {
	  		consult(patient_name: $patientName) {
				doctor_name
		    	patient_name
		    	fulldate
		    	medicine
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
		    		patientName
		    	},
		    	operationName: 'getSingleConsult'
		  	})
		}).then(r => r.json()).then(function(data) {
			if(data.data.consult == null) {
				$.get('http://localhost:3000/add-consult', {patient_name: patient_name, doctor_name: doctor_name, fulldate: fulldate}, function(data) {
					let query = `mutation createConsult($input:ConsultInput) {
					  	createConsult(input: $input) {
					    	patient_name
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
					      			patient_name,
					        		doctor_name,
					        		fulldate
					      		}
					    	}
					  	})
					}).then(r => r.json()).then(function(data) {
						console.log(data);
					});
					alert("Add Consult Success");
					window.location.replace("http://localhost:3001/consult/consult.html");
				});
			}
			else {
				$.get('http://localhost:3000/update-consult', {patient_name: patient_name, doctor_name: doctor_name, fulldate: fulldate, medicine: data.data.consult.medicine}, function(data) {
					let query = `mutation updateSingleConsult($patientName:String!, $input:ConsultInput) {
					  	updateConsult(patient_name: $patientName, input: $input) {
					    	patient_name
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
					    		patientName,
					      		input: {
					      			patient_name,
					        		doctor_name,
					        		fulldate
					      		}
					    	}
					  	})
					}).then(r => r.json()).then(function(data) {
						console.log(data);
					});
					alert("Update Consult Success");
					window.location.replace("http://localhost:3001/consult/consult.html");
				});
			}
		});
	});
}
//--