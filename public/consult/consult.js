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
        $.get('http://localhost:3000/add-consult', { doctor_name: doctor_name, patient_name: patient_name, fulldate: fulldate }, function (data) {
            if (data.ok == 1) {
                var query = "mutation createSingleConsult($input:ConsultInput) {\n\t\t\t\t  createConsult(input: $input) {\n\t\t\t\t    doctor_name\n\t\t\t\t  }\n\t\t\t\t}";
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
                                doctor_name: doctor_name,
                                patient_name: patient_name,
                                fulldate: fulldate
                            }
                        }
                    })
                }).then(function (r) { return r.json(); }).then(function (data) {
                    console.log(data);
                });
                alert("Add Consult Success");
                window.location.replace("http://localhost:3001/consult/consult.html");
            }
            else {
                alert("Add Consult Error");
            }
        });
    });
}
//--
