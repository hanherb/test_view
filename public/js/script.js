let address = 'http://' + window.location.hostname;
// if(navigator.serviceWorker) {
//      navigator.serviceWorker.register('/sw.js');
// }

$(function(){
    $(".nav").append('<li class="session"><a href="/dashboard.html">Dashboard</a></li>'+
        '<li class="dropdown">'+
            '<a class="dropdown-toggle session" data-toggle="dropdown" href="#">Plugins'+
                '<span class="caret"></span>'+
            '</a>'+
            '<ul class="dropdown-menu plugin-nav">'+
                '<li><a href="/add-plugin.html">Add Plugin</a></li>'+
                '<li role="separator" class="divider"></li>'+
            '</ul>'+
        '</li>'+
        '<li class="session" id="logout"><a href="'+address+':3000/logout">Logout</a></li>'
    );
});

function ucFirst(string) {
    return string.substring(0, 1).toUpperCase() + string.substring(1).toLowerCase();
}

function authCheck(type, callback) {
    $.get(address + ':3001/check-session', {}, function(data){
        if(data != 'no session') {
            if(type == 'user') {
                if(data.authority.api.user == 1) {
                    if(callback)
                        callback();
                }
                else {
                    alert("You don't have enough permission");
                    window.location.replace(address + ":3001/");
                }
            }
            else if(type == 'blog') {
                if(data.authority.api.blog == 1) {
                    if(callback)
                        callback();
                }
                else {
                    alert("You don't have enough permission");
                    window.location.replace(address + ":3001/");
                }
            }
            else if(type == 'commerce') {
                if(data.authority.api.commerce == 1) {
                    if(callback)
                        callback();
                }
                else {
                    alert("You don't have enough permission");
                    window.location.replace(address + ":3001/");
                }
            }
            else if(type == 'consult') {
                if(data.authority.api.consult == 1) {
                    if(callback)
                        callback();
                }
                else {
                    alert("You don't have enough permission");
                    window.location.replace(address + ":3001/");
                }
            }
            else if(type == 'supply') {
                if(data.authority.api.supply == 1) {
                    if(callback)
                        callback();
                }
                else {
                    alert("You don't have enough permission");
                    window.location.replace(address + ":3001/");
                }
            }
            else if(type == 'report') {
                if(data.authority.api.report == 1) {
                    if(callback)
                        callback();
                }
                else {
                    alert("You don't have enough permission");
                    window.location.replace(address + ":3001/");
                }
            }
        }
        else {
            alert("You have to login first");
            window.location.replace(address + ":3001/");
        }
    });
}

// menampilkan ke #tableUser di dashboard.html
function getUser() {
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
        for(let i = 0; i < data.data.users.length; i++) {
            
            let fullname = data.data.users[i].fullname;
            let email = data.data.users[i].email;
            let role = data.data.users[i].role;

            $('#tableUser tbody').append('<tr class="tr_data">'+
                '<td>'+(i+1)+'</td>'+
                '<td>'+fullname+'</td>'+
                '<td>'+email+'</td>'+
                '<td>'+role+'</td>'+
                '<td><button class="btn btn-warning" id="update" name ="'+email+'" onclick="manageUser(this.id, this.name)">Update</button>'+
                '<button class="btn btn-danger" id="delete" name="'+email+'" onclick="manageUser(this.id, this.name)">Delete</button></td>'+
                '</tr>');
        }
    });
}
//--

// pendaftaran user dari halaman register.html
function registerUser() {
    let email = $('#register-email').val();
    let fullname = $('#register-fullname').val();
    let password = $('#register-password').val();
    let repassword = $('#register-repassword').val();
    let role = "user";
    let authority = {
        "user": {
            "read": 0,
            "create": 0,
            "update": 0,
            "delete": 0
        },
        "api": {
            "user": 0,
            "blog": 0,
            "commerce": 0,
            "consult": 0,
            "supply": 0,
            "report": 0
        }
    };

    if(password != repassword) {
        alert("Password doesn't match");
    }
    else {
        $.get(address + ':3000/register-user', {email: email, fullname: fullname, password: password, role: role, authority: authority}, function(data) {
            if(data == 1) {
                let query = `mutation createSingleUser($input:PersonInput) {
                    createUser(input: $input) {
                        fullname
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
                                email,
                                fullname,
                                role,
                                authority,
                                password
                            }
                        }
                    })
                }).then(r => r.json()).then(function(data) {
                    console.log(data);
                });
                alert("Register Success");
                window.location.replace(address + ":3001/index.html");
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
    let email = $('#login-email').val();
    let password = $('#login-password').val();

    if(email == null || password == null) {
        alert("Form cannot be empty");
    }
    else {
        $.get(address + ':3000/login-user', {email: email, password: password}, function(data) {
            if(data.email) {
                $.get(address + ':3001/assign-session', {data: data}, function(data2) {
                    alert("Login Success");
                    window.location.replace(address + ":3001/");
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
    $.get(address + ':3001/check-session', {}, function(data){
        setTimeout(function() {
            if(data.email) {
                $('.session').addClass("show");
                $('.no-session').addClass("hide");
                $('.session').removeClass("hide");
                $('.no-session').removeClass("show");
                $('.session #welcome').html(data.fullname);
            }
            else {
                $('.session').addClass("hide");
                $('.no-session').addClass("show");
                $('.session').removeClass("show");
                $('.no-session').removeClass("hide");
            }
        }, 50);
    });
}
//--

//apply list plugin pada dashboard.html bagian add & update user modal
function pluginAtModal() {
    let query = `query getAllPlugin {
      plugins {
        name
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
        console.log(data.data.plugins);
        for(let i = 0; i < data.data.plugins.length; i++) {
            let pluginName = data.data.plugins[i].name;
            $('.apply-plugin-1').append('<div class="checkbox cb1">'+
                                            '<label><input type="checkbox" id="cb-'+pluginName+'">'+ucFirst(pluginName)+'</label>'+
                                       ' </div>');
            $('.apply-plugin-2').append('<div class="checkbox cb2">'+
                                            '<label><input type="checkbox" id="cb-'+pluginName+'">'+ucFirst(pluginName)+'</label>'+
                                       ' </div>');
        }
    });
}
//--

// setting CRUD user (trigger function ada di atribut onclick setiap button)
function manageUser(action, email) {
    $.get(address + ':3001/check-session', {}, function(data){
        if(action == "create") {
            if(data.authority.user.create == 1) {
                $('#modalCreate').modal('toggle');
            }
            else {
                alert("You don't have permission to " + action);
            }
        }
        else if(action == "update") {
            if(data.authority.user.update == 1) {
                $('#modalUpdate').modal('toggle');
                $('#update-email').val("");
                $('#update-fullname').val("");
                $('#update-role').val("");
                $('.checkbox input').prop('checked', false);
                let userEmail = email;
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
                        variables: {userEmail},
                    })
                }).then(r => r.json()).then(function(data) {
                    $('#update-email').val(data.data.user.email);
                    $('#update-fullname').val(data.data.user.fullname);
                    $('#update-role').val(data.data.user.role);
                    if(data.data.user.authority.user.read == 1)
                        $('.cb2 #cb-read').prop('checked', true);
                    if(data.data.user.authority.user.create == 1)
                        $('.cb2 #cb-create').prop('checked', true);
                    if(data.data.user.authority.user.update == 1)
                        $('.cb2 #cb-update').prop('checked', true);
                    if(data.data.user.authority.user.delete == 1)
                        $('.cb2 #cb-delete').prop('checked', true);
                    if(data.data.user.authority.api.user == 1)
                        $('.cb2 #cb-user').prop('checked', true);
                    if(data.data.user.authority.api.blog == 1)
                        $('.cb2 #cb-blog').prop('checked', true);
                    if(data.data.user.authority.api.commerce == 1)
                        $('.cb2 #cb-commerce').prop('checked', true);
                    if(data.data.user.authority.api.commerce == 1)
                        $('.cb2 #cb-commerce').prop('checked', true);
                    if(data.data.user.authority.api.consult == 1)
                        $('.cb2 #cb-consult').prop('checked', true);
                    if(data.data.user.authority.api.supply == 1)
                        $('.cb2 #cb-supply').prop('checked', true);
                    if(data.data.user.authority.api.report == 1)
                        $('.cb2 #cb-report').prop('checked', true);
                });
            }
            else {
                alert("You don't have permission to " + action);
            }
        }
        else if(action == "delete") {
            if(data.authority.user.delete == 1) {
                $('#modalDelete').modal('toggle');
                let userEmail = email;
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
                        variables: {userEmail},
                    })
                }).then(r => r.json()).then(function(data) {
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
    let email = $('#update-email').val();
    let fullname = $('#update-fullname').val();
    let role = $('#update-role').val();
    let cbRead;
    let cbCreate;
    let cbUpdate;
    let cbDelete;
    let cbUser;
    let cbBlog;
    let cbCommerce;
    let cbConsult;
    let cbSupply;
    let cbReport;

    if($('.cb2 #cb-read').is(':checked')) 
        cbRead = 1;
    else
        cbRead = 0;
    if($('.cb2 #cb-create').is(':checked')) 
        cbCreate = 1;
    else
        cbCreate = 0;
    if($('.cb2 #cb-update').is(':checked')) 
        cbUpdate = 1;
    else
        cbUpdate = 0;
    if($('.cb2 #cb-delete').is(':checked')) 
        cbDelete = 1;
    else
        cbDelete = 0;
    if($('.cb2 #cb-user').is(':checked')) 
        cbUser = 1;
    else
        cbUser = 0;
    if($('.cb2 #cb-blog').is(':checked')) 
        cbBlog = 1;
    else
        cbBlog = 0;
    if($('.cb2 #cb-commerce').is(':checked')) 
        cbCommerce = 1;
    else
        cbCommerce = 0;
    if($('.cb2 #cb-consult').is(':checked')) 
        cbConsult = 1;
    else
        cbConsult = 0;
    if($('.cb2 #cb-supply').is(':checked')) 
        cbSupply = 1;
    else
        cbSupply = 0;
    if($('.cb2 #cb-report').is(':checked')) 
        cbReport = 1;
    else
        cbReport = 0;

    let authority = {
        user: {
            read: cbRead,
            create: cbCreate,
            update: cbUpdate,
            delete: cbDelete
        },
        api: {
            user: cbUser,
            blog: cbBlog,       
            commerce: cbCommerce,       
            consult: cbConsult,     
            supply: cbSupply,       
            report: cbReport        
        }
    }

    if(email == null || fullname == null || role == null) {
        alert("Form cannot be empty");
    }
    else {
        $.get(address + ':3000/update-user', {email: email, fullname: fullname, role: role, authority: authority}, function(data) {
            if(data.ok == 1) {
                let userEmail = email;
                let query = `mutation updateSingleUser($userEmail:String!, $input:PersonInput) {
                    updateUser(email: $userEmail, input: $input) {
                        fullname
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
                            userEmail,
                            input: {
                                email,
                                fullname,
                                role,
                                authority
                            }
                        }
                    })
                }).then(r => r.json()).then(function(data) {
                    console.log(data);
                });
                alert("Update Success");
                window.location.replace(address + ":3001/dashboard.html");
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
    let email = $('#create-email').val();
    let fullname = $('#create-fullname').val();
    let role = $('#create-role').val();
    let password = $('#create-password').val();
    let repassword = $('#create-repassword').val();
    let cbRead;
    let cbCreate;
    let cbUpdate;
    let cbDelete;
    let cbUser;
    let cbBlog;
    let cbCommerce;
    let cbConsult;
    let cbSupply;
    let cbReport;

    if($('.cb1 #cb-read').is(':checked')) 
        cbRead = 1;
    else
        cbRead = 0;
    if($('.cb1 #cb-create').is(':checked')) 
        cbCreate = 1;
    else
        cbCreate = 0;
    if($('.cb1 #cb-update').is(':checked')) 
        cbUpdate = 1;
    else
        cbUpdate = 0;
    if($('.cb1 #cb-delete').is(':checked')) 
        cbDelete = 1;
    else
        cbDelete = 0;
    if($('.cb1 #cb-user').is(':checked')) 
        cbUser = 1;
    else
        cbUser = 0;
    if($('.cb1 #cb-blog').is(':checked')) 
        cbBlog = 1;
    else
        cbBlog = 0;
    if($('.cb1 #cb-commerce').is(':checked')) 
        cbCommerce = 1;
    else
        cbCommerce = 0;
    if($('.cb1 #cb-consult').is(':checked')) 
        cbConsult = 1;
    else
        cbConsult = 0;
    if($('.cb1 #cb-supply').is(':checked')) 
        cbSupply = 1;
    else
        cbSupply = 0;
    if($('.cb1 #cb-report').is(':checked')) 
        cbReport = 1;
    else
        cbReport = 0;

    let authority = {
        user: {
            read: cbRead,
            create: cbCreate,
            update: cbUpdate,
            delete: cbDelete
        },
        api: {
            user: cbUser,
            blog: cbBlog,       
            commerce: cbCommerce,       
            consult: cbConsult,     
            supply: cbSupply,       
            report: cbReport        
        }
    }

    if(email == null || fullname == null || role == null) {
        alert("Form cannot be empty");
    }
    else if(password != repassword) {
        alert("Password doesn't match");
    }
    else {
        $.get(address + ':3000/create-user', {email: email, fullname: fullname, role: role, password: password, authority: authority}, function(data) {
            if(data == 1) {
                let query = `mutation createSingleUser($input:PersonInput) {
                    createUser(input: $input) {
                        fullname
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
                                email,
                                fullname,
                                role,
                                authority,
                                password
                            }
                        }
                    })
                }).then(r => r.json()).then(function(data) {
                    console.log(data);
                });
                alert("Create Success");
                window.location.replace(address + ":3001/dashboard.html");
            }
            else {
                alert("Create Error");
            }
        });
    }
}
//--

//delete user data dari dashboard.html
function deleteUser(){
    let email = $('#delete-email').html();

    $.get(address + ':3000/delete-user', {email: email}, function(data) {
        if(data.ok == 1) {
            let userEmail = email;
            let query = `mutation deleteSingleUser($userEmail:String!) {
                deleteUser(email: $userEmail) {
                    fullname
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
                    }
                })
            }).then(r => r.json()).then(function(data) {
                console.log(data);
            });
            alert("Delete Success");
            window.location.replace(address + ":3001/dashboard.html");
        }
        else {
            alert("Delete Error");
        }
    });
}
//--

//setting plugin navbar
function navPlugin() {
    let query = `query getAllPlugin {
      plugins {
        name
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
        setTimeout(function() {
            for(let i = 0; i < data.data.plugins.length; i++) {
                if(data.data.plugins[i].status == 1){
                    if(data.data.plugins[i].name == 'consult') {
                        $.get(address + ':3001/check-session', {}, function(data2) {
                            if(data2.role == 'user') {
                                $('.plugin-nav').append('<li><a href="/'+data.data.plugins[i].name+'/'+data.data.plugins[i].name+'.html">'+data.data.plugins[i].name+'</a></li>');
                            }
                            else if (data2.role == 'doctor') {
                                $('.plugin-nav').append('<li><a href="/'+data.data.plugins[i].name+'/list-'+data.data.plugins[i].name+'.html">'+data.data.plugins[i].name+'</a></li>');
                            }
                            else if(data2.role == 'admin') {
                                $('.plugin-nav').append('<li><a href="/'+data.data.plugins[i].name+'/admin-'+data.data.plugins[i].name+'.html">'+data.data.plugins[i].name+'</a></li>');
                            }
                        });
                    }
                    else if(data.data.plugins[i].name == 'supply') {
                        $.get(address + ':3001/check-session', {}, function(data2) {
                            if(data2.role == 'supplier') {
                                $('.plugin-nav').append('<li><a href="/'+data.data.plugins[i].name+'/'+data.data.plugins[i].name+'.html">'+data.data.plugins[i].name+'</a></li>');
                            }
                        });
                    }
                    else if(data.data.plugins[i].name == 'report') {
                        $.get(address + ':3001/check-session', {}, function(data2) {
                            if(data2.role == 'admin') {
                                $('.plugin-nav').append('<li><a href="/'+data.data.plugins[i].name+'/'+data.data.plugins[i].name+'.html">'+data.data.plugins[i].name+'</a></li>');
                            }
                        });
                    }
                    else {
                        $('.plugin-nav').append('<li><a href="/'+data.data.plugins[i].name+'/'+data.data.plugins[i].name+'.html">'+data.data.plugins[i].name+'</a></li>');
                    }
                }
            }
        }, 50);
    });
}
//--

//setting plugin list
function listPlugin() {
    $.get(address + ':3000/list-plugin', {}, function(data) {
        console.log(data);
        for(let i = 0; i < data.length; i++) {
            $('#plugin-list').append('<div class="checkbox cb-'+data[i]+'">'+
                '<label><input type="checkbox" id="'+data[i]+'">'+data[i]+'</label>'+
            '</div>');
        }
    });
}
//--

//seting checklist pada plugin list
function getPlugin() {
    let query = `query getAllPlugin {
      plugins {
        name
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
        console.log(data);
        setTimeout(function() {
            $('#plugin-list').find('.checkbox input').each(function(){
                for(let i = 0; i < data.data.plugins.length; i++) {
                    if(data.data.plugins[i].name == this.id) {
                        if(data.data.plugins[i].status == 1) {
                            $(this).prop('checked', true);
                        }
                        else {
                            $(this).prop('checked', false);
                        }
                    }
                }
            });
        }, 100);
    });
}
//--

//tambah plugin
function addPlugin() {
    let plugin = {
        'name': [],
        'status': []
    };
    $('#plugin-list').find('.checkbox input').each(function(){
        if($(this).is(':checked')) {
            plugin.name.push(this.id);
            plugin.status.push(1);
        }
        else {
            plugin.name.push(this.id);
            plugin.status.push(0);
        }
    });

    $.get(address + ':3000/add-plugin', {plugin: plugin}, function(data) {  
        console.log(data);
        for(let i = 0; i < plugin.name.length; i++) {
            let name = plugin.name[i];
            let status = plugin.status[i];
            let pluginName = name;
            let query = `mutation updateSinglePlugin($pluginName:String!, $input:PluginInput) {
                updatePlugin(name: $pluginName, input: $input) {
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
                        pluginName,
                        input: {
                            name,
                            status
                        }
                    }
                })
            }).then(r => r.json()).then(function(data) {
                console.log(data);
            });
        }
        if(data != 1) {
            let name = data.name;
            let status = Number(data.status);
            let query = `mutation createSinglePlugin($input:PluginInput) {
                createPlugin(input: $input) {
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
                            status
                        }
                    }
                })
            }).then(r => r.json()).then(function(data) {
                console.log(data);
            });
        }
        alert("Plugin Updated");
        window.location.replace(address + ":3001/add-plugin.html");
    });
}
//--