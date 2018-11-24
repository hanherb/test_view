console.log("Hi, I am Service Woker");

importScripts('/js/cache-polyfill.js');

self.addEventListener('install', function(e) {
	e.waitUntil(
   		caches.open('airhorner').then(function(cache) {
     		return cache.addAll([
		       	'/',
				'/index.html',
				'/add-plugin.html',
				'/dashboard.html',
				'/login.html',
				'/navbar.html',
				'/register.html',
				'/css/bootstrap.css',
				'/css/bootstrap.min.css',
				'/css/bootstrap-table.css',
				'/css/style.css',
				'/js/bootstrap.js',
				'/js/bootstrap.min.js',
				'/js/bootstrap-table.js',
				'/js/cache-polyfill.js',
				'/js/jquery.js',
				'/js/script.js',
     		]);
   		})
 	);
});

self.addEventListener('fetch', function(event) {
	console.log(event.request.url);
	event.respondWith(
   		caches.match(event.request).then(function(response) {
     		return response || fetch(event.request);
   		})
 	);
});