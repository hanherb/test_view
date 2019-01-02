let address = 'http://' + window.location.hostname;

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
		            blog
		            commerce
		            consult
		            supply
		            report
	      		}
	    	}
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
	    	checkin_date
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
		let count = 0;
	  	for(let i = 0; i < data.data.consults.length; i++) {
			let doctor_name: string = data.data.consults[i].doctor_name;
			let patient_name: string = data.data.consults[i].patient_name;
			let checkin_date: string = data.data.consults[i].checkin_date;
			let status: string = data.data.consults[i].status;
			let action: string;
			if(data.data.consults[i].status == "pending") {
				action = "<button class='btn btn-primary' name='"+patient_name+"' onclick='consultStart(this.name);'>Consult</button>";
			}
			else if(data.data.consults[i].status == "ongoing") {
				action = "<button class='btn btn-success' name='"+patient_name+"' onclick='consultEnd(this.name);'>Wait Medicine</button>";
			}
			else if(data.data.consults[i].status == "waitmed") {
				action = "<button class='btn btn-success' name='"+patient_name+"' onclick='medEnd(this.name);'>Finish</button>";
			}
			$.get(address + ':3001/check-session', {}, function(data2) {
				if(data.data.consults[i].status != "finished") {
					if(doctor_name == data2.fullname) {
						count++;
						$('#tablePatient tbody').append('<tr class="tr_data">'+
							'<td>'+count+'</td>'+
							'<td>'+patient_name+'</td>'+
							'<td>'+checkin_date+'</td>'+
							'<td>'+status+'</td>'+
							'<td>'+action+'</td>'+
						'</tr>');
					}
				}
			});
		}
	});
}
//

//memulai konsultasi
function consultStart(name) {
	let patientName: string = name;
	let prevStatus: string = "pending";
	let status: string = "ongoing";
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

	let consult_date = date + " " + month + " " + year + " @ " + hour + ":" + minute + ":" + second;

	$.get(address + ':3000/update-status-consult', {patient_name: name, status: status, prevStatus: prevStatus}, function(data) {
		let query = `mutation updateSingleConsult($patientName:String!, $input:ConsultInput) {
		  	updateConsult(patient_name: $patientName, input: $input) {
		    	patient_name
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
		    	variables: {
		    		patientName,
		      		input: {
		        		status
		      		}
		    	}
		  	})
		}).then(r => r.json()).then(function(data) {
			console.log(data);
		});
		$.get(address + ':3000/add-consult-date', {patient_name: name, consult_date: consult_date, status: status}, function(data) {
			let query = `mutation updateSingleConsult($patientName:String!, $input:ConsultInput) {
			  	updateConsult(patient_name: $patientName, input: $input) {
			    	patient_name
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
			    	variables: {
			    		patientName,
			      		input: {
			        		consult_date
			      		}
			    	}
			  	})
			}).then(r => r.json()).then(function(data) {
				console.log(data);
			});
		});
		alert("Update Consult Success");
		window.location.replace(address + ":3001/consult/list-consult.html");
	});
}
//

//mengakhiri konsultasi
function consultEnd(name) {
	let patientName: string = name;
	let prevStatus: string = "ongoing";
	let status: string = "waitmed";
	$.get(address + ':3000/update-status-consult', {patient_name: name, status: status, prevStatus: prevStatus}, function(data) {
		let query = `mutation updateSingleConsult($patientName:String!, $input:ConsultInput) {
		  	updateConsult(patient_name: $patientName, input: $input) {
		    	patient_name
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
		    	variables: {
		    		patientName,
		      		input: {
		        		status
		      		}
		    	}
		  	})
		}).then(r => r.json()).then(function(data) {
			console.log(data);
		});
		alert("Update Consult Success");
		window.location.replace(address + ":3001/consult/list-consult.html");
	});
}
//

//mengakhiri pembelian obat pasien
function medEnd(name) {
	let patientName: string = name;
	let prevStatus: string = "waitmed";
	let status: string = "finished";
	$.get(address + ':3000/update-status-consult', {patient_name: name, status: status, prevStatus: prevStatus}, function(data) {
		let query = `mutation updateSingleConsult($patientName:String!, $input:ConsultInput) {
		  	updateConsult(patient_name: $patientName, input: $input) {
		    	patient_name
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
		    	variables: {
		    		patientName,
		      		input: {
		        		status
		      		}
		    	}
		  	})
		}).then(r => r.json()).then(function(data) {
			console.log(data);
		});
		alert("Update Consult Success");
		window.location.replace(address + ":3001/consult/list-consult.html");
	});
}
//

//menampilkan semua list konsultasi pada halaman admin-consult.html
function listConsult() {
	let query = `query getAllConsult {
  		consults {
			doctor_name
	    	patient_name
	    	checkin_date
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
			let status: string = data.data.consults[i].status;
			if(doctor_name) {
				$('#tablePatient tbody').append('<tr class="tr_data">'+
					'<td>'+(i+1)+'</td>'+
					'<td>'+doctor_name+'</td>'+
					'<td>'+patient_name+'</td>'+
					'<td>'+checkin_date+'</td>'+
					'<td>'+status+'</td>'+
				'</tr>');
			}
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
	            blog
	            commerce
	            consult
	            supply
	            report
	          }
	        }
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
	    	variables: {
	    		userEmail
	    	},
	  	})
	}).then(r => r.json()).then(function(data) {
		$('#consult-check').html(data.data.user.fullname);
	});
}

function consultDoctor() {
	$.get(address + ':3001/check-session', {}, function(data) {
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

		let checkin_date = date + " " + month + " " + year + " @ " + hour + ":" + minute + ":" + second;
		
		let patientName = patient_name;
		let query = `query getSingleConsult($patientName: String!) {
	  		consultPending(patient_name: $patientName) {
				doctor_name
		    	patient_name
		    	checkin_date
		    	consult_date
		    	medicine
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
		    	variables: {
		    		patientName
		    	},
		    	operationName: 'getSingleConsult'
		  	})
		}).then(r => r.json()).then(function(data) {
			if(data.data.consultPending == null) {
				let status = "pending";
				let consult_date = null;
				$.get(address + ':3000/add-consult', {patient_name: patient_name, doctor_name: doctor_name, checkin_date: checkin_date, status: status}, function(data) {
					let query = `mutation createConsult($input:ConsultInput) {
					  	createConsult(input: $input) {
					    	patient_name
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
					    	variables: {
					      		input: {
					      			patient_name,
					        		doctor_name,
					        		checkin_date,
					        		consult_date,
					        		status
					      		}
					    	}
					  	})
					}).then(r => r.json()).then(function(data) {
						console.log(data);
					});
					alert("Add Consult Success");
					window.location.replace(address + ":3001/consult/consult.html");
				});
			}
			else {
				let medicine = data.data.consultPending.medicine;
				let status = data.data.consultPending.status;
				$.get(address + ':3000/update-specific-consult', {patient_name: patient_name, doctor_name: doctor_name, checkin_date: checkin_date, medicine: medicine, status: status}, function(data) {
					let query = `mutation updateSingleConsult($patientName:String!, $input:ConsultInput) {
					  	updateConsult(patient_name: $patientName, input: $input) {
					    	patient_name
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
					    	variables: {
					    		patientName,
					      		input: {
					      			patient_name,
					        		doctor_name,
					        		checkin_date,
					        		medicine,
					        		status
					      		}
					    	}
					  	})
					}).then(r => r.json()).then(function(data) {
						console.log(data);
					});
					alert("Update Consult Success");
					window.location.replace(address + ":3001/consult/consult.html");
				});
			}
		});
	});
}
//--