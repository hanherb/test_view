//menampilkan list item pada halaman commerce.html
function listCommerce() {
    var query = "query getAllCommerce {\n\t  commerces {\n\t    name\n\t    price\n\t    qty\n\t    description\n\t    user\n\t    image\n\t  }\n\t}";
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
//menampilkan saldo user
function showBalance() {
    $.get('http://localhost:3001/check-session', {}, function (data) {
        setTimeout(function () {
            if (data.email) {
                $('#balance').html(data.balance);
            }
            else {
                $('#balance').html("N/A");
            }
        }, 50);
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
    $.get('http://localhost:3001/check-session', {}, function (data2) {
        $.get('http://localhost:3000/add-item', { name: name, price: price, qty: qty, description: description, user: data2.fullname, image: image }, function (data) {
            if (data.ok == 1) {
                var user = data2.fullname;
                var query = "mutation createSingleItem($input:CommerceInput) {\n\t\t\t\t  createCommerce(input: $input) {\n\t\t\t\t    name\n\t\t\t\t  }\n\t\t\t\t}";
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
    window.location.replace("http://localhost:3001/commerce/edit-item.html?name=" + name);
}
function formItemValue() {
    var name = window.location.href.split("?name=")[1].replace(/%20/g, " ");
    var itemName = name;
    var query = "query getSingleItem($itemName: String!) {\n\t  commerce(name: $itemName) {\n\t    name\n\t    price\n\t    qty\n\t    description\n\t    image\n\t  }\n\t}";
    fetch('http://localhost:3000/graphql', {
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
    $.get('http://localhost:3000/update-item', { old: oldName, name: name, price: price, qty: qty, description: description, image: image }, function (data) {
        if (data.ok == 1) {
            var itemName = oldName;
            var query = "mutation updateSingleItem($itemName:String!, $input:CommerceInput) {\n\t\t\t  \tupdateCommerce(name: $itemName, input: $input) {\n\t\t\t    \tname\n\t\t  \t\t}\n\t\t\t}";
            fetch('http://localhost:3000/graphql', {
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
    var name = $('#delete-check').html();
    $.get('http://localhost:3000/delete-item', { name: name }, function (data) {
        if (data.ok == 1) {
            var itemName = name;
            var query = "mutation deleteSingleItem($itemName:String!) {\n\t\t\t  \tdeleteCommerce(name: $itemName) {\n\t\t\t    \tname\n\t\t  \t\t}\n\t\t\t}";
            fetch('http://localhost:3000/graphql', {
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
            window.location.replace("http://localhost:3001/commerce/commerce.html");
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
    fetch('http://localhost:3000/graphql', {
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
        $.get('http://localhost:3001/check-session', {}, function (data) {
            if (data.balance - price < 0) {
                alert("You don't have enough balance");
                window.location.replace("http://localhost:3001/commerce/commerce.html");
            }
            else {
                var email_1 = data.email;
                var balance_1 = data.balance - price;
                data.balance = balance_1;
                $.get('http://localhost:3001/assign-session', { data: data }, function (data) {
                    setTimeout(function () {
                        $.get('http://localhost:3000/buy-item', { name: name, qty: qty, email: email_1, balance: balance_1 }, function (data) {
                            if (data.ok == 1) {
                                var query_1 = "mutation updateSingleItem($itemName:String!, $input:CommerceInput) {\n\t\t\t\t\t\t\t\t  \tupdateCommerce(name: $itemName, input: $input) {\n\t\t\t\t\t\t\t\t    \tname\n\t\t\t\t\t\t\t  \t\t}\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\tmutation updateSingleUser($userEmail:String!, $input:PersonInput) {\n\t\t\t\t\t\t\t\t  \tupdateUser(email: $userEmail, input: $input) {\n\t\t\t\t\t\t\t\t    \tfullname\n\t\t\t\t\t\t\t  \t\t}\n\t\t\t\t\t\t\t\t}";
                                fetch('http://localhost:3000/graphql', {
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
                                        operationName: "updateSingleItem"
                                    })
                                }).then(function (r) { return r.json(); }).then(function (data) {
                                    console.log(data);
                                });
                                var userEmail = email_1;
                                fetch('http://localhost:3000/graphql', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Accept': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        query: query_1,
                                        variables: {
                                            userEmail: userEmail,
                                            input: {
                                                balance: balance_1
                                            }
                                        },
                                        operationName: "updateSingleUser"
                                    })
                                }).then(function (r) { return r.json(); }).then(function (data) {
                                    console.log(data);
                                });
                                alert("Buy Item Success");
                                window.location.replace("http://localhost:3001/commerce/commerce.html");
                            }
                            else {
                                alert("Buy Item Error");
                            }
                        });
                    }, 50);
                });
            }
        });
    });
}
//--
