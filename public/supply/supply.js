var address = 'http://' + window.location.hostname;
//menampilkan list item pada halaman supply.html
function listSupply() {
    var query = "query getAllCommerce {\n\t  commerces {\n\t    name\n\t    qty\n\t    image\n\t  }\n\t}";
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
            var medicine = data.data.commerces[i].name;
            var qty = data.data.commerces[i].qty;
            $('#tableSupply .table-body').append('<tr class="tr_data">' +
                '<td>' + (i + 1) + '</td>' +
                '<td>' + medicine + '</td>' +
                '<td>' + qty + '</td>' +
                '<td><input type="number" id="add-qty-' + medicine + '"></td>' +
                '<td><button class="btn btn-primary" name="' + medicine + '" onclick="addSupply(this.name);">Supply</button>' +
                '</tr>');
        }
    });
}
//--
//menambah supply barang
function addSupply(name) {
    var medicine = name;
    var qty = Number($('#add-qty-' + name).val());
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
    var supply_date = date + " " + month + " " + year + " @ " + hour + ":" + minute + ":" + second;
    $.get(address + ':3001/check-session', {}, function (data2) {
        var supplier_name = data2.fullname;
        $.get(address + ':3000/add-supply', { supplier_name: supplier_name, medicine: medicine, qty: qty, supply_date: supply_date }, function (data) {
            if (data.ok == 1) {
                var query = "mutation createSingleSupply($input:SupplyInput) {\n\t\t\t\t  createSupply(input: $input) {\n\t\t\t\t    supplier_name\n\t\t\t\t  }\n\t\t\t\t}";
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
                                supplier_name: supplier_name,
                                medicine: medicine,
                                qty: qty,
                                supply_date: supply_date
                            }
                        }
                    })
                }).then(function (r) { return r.json(); }).then(function (data) {
                    console.log(data);
                    var query = "query getSingleCommerce($medicine: String!) {\n\t\t\t\t\t  \tcommerce(name: $medicine) {\n\t\t\t\t\t    \tname\n\t\t\t\t\t\t    qty\n\t\t\t\t\t  \t}\n\t\t\t\t\t}";
                    fetch(address + ':3000/graphql', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            query: query,
                            variables: {
                                medicine: medicine
                            }
                        })
                    }).then(function (r) { return r.json(); }).then(function (data) {
                        console.log(data);
                        if (data.data.commerce.name) {
                            var totalQty_1 = data.data.commerce.qty + qty;
                            $.get(address + ':3000/item-supplied', { medicine: medicine, qty: totalQty_1 }, function (data) {
                                if (data.ok == 1) {
                                    var query_1 = "mutation updateSingleItem($itemName:String!, $input:CommerceInput) {\n\t\t\t\t\t\t\t\t\t  \tupdateCommerce(name: $itemName, input: $input) {\n\t\t\t\t\t\t\t\t\t    \tname\n\t\t\t\t\t\t\t\t  \t\t}\n\t\t\t\t\t\t\t\t\t}";
                                    fetch(address + ':3000/graphql', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Accept': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            query: query_1,
                                            variables: {
                                                itemName: medicine,
                                                input: {
                                                    qty: totalQty_1
                                                }
                                            }
                                        })
                                    }).then(function (r) { return r.json(); }).then(function (data) {
                                        console.log(data);
                                        alert("Update Supplied Item Success");
                                        window.location.replace(address + ":3001/supply/supply.html");
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
