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
            $('.container-item').append('<div class="col-md-3">'+
                '<div class="item-detail">'+
                    '<a href="#"><img class="item-img" src="'+data.data.commerces[i].image+'" style="width: 150px; height: 150px;"></a>'+
                    '<div class="item-body">'+
                        '<div class="item-name"><a href="#">'+data.data.commerces[i].name+'</a></div>'+
                        '<ul class="item-text list-inline pr-2">'+
                            '<li class="list-inline-item"><span class="price">Rp '+data.data.commerces[i].price+'</span></li>'+
                        '</ul>'+
                        '<div class="btn-group">'+
                            '<button class="btn btn-success" name="'+data.data.commerces[i].name+'" onclick="checkBuyItem(this.name);">Buy</button>'+
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
    let name = $('#add-item-name').val();
    let price = Number($('#add-item-price').val());
    let qty = Number($('#add-item-qty').val());
    let description = $('#add-item-description').val();
    let image = $('#add-item-image').val();
    $.get(address + ':3001/check-session', {}, function(data2) {    
        $.get(address + ':3000/add-item', {name: name, price: price, qty: qty, description: description, user: data2.fullname, image: image}, function(data) {
            if(data.ok == 1) {
                let user = data2.fullname;
                let query = `mutation createSingleItem($input:CommerceInput) {
                  createCommerce(input: $input) {
                    name
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
    window.location.replace(address + ":3001/commerce/edit-item.html?name="+name);
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

    fetch(address + ':3000/graphql', {
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
    let name = $('#update-item-name').val();
    let price = Number($('#update-item-price').val());
    let qty = Number($('#update-item-qty').val());
    let description = $('#update-item-description').val();
    let image = $('#update-item-image').val();

    $.get(address + ':3000/update-item', {old: oldName, name: name, price: price, qty: qty, description: description, image: image}, function(data) {
        if(data.ok == 1) {
            let itemName = oldName;
            let query = `mutation updateSingleItem($itemName:String!, $input:CommerceInput) {
                updateCommerce(name: $itemName, input: $input) {
                    name
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
    let name = $('#delete-check').html();

    $.get(address + ':3000/delete-item', {name: name}, function(data) {
        if(data.ok == 1) {
            let itemName = name;
            let query = `mutation deleteSingleItem($itemName:String!) {
                deleteCommerce(name: $itemName) {
                    name
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
                        itemName
                    }
                })
            }).then(r => r.json()).then(function(data) {
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
    let itemName = $('#buy-check').html();
    let query = `query getSingleItem($itemName: String!) {
      commerce(name: $itemName) {
        name
        price
        qty
        description
        image
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
            variables: {itemName},
        })
    }).then(r => r.json()).then(function(data) {
        let name = data.data.commerce.name;
        let price = data.data.commerce.price;
        let qty = data.data.commerce.qty-1;
        let description = data.data.commerce.description;
        let image = data.data.commerce.image;
        $.get(address + ':3001/check-session', {}, function(data){
            let patient_name = data.fullname;
            let patientName = patient_name;
            setTimeout(function() {
                $.get(address + ':3000/buy-item', {name: name, qty: qty}, function(data) {
                    if(data.ok == 1) {
                        let query = `mutation updateSingleItem($itemName:String!, $input:CommerceInput) {
                            updateCommerce(name: $itemName, input: $input) {
                                name
                            }
                        }

                        query getSingleConsult($patientName: String!) {
                            consultMed(patient_name: $patientName) {
                                doctor_name
                                patient_name
                                checkin_date
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
                                    itemName,
                                    input: {
                                        name,
                                        price,
                                        qty,
                                        description,
                                        image
                                    }
                                },
                                operationName: 'updateSingleItem'
                            })
                        }).then(r => r.json()).then(function(data) {
                            console.log(data);
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

                            let transaction_date = date + " " + month + " " + year + " @ " + hour + ":" + minute + ":" + second;
                            $.get(address + ':3000/add-transaction', {patient_name: patient_name, medicine: name, transaction_date: transaction_date, price: price}, function(data) {
                                let query = `mutation createTransaction($input:TransactionInput) {
                                    createTransaction(input: $input) {
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
                                                medicine: name,
                                                transaction_date,
                                                price
                                            }
                                        }
                                    })
                                }).then(r => r.json()).then(function(data) {
                                    console.log(data);
                                });
                            });
                        });

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
                            console.log(data);
                            if(data.data.consultMed == null) {
                                let medicine = [];
                                medicine.push(name);
                                let status = "finished";
                                $.get(address + ':3000/add-consult', {patient_name: patient_name, medicine: medicine, status: status}, function(data) {
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
                                                    medicine,
                                                    status
                                                }
                                            }
                                        })
                                    }).then(r => r.json()).then(function(data) {
                                        console.log(data);
                                        alert("Buy Item Success");
                                        window.location.replace(address + ":3001/commerce/commerce.html");
                                    });
                                });
                            }
                            else {
                                let medicine = data.data.consultMed.medicine;
                                let status = data.data.consultMed.status;
                                if(medicine) {
                                    medicine.push(name);
                                }
                                else {
                                    medicine = [];
                                    medicine.push(name);
                                }
                                let doctor_name = data.data.consultMed.doctor_name;
                                let checkin_date = data.data.consultMed.checkin_date;
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
                                        let patientName = patient_name;
                                        let prevStatus = "waitmed";
                                        let status = "finished";
                                        $.get(address + ':3000/update-status-consult', {patient_name: patient_name, status: status, prevStatus: prevStatus}, function(data) {
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