let address = 'http://141.136.47.202';

//menampilkan list post pada halaman blog.html
function listBlog() {
	var query = `query getAllBlog {
	  blogs {
	    title
	    content
	    date
	    month
	    year
	    author
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
	  	for(let i = 0; i < data.data.blogs.length; i++) {
			$('.container-post').append('<div class="post-preview">'+
	            		'<a href="post.html">'+
		              		'<h2 class="post-title">'+
		                		data.data.blogs[i].title+
		              		'</h2>'+
	            		'</a>'+
	            		'<p class="post-meta">Posted by '+
	            			data.data.blogs[i].author+ ' on '+
              				data.data.blogs[i].month+' '+data.data.blogs[i].date+', '+data.data.blogs[i].year+
              			'</p>'+
              			'<p class="post-content">'+
	              			data.data.blogs[i].content+
              			'</p>'+
              			'<a class="btn btn-primary" id="btn-update-post" name="'+data.data.blogs[i].title+'" onclick="formPost(this.name);">Edit Post</a>'+
	          			'<a class="btn btn-danger" id="btn-delete-post" name="'+data.data.blogs[i].title+'" onclick="checkDeletePost(this.name);">Delete Post</a>'+
	          			'<hr>'+
	          		'</div>');
		}
	});
}
//--

//menambah post untuk plugin blog
function addPost() {
	let title = $('#add-post-title').val() as string;
	let content = $('#add-post-content').val() as string;
	let currentdate = new Date();
	let date = currentdate.getDate();
	const monthNames = ["January", "February", "March", "April", "May", "June",
	  "July", "August", "September", "October", "November", "December"
	];
	let month = monthNames[(currentdate.getMonth())];
	let year = currentdate.getFullYear();

	$.get(address + ':3001/check-session', {}, function(data2) {	
		$.get(address + ':3000/add-post', {title: title, content: content, date: date, month: month, year: year, author: data2.fullname}, function(data) {
			if(data.ok == 1) {
				let author = data2.fullname;
				let query = `mutation createSingleBlog($input:BlogInput) {
				  createBlog(input: $input) {
				    title
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
				        		title,
				        		content,
				        		date,
				        		month,
				        		year,
				        		author
				      		}
				    	}
				  	})
				}).then(r => r.json()).then(function(data) {
					console.log(data);
				});
				alert("Add Post Success");
				window.location.replace(address + ":3001/blog/blog.html");
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
	window.location.replace(address + ":3001/blog/edit-post.html?title="+name);
}

function formPostValue() {
	let title = window.location.href.split("?title=")[1].replace(/%20/g, " ");
	let blogTitle = title;
	let query = `query getSingleBlog($blogTitle: String!) {
	  blog(title: $blogTitle) {
	    title
	    content
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
	    	variables: {blogTitle},
	  	})
	}).then(r => r.json()).then(function(data) {
	  	$('#update-post-title').val(data.data.blog.title);
		$('#update-post-content').val(data.data.blog.content);
	});
}

function updatePost() {
	let oldTitle = window.location.href.split("?title=")[1].replace(/%20/g, " ");
	let title = $('#update-post-title').val() as string;
	let content = $('#update-post-content').val() as string;
	let currentdate = new Date();
	let date = currentdate.getDate();
	const monthNames = ["January", "February", "March", "April", "May", "June",
	  "July", "August", "September", "October", "November", "December"
	];
	let month = monthNames[(currentdate.getMonth())];
	let year = currentdate.getFullYear();

	$.get(address + ':3000/update-post', {old: oldTitle, title: title, content: content, date: date, month: month, year: year}, function(data) {
		if(data.ok == 1) {
			let blogTitle = oldTitle;
			let query = `mutation updateSingleBlog($blogTitle:String!, $input:BlogInput) {
			  	updateBlog(title: $blogTitle, input: $input) {
			    	title
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
			    		blogTitle,
			      		input: {
			        		title,
			        		content,
			        		date,
			        		month,
			        		year
			      		}
			    	}
			  	})
			}).then(r => r.json()).then(function(data) {
				console.log(data);
			});
			alert("Update Post Success");
			window.location.replace(address + ":3001/blog/blog.html");
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
	let title = $('#delete-check').html() as string;

	$.get(address + ':3000/delete-post', {title: title}, function(data) {
		if(data.ok == 1) {
			let blogTitle = title;
			let query = `mutation deleteSingleBlog($blogTitle:String!) {
			  	deleteBlog(title: $blogTitle) {
			    	title
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
			    		blogTitle
			    	}
			  	})
			}).then(r => r.json()).then(function(data) {
				console.log(data);
			});
			alert("Delete Post Success");
			window.location.replace(address + ":3001/blog/blog.html");
		}
		else {
			alert("Delete Post Error");
		}
	});
}
//--