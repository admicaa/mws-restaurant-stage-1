const chacheVersion = "restaurant-cache-1";
const imagesCacheVersion = 'images-cache-1'
const staticFiles = [
    "/",
    "/index.html",
    "/restaurant.html",
    "/css/styles.css",
    "/data/restaurants.json",
    "/js/dbhelper.js",
    "/js/main.js",
    "/js/restaurant_info.js",
];
for (var i=1;i<=10;i+=1){
    staticFiles.push('/img/'+i+'.jpg');
}

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(chacheVersion).then(function (cache) {
            return cache.addAll(staticFiles);
        })
    );
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (restaurantCaches) {
            return Promise.all(
                restaurantCaches.filter(function (restaurantCache) {
                    return (restaurantCache !== chacheVersion && restaurantCache !== imagesCacheVersion);
                }).map(function (restaurantCache) {
                    return caches.delete(restaurantCache);
                })
            )
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
        .then(function (response) {
            if (response) {
                return response;
            }
            var fetchRequest = event.request.clone();
            return fetch(fetchRequest).then(
                function (response) {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    var responseToCache = response.clone();
                    caches.open(imagesCacheVersion)
                        .then(function (cache) {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                }
            );
        })
    );
});