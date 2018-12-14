//menampilkan list doctor pada halaman consult.html
function listDoctor() {
    var query = "query getAllUser {\n  \t\tusers {\n\t\t\tfullname\n\t    \temail\n\t    \trole\n\t    \tauthority {\n\t      \t\tuser {\n\t        \t\tread\n\t\t\t        create\n\t\t\t        update\n\t\t\t        delete\n\t      \t\t}\n\t\t    \tapi {\n\t\t        \tuser\n\t\t        \tplugin\n\t      \t\t}\n\t    \t}\n\t  \t}\n\t}";
    fetch('http://localhost:3000/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            query: query,
            variables: {}
        })
    }).then(function (r) { return r.json(); }).then(function (data) {
        var count = 0;
        for (var i = 0; i < data.data.users.length; i++) {
            var fullname = data.data.users[i].fullname;
            var email = data.data.users[i].email;
            var role = data.data.users[i].role;
            if (role == 'doctor') {
                count++;
                $('#tableDoctor tbody').append('<tr class="tr_data">' +
                    '<td>' + count + '</td>' +
                    '<td>' + fullname + '</td>' +
                    '<td>' + role + '</td>' +
                    '<td><button class="btn btn-primary" name="' + email + '" onclick="checkConsultDoctor(this.name);">Consult</button>' +
                    '</tr>');
            }
        }
    });
}
//--
//menampilkan list patient pada halaman list-consult.html
function listPatient() {
    var query = "query getAllConsult {\n  \t\tconsults {\n\t\t\tdoctor_name\n\t    \tpatient_name\n\t    \tfulldate\n\t  \t}\n\t}";
    fetch('http://localhost:3000/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            query: query,
            variables: {}
        })
    }).then(function (r) { return r.json(); }).then(function (data) {
        var count = 0;
        var _loop_1 = function (i) {
            var doctor_name = data.data.consults[i].doctor_name;
            var patient_name = data.data.consults[i].patient_name;
            var fulldate = data.data.consults[i].fulldate;
            $.get('http://localhost:3001/check-session', {}, function (data2) {
                if (doctor_name == data2.fullname) {
                    count++;
                    $('#tablePatient tbody').append('<tr class="tr_data">' +
                        '<td>' + count + '</td>' +
                        '<td>' + patient_name + '</td>' +
                        '<td>' + fulldate + '</td>' +
                        '</tr>');
                }
            });
        };
        for (var i = 0; i < data.data.consults.length; i++) {
            _loop_1(i);
        }
    });
}
//
//menampilkan semua list konsultasi pada halaman admin-consult.html
function listConsult() {
    var query = "query getAllConsult {\n  \t\tconsults {\n\t\t\tdoctor_name\n\t    \tpatient_name\n\t    \tfulldate\n\t  \t}\n\t}";
    fetch('http://localhost:3000/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            query: query,
            variables: {}
        })
    }).then(function (r) { return r.json(); }).then(function (data) {
        for (var i = 0; i < data.data.consults.length; i++) {
            var doctor_name = data.data.consults[i].doctor_name;
            var patient_name = data.data.consults[i].patient_name;
            var fulldate = data.data.consults[i].fulldate;
            $('#tablePatient tbody').append('<tr class="tr_data">' +
                '<td>' + (i + 1) + '</td>' +
                '<td>' + doctor_name + '</td>' +
                '<td>' + patient_name + '</td>' +
                '<td>' + fulldate + '</td>' +
                '</tr>');
        }
    });
}
//--
//memilih dokter untuk konsultasi
function checkConsultDoctor(name) {
    $('#modalConsult').modal('toggle');
    var userEmail = name;
    var query = "query getSingleUser($userEmail: String!) {\n\t    user(email: $userEmail) {\n    \t\tfullname\n\t        email\n\t        role\n\t    \t\tauthority {\n\t          user {\n\t            read\n\t            create\n\t            update\n\t            delete\n\t          }\n\t        \tapi {\n\t            user\n\t            plugin\n\t          }\n\t        }\n\t    }\n\t}";
    fetch('http://localhost:3000/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            query: query,
            variables: {
                userEmail: userEmail
            }
        })
    }).then(function (r) { return r.json(); }).then(function (data) {
        $('#consult-check').html(data.data.user.fullname);
    });
}
function consultDoctor() {
    $.get('http://localhost:3001/check-session', {}, function (data) {
        var doctor_name = $('#consult-check').html();
        var patient_name = data.fullname;
        var currentdate = new Date();
        var date = currentdate.getDate();
        var monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        var month = monthNames[(currentdate.getMonth())];
        var year = currentdate.getFullYear();
        var second = currentdate.getSeconds();
        var minute = currentdate.getMinutes();
        var hour = currentdate.getHours();
        var fulldate = date + " " + month + " " + year + " @ " + hour + ":" + minute + ":" + second;
        var patientName = patient_name;
        var query = "query getSingleConsult($patientName: String!) {\n\t  \t\tconsult(patient_name: $patientName) {\n\t\t\t\tdoctor_name\n\t\t    \tpatient_name\n\t\t    \tfulldate\n\t\t    \tmedicine\n\t\t    \tstatus\n\t\t  \t}\n\t\t}";
        fetch('http://localhost:3000/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                query: query,
                variables: {
                    patientName: patientName
                },
                operationName: 'getSingleConsult'
            })
        }).then(function (r) { return r.json(); }).then(function (data) {
            if (data.data.consult == null) {
                var status_1 = "pending";
                $.get('http://localhost:3000/add-consult', { patient_name: patient_name, doctor_name: doctor_name, fulldate: fulldate, status: status_1 }, function (data) {
                    var query = "mutation createConsult($input:ConsultInput) {\n\t\t\t\t\t  \tcreateConsult(input: $input) {\n\t\t\t\t\t    \tpatient_name\n\t\t\t\t  \t\t}\n\t\t\t\t\t}";
                    fetch('http://localhost:3000/graphql', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            query: query,
                            variables: {
                                input: {
                                    patient_name: patient_name,
                                    doctor_name: doctor_name,
                                    fulldate: fulldate,
                                    status: status_1
                                }
                            }
                        })
                    }).then(function (r) { return r.json(); }).then(function (data) {
                        console.log(data);
                    });
                    alert("Add Consult Success");
                    window.location.replace("http://localhost:3001/consult/consult.html");
                });
            }
            else {
                var medicine_1 = data.data.consult.medicine;
                var status_2 = data.data.consult.status;
                $.get('http://localhost:3000/update-consult', { patient_name: patient_name, doctor_name: doctor_name, fulldate: fulldate, medicine: medicine_1, status: status_2 }, function (data) {
                    var query = "mutation updateSingleConsult($patientName:String!, $input:ConsultInput) {\n\t\t\t\t\t  \tupdateConsult(patient_name: $patientName, input: $input) {\n\t\t\t\t\t    \tpatient_name\n\t\t\t\t  \t\t}\n\t\t\t\t\t}";
                    fetch('http://localhost:3000/graphql', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            query: query,
                            variables: {
                                patientName: patientName,
                                input: {
                                    patient_name: patient_name,
                                    doctor_name: doctor_name,
                                    fulldate: fulldate,
                                    medicine: medicine_1,
                                    status: status_2
                                }
                            }
                        })
                    }).then(function (r) { return r.json(); }).then(function (data) {
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
