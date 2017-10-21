(function () {
    'use strict';

    angular.module("data")
        .service("MenuDataService", MenuDataService)
        .constant("ApiBasePath", "https://davids-restaurant.herokuapp.com");

    MenuDataService.$inject = ['$http', 'ApiBasePath'];
    function MenuDataService($http, ApiBasePath) {
        var service = this;

        service.getAllCategories = function () {
            console.log("triggered");
            return $http({
                method: "GET",
                url: ApiBasePath + "/categories.json"
            }).catch(function (error) {
                console.log(error.status, error.statusText);
            });
        };

        service.getItemsForCategory = function (categoryShortName) {
            return $http({
                method: "GET",
                url: ApiBasePath + "/menu_items.json",
                params: {
                    category: categoryShortName
                }
            }).catch(function (error) {
                console.log(error.status, error.statusText);
            });
        };
    }
})();

