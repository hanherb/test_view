var address = 'http://' + window.location.hostname;
//menampilkan list item pada halaman commerce.html
function listCommerce() {
    var query = "query getAllCommerce {\n\t  commerces {\n\t    name\n\t    price\n\t    qty\n\t    description\n\t    user\n\t    image\n\t  }\n\t}";
    fetch(address + ':3000/graphql', {
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
        for (var i = 0; i < data.data.commerces.length; i++) {
            $('.container-item').append('<div class="col-md-3">' +
                '<div class="item-detail">' +
                '<a href="#"><img class="item-img" src="' + data.data.commerces[i].image + '" style="width: 150px; height: 150px;"></a>' +
                '<div class="item-body">' +
                '<div class="item-name"><a href="#">' + data.data.commerces[i].name + '</a></div>' +
                '<ul class="item-text list-inline pr-2">' +
                '<li class="list-inline-item"><span class="price">Rp ' + data.data.commerces[i].price + '</span></li>' +
                '</ul>' +
                '<div class="btn-group">' +
                '<button class="btn btn-success" name="' + data.data.commerces[i].name + '" onclick="checkBuyItem(this.name);">Buy</button>' +
                '<button class="btn btn-primary" name="' + data.data.commerces[i].name + '" onclick="formItem(this.name);">Edit</button>' +
                '<button class="btn btn-danger" name="' + data.data.commerces[i].name + '" onclick="checkDeleteItem(this.name);">Delete</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>');
        }
    });
}
//--
//menambah item untuk plugin e-commerce
function addItem() {
    var name = $('#add-item-name').val();
    var price = Number($('#add-item-price').val());
    var qty = Number($('#add-item-qty').val());
    var description = $('#add-item-description').val();
    var image = $('#add-item-image').val();
    $.get(address + ':3001/check-session', {}, function (data2) {
        $.get(address + ':3000/add-item', { name: name, price: price, qty: qty, description: description, user: data2.fullname, image: image }, function (data) {
            if (data.ok == 1) {
                var user = data2.fullname;
                var query = "mutation createSingleItem($input:CommerceInput) {\n\t\t\t\t  createCommerce(input: $input) {\n\t\t\t\t    name\n\t\t\t\t  }\n\t\t\t\t}";
                fetch(address + ':3000/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        query: query,
                        variables: {
                            input: {
                                name: name,
                                price: price,
                                qty: qty,
                                description: description,
                                user: user,
                                image: image
                            }
                        }
                    })
                }).then(function (r) { return r.json(); }).then(function (data) {
                    console.log(data);
                });
                alert("Add Item Success");
                window.location.replace(address + ":3001/commerce/commerce.html");
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
    window.location.replace(address + ":3001/commerce/edit-item.html?name=" + name);
}
function formItemValue() {
    var name = window.location.href.split("?name=")[1].replace(/%20/g, " ");
    var itemName = name;
    var query = "query getSingleItem($itemName: String!) {\n\t  commerce(name: $itemName) {\n\t    name\n\t    price\n\t    qty\n\t    description\n\t    image\n\t  }\n\t}";
    fetch(address + ':3000/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            query: query,
            variables: { itemName: itemName }
        })
    }).then(function (r) { return r.json(); }).then(function (data) {
        console.log(data);
        $('#update-item-name').val(data.data.commerce.name);
        $('#update-item-price').val(data.data.commerce.price);
        $('#update-item-qty').val(data.data.commerce.qty);
        $('#update-item-description').val(data.data.commerce.description);
        $('#update-item-image').val(data.data.commerce.image);
    });
}
function updateItem() {
    var oldName = window.location.href.split("?name=")[1].replace(/%20/g, " ");
    var name = $('#update-item-name').val();
    var price = Number($('#update-item-price').val());
    var qty = Number($('#update-item-qty').val());
    var description = $('#update-item-description').val();
    var image = $('#update-item-image').val();
    $.get(address + ':3000/update-item', { old: oldName, name: name, price: price, qty: qty, description: description, image: image }, function (data) {
        if (data.ok == 1) {
            var itemName = oldName;
            var query = "mutation updateSingleItem($itemName:String!, $input:CommerceInput) {\n\t\t\t  \tupdateCommerce(name: $itemName, input: $input) {\n\t\t\t    \tname\n\t\t  \t\t}\n\t\t\t}";
            fetch(address + ':3000/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    query: query,
                    variables: {
                        itemName: itemName,
                        input: {
                            name: name,
                            price: price,
                            qty: qty,
                            description: description,
                            image: image
                        }
                    }
                })
            }).then(function (r) { return r.json(); }).then(function (data) {
                console.log(data);
            });
            alert("Update Item Success");
            window.location.replace(address + ":3001/commerce/commerce.html");
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
    var name = $('#delete-check').html();
    $.get(address + ':3000/delete-item', { name: name }, function (data) {
        if (data.ok == 1) {
            var itemName = name;
            var query = "mutation deleteSingleItem($itemName:String!) {\n\t\t\t  \tdeleteCommerce(name: $itemName) {\n\t\t\t    \tname\n\t\t  \t\t}\n\t\t\t}";
            fetch(address + ':3000/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    query: query,
                    variables: {
                        itemName: itemName
                    }
                })
            }).then(function (r) { return r.json(); }).then(function (data) {
                console.log(data);
            });
            alert("Delete Item Success");
            window.location.replace(address + ":3001/commerce/commerce.html");
        }
        else {
            alert("Delete Item Error");
        }
    });
}
//--
//melakukan pembelian item
function checkBuyItem(name) {
    $('#modalBuyItem').modal('toggle');
    $('#buy-check').html(name);
}
function buyItem() {
    var itemName = $('#buy-check').html();
    var query = "query getSingleItem($itemName: String!) {\n\t  commerce(name: $itemName) {\n\t    name\n\t    price\n\t    qty\n\t    description\n\t    image\n\t  }\n\t}";
    fetch(address + ':3000/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            query: query,
            variables: { itemName: itemName }
        })
    }).then(function (r) { return r.json(); }).then(function (data) {
        var name = data.data.commerce.name;
        var price = data.data.commerce.price;
        var qty = data.data.commerce.qty - 1;
        var description = data.data.commerce.description;
        var image = data.data.commerce.image;
        $.get(address + ':3001/check-session', {}, function (data) {
            var patient_name = data.fullname;
            var patientName = patient_name;
            setTimeout(function () {
                $.get(address + ':3000/buy-item', { name: name, qty: qty }, function (data) {
                    if (data.ok == 1) {
                        var query_1 = "mutation updateSingleItem($itemName:String!, $input:CommerceInput) {\n\t\t\t\t\t\t  \tupdateCommerce(name: $itemName, input: $input) {\n\t\t\t\t\t\t    \tname\n\t\t\t\t\t  \t\t}\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tquery getSingleConsult($patientName: String!) {\n\t\t\t\t\t  \t\tconsultMed(patient_name: $patientName) {\n\t\t\t\t\t\t\t\tdoctor_name\n\t\t\t\t\t\t    \tpatient_name\n\t\t\t\t\t\t    \tcheckin_date\n\t\t\t\t\t\t    \tmedicine\n\t\t\t\t\t\t    \tstatus\n\t\t\t\t\t\t  \t}\n\t\t\t\t\t\t}";
                        fetch(address + ':3000/graphql', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            },
                            body: JSON.stringify({
                                query: query_1,
                                variables: {
                                    itemName: itemName,
                                    input: {
                                        name: name,
                                        price: price,
                                        qty: qty,
                                        description: description,
                                        image: image
                                    }
                                },
                                operationName: 'updateSingleItem'
                            })
                        }).then(function (r) { return r.json(); }).then(function (data) {
                            console.log(data);
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
                            var transaction_date = date + " " + month + " " + year + " @ " + hour + ":" + minute + ":" + second;
                            $.get(address + ':3000/add-transaction', { patient_name: patient_name, medicine: name, transaction_date: transaction_date, price: price }, function (data) {
                                var query = "mutation createTransaction($input:TransactionInput) {\n\t\t\t\t\t\t\t\t  \tcreateTransaction(input: $input) {\n\t\t\t\t\t\t\t\t    \tpatient_name\n\t\t\t\t\t\t\t  \t\t}\n\t\t\t\t\t\t\t\t}";
                                fetch(address + ':3000/graphql', {
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
                                                medicine: name,
                                                transaction_date: transaction_date,
                                                price: price
                                            }
                                        }
                                    })
                                }).then(function (r) { return r.json(); }).then(function (data) {
                                    console.log(data);
                                });
                            });
                        });
                        fetch(address + ':3000/graphql', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            },
                            body: JSON.stringify({
                                query: query_1,
                                variables: {
                                    patientName: patientName
                                },
                                operationName: 'getSingleConsult'
                            })
                        }).then(function (r) { return r.json(); }).then(function (data) {
                            console.log(data);
                            if (data.data.consultMed == null) {
                                var medicine_1 = [];
                                medicine_1.push(name);
                                var status_1 = "finished";
                                $.get(address + ':3000/add-consult', { patient_name: patient_name, medicine: medicine_1, status: status_1 }, function (data) {
                                    var query = "mutation createConsult($input:ConsultInput) {\n\t\t\t\t\t\t\t\t\t  \tcreateConsult(input: $input) {\n\t\t\t\t\t\t\t\t\t    \tpatient_name\n\t\t\t\t\t\t\t\t  \t\t}\n\t\t\t\t\t\t\t\t\t}";
                                    fetch(address + ':3000/graphql', {
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
                                                    medicine: medicine_1,
                                                    status: status_1
                                                }
                                            }
                                        })
                                    }).then(function (r) { return r.json(); }).then(function (data) {
                                        console.log(data);
                                        alert("Buy Item Success");
                                        window.location.replace(address + ":3001/commerce/commerce.html");
                                    });
                                });
                            }
                            else {
                                var medicine_2 = data.data.consultMed.medicine;
                                var status_2 = data.data.consultMed.status;
                                if (medicine_2) {
                                    medicine_2.push(name);
                                }
                                else {
                                    medicine_2 = [];
                                    medicine_2.push(name);
                                }
                                var doctor_name_1 = data.data.consultMed.doctor_name;
                                var checkin_date_1 = data.data.consultMed.checkin_date;
                                $.get(address + ':3000/update-specific-consult', { patient_name: patient_name, doctor_name: doctor_name_1, checkin_date: checkin_date_1, medicine: medicine_2, status: status_2 }, function (data) {
                                    var query = "mutation updateSingleConsult($patientName:String!, $input:ConsultInput) {\n\t\t\t\t\t\t\t\t\t  \tupdateConsult(patient_name: $patientName, input: $input) {\n\t\t\t\t\t\t\t\t\t    \tpatient_name\n\t\t\t\t\t\t\t\t  \t\t}\n\t\t\t\t\t\t\t\t\t}";
                                    fetch(address + ':3000/graphql', {
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
                                                    doctor_name: doctor_name_1,
                                                    checkin_date: checkin_date_1,
                                                    medicine: medicine_2,
                                                    status: status_2
                                                }
                                            }
                                        })
                                    }).then(function (r) { return r.json(); }).then(function (data) {
                                        console.log(data);
                                        var patientName = patient_name;
                                        console.log(patient_name);
                                        var prevStatus = "waitmed";
                                        var status = "finished";
                                        $.get(address + ':3000/update-status-consult', { patient_name: patient_name, status: status, prevStatus: prevStatus }, function (data) {
                                            var query = "mutation updateSingleConsult($patientName:String!, $input:ConsultInput) {\n\t\t\t\t\t\t\t\t\t\t\t  \tupdateConsult(patient_name: $patientName, input: $input) {\n\t\t\t\t\t\t\t\t\t\t\t    \tpatient_name\n\t\t\t\t\t\t\t\t\t\t  \t\t}\n\t\t\t\t\t\t\t\t\t\t\t}";
                                            fetch(address + ':3000/graphql', {
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
                                                            status: status
                                                        }
                                                    }
                                                })
                                            }).then(function (r) { return r.json(); }).then(function (data) {
                                                console.log(data);
                                                alert("Buy Item Success");
                                                window.location.replace(address + ":3001/commerce/commerce.html");
                                            });
                                        });
                                    });
                                });
                            }
                        });
                    }
                    else {
                        alert("Buy Item Error");
                    }
                });
            }, 50);
        });
    });
}
//--
