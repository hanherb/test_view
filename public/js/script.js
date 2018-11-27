// if(navigator.serviceWorker) {
//   	navigator.serviceWorker.register('/sw.js');
// }
$(function () {
    $(".nav").load("././navbar.html");
});
function authCheck(type, callback) {
    $.get('http://localhost:3001/check-session', {}, function (data) {
        if (type == 'user') {
            if (data.authority.api.user == 1) {
                return callback();
            }
            else {
                alert("You don't have enough permission");
                window.location.replace("http://localhost:3001/");
            }
        }
        else if (type == 'plugin') {
            if (data.authority.api.plugin == 1) {
                return callback();
            }
            else {
                alert("You don't have enough permission");
                window.location.replace("http://localhost:3001/");
            }
        }
    });
}
// menampilkan ke #tableUser di dashboard.html
function getUser() {
    var query = "query getAllUser {\n\t\t\t\t  users {\n\t\t\t\t    fullname\n\t\t\t\t    email\n\t\t\t\t    role\n\t\t\t\t    authority {\n\t\t\t\t      user {\n\t\t\t\t        read\n\t\t\t\t        create\n\t\t\t\t        update\n\t\t\t\t        delete\n\t\t\t\t      }\n\t\t\t\t    \tapi {\n\t\t\t\t        user\n\t\t\t\t        plugin\n\t\t\t\t      }\n\t\t\t\t    }\n\t\t\t\t  }\n\t\t\t\t}";
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
        for (var i = 0; i < data.data.users.length; i++) {
            var fullname = data.data.users[i].fullname;
            var email = data.data.users[i].email;
            var role = data.data.users[i].role;
            $('#tableUser tbody').append('<tr class="tr_data">' +
                '<td>' + (i + 1) + '</td>' +
                '<td>' + fullname + '</td>' +
                '<td>' + email + '</td>' +
                '<td>' + role + '</td>' +
                '<td><button class="btn btn-warning" id="update" name ="' + email + '" onclick="manageUser(this.id, this.name)">Update</button>' +
                '<button class="btn btn-danger" id="delete" name="' + email + '" onclick="manageUser(this.id, this.name)">Delete</button></td>' +
                '</tr>');
        }
    });
}
//--
// pendaftaran user dari halaman register.html
function registerUser() {
    var email = $('#register-email').val();
    var fullname = $('#register-fullname').val();
    var password = $('#register-password').val();
    var repassword = $('#register-repassword').val();
    var role = "user";
    var authority = {
        "user": {
            "read": 0,
            "create": 0,
            "update": 0,
            "delete": 0
        },
        "api": {
            "user": 0,
            "plugin": 0
        }
    };
    if (password != repassword) {
        alert("Password doesn't match");
    }
    else {
        $.get('http://localhost:3000/register-user', { email: email, fullname: fullname, password: password, role: role, authority: authority }, function (data) {
            if (data == 1) {
                var query = "mutation createSingleUser($input:PersonInput) {\n\t\t\t\t  \tcreateUser(input: $input) {\n\t\t\t\t    \tfullname\n\t\t\t  \t\t}\n\t\t\t\t}";
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
                                email: email,
                                fullname: fullname,
                                role: role,
                                authority: authority,
                                password: password
                            }
                        }
                    })
                }).then(function (r) { return r.json(); }).then(function (data) {
                    console.log(data);
                });
                alert("Register Success");
                window.location.replace("http://localhost:3001/index.html");
            }
            else {
                alert("Register Error");
            }
        });
    }
}
//--
// login dari halaman login.html
function loginUser() {
    var email = $('#login-email').val();
    var password = $('#login-password').val();
    if (email == null || password == null) {
        alert("Form cannot be empty");
    }
    else {
        $.get('http://localhost:3000/login-user', { email: email, password: password }, function (data) {
            if (data) {
                $.get('http://localhost:3001/assign-session', { data: data }, function (data2) {
                    alert("Login Success");
                    window.location.replace("http://localhost:3001/");
                });
            }
            else {
                alert("Incorrect Credential");
            }
        });
    }
}
//--
// cek apakah ada session yang aktif atau tidak
function checkSession() {
    $.get('http://localhost:3001/check-session', {}, function (data) {
        if (data.email) {
            $('.no-session').hide();
            $('.session').show();
            $('.session span').html(data.fullname);
            if (data.authority.user.read == 1) {
                $('.admin-session').show();
            }
        }
        else {
            $('.no-session').show();
            $('.session').hide();
        }
    });
}
//--
// setting CRUD user (trigger function ada di atribut onclick setiap button)
function manageUser(action, email) {
    $.get('http://localhost:3001/check-session', {}, function (data) {
        if (action == "create") {
            if (data.authority.user.create == 1) {
                $('#modalCreate').modal('toggle');
            }
            else {
                alert("You don't have permission to " + action);
            }
        }
        else if (action == "update") {
            if (data.authority.user.update == 1) {
                $('#modalUpdate').modal('toggle');
                $('#update-email').val("");
                $('#update-fullname').val("");
                $('#update-role').val("");
                $('.checkbox input').prop('checked', false);
                var userEmail = email;
                var query = "query getSingleUser($userEmail: String!) {\n\t\t\t\t    user(email: $userEmail) {\n\t\t\t    \t\tfullname\n\t\t\t\t        email\n\t\t\t\t        role\n\t\t\t\t    \t\tauthority {\n\t\t\t\t          user {\n\t\t\t\t            read\n\t\t\t\t            create\n\t\t\t\t            update\n\t\t\t\t            delete\n\t\t\t\t          }\n\t\t\t\t        \tapi {\n\t\t\t\t            user\n\t\t\t\t            plugin\n\t\t\t\t          }\n\t\t\t\t        }\n\t\t\t\t    }\n\t\t\t\t}";
                fetch('http://localhost:3000/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        query: query,
                        variables: { userEmail: userEmail }
                    })
                }).then(function (r) { return r.json(); }).then(function (data) {
                    $('#update-email').val(data.data.user.email);
                    $('#update-fullname').val(data.data.user.fullname);
                    $('#update-role').val(data.data.user.role);
                    if (data.data.user.authority.user.read == 1)
                        $('.cb2 #cb-read').prop('checked', true);
                    if (data.data.user.authority.user.create == 1)
                        $('.cb2 #cb-create').prop('checked', true);
                    if (data.data.user.authority.user.update == 1)
                        $('.cb2 #cb-update').prop('checked', true);
                    if (data.data.user.authority.user["delete"] == 1)
                        $('.cb2 #cb-delete').prop('checked', true);
                    if (data.data.user.authority.api.user == 1)
                        $('.cb2 #cb-user').prop('checked', true);
                    if (data.data.user.authority.api.plugin == 1)
                        $('.cb2 #cb-plugin').prop('checked', true);
                });
            }
            else {
                alert("You don't have permission to " + action);
            }
        }
        else if (action == "delete") {
            if (data.authority.user["delete"] == 1) {
                $('#modalDelete').modal('toggle');
                var userEmail = email;
                var query = "query getSingleUser($userEmail: String!) {\n\t\t\t\t    user(email: $userEmail) {\n\t\t\t    \t\tfullname\n\t\t\t\t        email\n\t\t\t\t        role\n\t\t\t\t    \t\tauthority {\n\t\t\t\t          user {\n\t\t\t\t            read\n\t\t\t\t            create\n\t\t\t\t            update\n\t\t\t\t            delete\n\t\t\t\t          }\n\t\t\t\t        \tapi {\n\t\t\t\t            user\n\t\t\t\t            plugin\n\t\t\t\t          }\n\t\t\t\t        }\n\t\t\t\t    }\n\t\t\t\t}";
                fetch('http://localhost:3000/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        query: query,
                        variables: { userEmail: userEmail }
                    })
                }).then(function (r) { return r.json(); }).then(function (data) {
                    $('#delete-email').html(data.data.user.email);
                    $('#delete-fullname').html(data.data.user.fullname);
                    $('#delete-role').html(data.data.user.role);
                });
            }
            else {
                alert("You don't have permission to " + action);
            }
        }
    });
}
//--
// update data user dari dashboard.html
function updateUser() {
    var email = $('#update-email').val();
    var fullname = $('#update-fullname').val();
    var role = $('#update-role').val();
    var cbRead;
    var cbCreate;
    var cbUpdate;
    var cbDelete;
    var cbUser;
    var cbPlugin;
    if ($('.cb2 #cb-read').is(':checked'))
        cbRead = 1;
    else
        cbRead = 0;
    if ($('.cb2 #cb-create').is(':checked'))
        cbCreate = 1;
    else
        cbCreate = 0;
    if ($('.cb2 #cb-update').is(':checked'))
        cbUpdate = 1;
    else
        cbUpdate = 0;
    if ($('.cb2 #cb-delete').is(':checked'))
        cbDelete = 1;
    else
        cbDelete = 0;
    if ($('.cb2 #cb-user').is(':checked'))
        cbUser = 1;
    else
        cbUser = 0;
    if ($('.cb2 #cb-plugin').is(':checked'))
        cbPlugin = 1;
    else
        cbPlugin = 0;
    var authority = {
        user: {
            read: cbRead,
            create: cbCreate,
            update: cbUpdate,
            "delete": cbDelete
        },
        api: {
            user: cbUser,
            plugin: cbPlugin
        }
    };
    if (email == null || fullname == null || role == null) {
        alert("Form cannot be empty");
    }
    else {
        $.get('http://localhost:3000/update-user', { email: email, fullname: fullname, role: role, authority: authority }, function (data) {
            if (data.ok == 1) {
                var userEmail = email;
                var query = "mutation updateSingleUser($userEmail:String!, $input:PersonInput) {\n\t\t\t\t  \tupdateUser(email: $userEmail, input: $input) {\n\t\t\t\t    \tfullname\n\t\t\t  \t\t}\n\t\t\t\t}";
                fetch('http://localhost:3000/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        query: query,
                        variables: {
                            userEmail: userEmail,
                            input: {
                                email: email,
                                fullname: fullname,
                                role: role,
                                authority: authority
                            }
                        }
                    })
                }).then(function (r) { return r.json(); }).then(function (data) {
                    console.log(data);
                });
                alert("Update Success");
                window.location.replace("http://localhost:3001/dashboard.html");
            }
            else {
                alert("Update Error");
            }
        });
    }
}
//--
// create data user dari dashboard.html
function createUser() {
    var email = $('#create-email').val();
    var fullname = $('#create-fullname').val();
    var role = $('#create-role').val();
    var password = $('#create-password').val();
    var repassword = $('#create-repassword').val();
    var cbRead;
    var cbCreate;
    var cbUpdate;
    var cbDelete;
    var cbUser;
    var cbPlugin;
    if ($('.cb1 #cb-read').is(':checked'))
        cbRead = 1;
    else
        cbRead = 0;
    if ($('.cb1 #cb-create').is(':checked'))
        cbCreate = 1;
    else
        cbCreate = 0;
    if ($('.cb1 #cb-update').is(':checked'))
        cbUpdate = 1;
    else
        cbUpdate = 0;
    if ($('.cb1 #cb-delete').is(':checked'))
        cbDelete = 1;
    else
        cbDelete = 0;
    if ($('.cb1 #cb-user').is(':checked'))
        cbUser = 1;
    else
        cbUser = 0;
    if ($('.cb1 #cb-plugin').is(':checked'))
        cbPlugin = 1;
    else
        cbPlugin = 0;
    var authority = {
        user: {
            read: cbRead,
            create: cbCreate,
            update: cbUpdate,
            "delete": cbDelete
        },
        api: {
            user: cbUser,
            plugin: cbPlugin
        }
    };
    if (email == null || fullname == null || role == null) {
        alert("Form cannot be empty");
    }
    else if (password != repassword) {
        alert("Password doesn't match");
    }
    else {
        $.get('http://localhost:3000/create-user', { email: email, fullname: fullname, role: role, password: password, authority: authority }, function (data) {
            if (data == 1) {
                var query = "mutation createSingleUser($input:PersonInput) {\n\t\t\t\t  \tcreateUser(input: $input) {\n\t\t\t\t    \tfullname\n\t\t\t  \t\t}\n\t\t\t\t}";
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
                                email: email,
                                fullname: fullname,
                                role: role,
                                authority: authority,
                                password: password
                            }
                        }
                    })
                }).then(function (r) { return r.json(); }).then(function (data) {
                    console.log(data);
                });
                alert("Create Success");
                window.location.replace("http://localhost:3001/dashboard.html");
            }
            else {
                alert("Create Error");
            }
        });
    }
}
//--
//delete user data dari dashboard.html
function deleteUser() {
    var email = $('#delete-email').html();
    $.get('http://localhost:3000/delete-user', { email: email }, function (data) {
        if (data.ok == 1) {
            var userEmail = email;
            var query = "mutation deleteSingleUser($userEmail:String!) {\n\t\t\t  \tdeleteUser(email: $userEmail) {\n\t\t\t    \tfullname\n\t\t  \t\t}\n\t\t\t}";
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
                console.log(data);
            });
            alert("Delete Success");
            window.location.replace("http://localhost:3001/dashboard.html");
        }
        else {
            alert("Delete Error");
        }
    });
}
//--
//setting plugin navbar
function navPlugin() {
    var query = "query getAllPlugin {\n\t  plugins {\n\t    name\n\t    status\n\t  }\n\t}";
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
        for (var i = 0; i < data.data.plugins.length; i++) {
            if (data.data.plugins[i].status == 1) {
                $('.plugin-nav').append('<li><a href="/' + data.data.plugins[i].name + '/' + data.data.plugins[i].name + '.html">' + data.data.plugins[i].name + '</a></li>');
            }
        }
    });
}
//--
//setting plugin list
function listPlugin() {
    $.get('http://localhost:3000/list-plugin', {}, function (data) {
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            $('#plugin-list').append('<div class="checkbox cb-' + data[i] + '">' +
                '<label><input type="checkbox" id="' + data[i] + '">' + data[i] + '</label>' +
                '</div>');
        }
    });
}
//--
//seting checklist pada plugin list
function getPlugin() {
    var query = "query getAllPlugin {\n\t  plugins {\n\t    name\n\t    status\n\t  }\n\t}";
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
        $('#plugin-list').find('.checkbox input').each(function () {
            for (var i = 0; i < data.data.plugins.length; i++) {
                if (data.data.plugins[i].name == this.id) {
                    if (data.data.plugins[i].status == 1) {
                        $(this).prop('checked', true);
                    }
                    else {
                        $(this).prop('checked', false);
                    }
                }
            }
        });
    });
}
//--
//tambah plugin
function addPlugin() {
    var plugin = {
        'name': [],
        'status': []
    };
    $('#plugin-list').find('.checkbox input').each(function () {
        if ($(this).is(':checked')) {
            plugin.name.push(this.id);
            plugin.status.push(1);
        }
        else {
            plugin.name.push(this.id);
            plugin.status.push(0);
        }
    });
    $.get('http://localhost:3000/add-plugin', { plugin: plugin }, function (data) {
        if (data == 1) {
            for (var i = 0; i < plugin.name.length; i++) {
                var name_1 = plugin.name[i];
                var status_1 = plugin.status[i];
                var pluginName = name_1;
                var query = "mutation updateSinglePlugin($pluginName:String!, $input:PluginInput) {\n\t\t\t\t  \tupdatePlugin(name: $pluginName, input: $input) {\n\t\t\t\t    \tname\n\t\t\t  \t\t}\n\t\t\t\t}";
                fetch('http://localhost:3000/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        query: query,
                        variables: {
                            pluginName: pluginName,
                            input: {
                                name: name_1,
                                status: status_1
                            }
                        }
                    })
                }).then(function (r) { return r.json(); }).then(function (data) {
                    console.log(data);
                });
            }
            alert("Plugin Updated");
            window.location.replace("http://localhost:3001/add-plugin.html");
        }
        else {
            alert("Something went wrong");
        }
    });
}
//--
