//menampilkan list post pada halaman blog.html
function listBlog() {
    var query = "query getAllBlog {\n\t  blogs {\n\t    title\n\t    content\n\t    date\n\t    month\n\t    year\n\t    author\n\t  }\n\t}";
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
        for (var i = 0; i < data.data.blogs.length; i++) {
            $('.container-post').append('<div class="post-preview">' +
                '<a href="post.html">' +
                '<h2 class="post-title">' +
                data.data.blogs[i].title +
                '</h2>' +
                '</a>' +
                '<p class="post-meta">Posted by ' +
                data.data.blogs[i].author + ' on ' +
                data.data.blogs[i].month + ' ' + data.data.blogs[i].date + ', ' + data.data.blogs[i].year +
                '</p>' +
                '<p class="post-content">' +
                data.data.blogs[i].content +
                '</p>' +
                '<a class="btn btn-primary" id="btn-update-post" name="' + data.data.blogs[i].title + '" onclick="formPost(this.name);">Edit Post</a>' +
                '<a class="btn btn-danger" id="btn-delete-post" name="' + data.data.blogs[i].title + '" onclick="checkDeletePost(this.name);">Delete Post</a>' +
                '<hr>' +
                '</div>');
        }
    });
}
//--
//menambah post untuk plugin blog
function addPost() {
    var title = $('#add-post-title').val();
    var content = $('#add-post-content').val();
    var currentdate = new Date();
    var date = currentdate.getDate();
    var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    var month = monthNames[(currentdate.getMonth())];
    var year = currentdate.getFullYear();
    $.get('http://localhost:3001/check-session', {}, function (data2) {
        $.get('http://localhost:3000/add-post', { title: title, content: content, date: date, month: month, year: year, author: data2.fullname }, function (data) {
            if (data.ok == 1) {
                var author = data2.fullname;
                var query = "mutation createSingleBlog($input:BlogInput) {\n\t\t\t\t  createBlog(input: $input) {\n\t\t\t\t    title\n\t\t\t\t  }\n\t\t\t\t}";
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
                                title: title,
                                content: content,
                                date: date,
                                month: month,
                                year: year,
                                author: author
                            }
                        }
                    })
                }).then(function (r) { return r.json(); }).then(function (data) {
                    console.log(data);
                });
                alert("Add Post Success");
                window.location.replace("http://localhost:3001/blog/blog.html");
            }
            else {
                alert("Add Post Error");
            }
        });
    });
}
//--
//mengambil data post pada halaman blog untuk di update dan eksekusi update
function formPost(name) {
    window.location.replace("http://localhost:3001/blog/edit-post.html?title=" + name);
}
function formPostValue() {
    var title = window.location.href.split("?title=")[1].replace(/%20/g, " ");
    var blogTitle = title;
    var query = "query getSingleBlog($blogTitle: String!) {\n\t  blog(title: $blogTitle) {\n\t    title\n\t    content\n\t  }\n\t}";
    fetch('http://localhost:3000/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            query: query,
            variables: { blogTitle: blogTitle }
        })
    }).then(function (r) { return r.json(); }).then(function (data) {
        $('#update-post-title').val(data.data.blog.title);
        $('#update-post-content').val(data.data.blog.content);
    });
}
function updatePost() {
    var oldTitle = window.location.href.split("?title=")[1].replace(/%20/g, " ");
    var title = $('#update-post-title').val();
    var content = $('#update-post-content').val();
    var currentdate = new Date();
    var date = currentdate.getDate();
    var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    var month = monthNames[(currentdate.getMonth())];
    var year = currentdate.getFullYear();
    $.get('http://localhost:3000/update-post', { old: oldTitle, title: title, content: content, date: date, month: month, year: year }, function (data) {
        if (data.ok == 1) {
            var blogTitle = oldTitle;
            var query = "mutation updateSingleBlog($blogTitle:String!, $input:BlogInput) {\n\t\t\t  \tupdateBlog(title: $blogTitle, input: $input) {\n\t\t\t    \ttitle\n\t\t  \t\t}\n\t\t\t}";
            fetch('http://localhost:3000/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    query: query,
                    variables: {
                        blogTitle: blogTitle,
                        input: {
                            title: title,
                            content: content,
                            date: date,
                            month: month,
                            year: year
                        }
                    }
                })
            }).then(function (r) { return r.json(); }).then(function (data) {
                console.log(data);
            });
            alert("Update Post Success");
            window.location.replace("http://localhost:3001/blog/blog.html");
        }
        else {
            alert("Update Post Error");
        }
    });
}
//--
//menghapus post dari halaman blog
function checkDeletePost(name) {
    $('#modalDeletePost').modal('toggle');
    $('#delete-check').html(name);
}
function deletePost() {
    var title = $('#delete-check').html();
    $.get('http://localhost:3000/delete-post', { title: title }, function (data) {
        if (data.ok == 1) {
            var blogTitle = title;
            var query = "mutation deleteSingleBlog($blogTitle:String!) {\n\t\t\t  \tdeleteBlog(title: $blogTitle) {\n\t\t\t    \ttitle\n\t\t  \t\t}\n\t\t\t}";
            fetch('http://localhost:3000/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    query: query,
                    variables: {
                        blogTitle: blogTitle
                    }
                })
            }).then(function (r) { return r.json(); }).then(function (data) {
                console.log(data);
            });
            alert("Delete Post Success");
            window.location.replace("http://localhost:3001/blog/blog.html");
        }
        else {
            alert("Delete Post Error");
        }
    });
}
//--
