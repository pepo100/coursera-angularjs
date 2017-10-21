(function () {
    'use strict';

    angular.module('MenuApp')
        .config(RoutesConfig);

    RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
    function RoutesConfig($stateProvider, $urlRouterProvider) {

        // Redirect to tab 1 if no other URL matches
        $urlRouterProvider.otherwise('/');

        // Set up UI states
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'src/menuapp/templates/home.template.html'
            })
            .state('categories', {
                url: '/categories',
                templateUrl: 'src/menuapp/templates/main-categories.template.html',
                controller: 'CategoriesController',
                controllerAs: 'catCtrl',
                resolve: {
                    categoriesData: ['MenuDataService', function (MenuDataService) {
                        return MenuDataService.getAllCategories()
                            .then(function (data) {
                                return data.data;
                            });
                    }]
                }
            })
            .state('items', {
                url: '/categories/{categoryName}',
                templateUrl: 'src/menuapp/templates/main-items.template.html',
                controller: 'ItemsController',
                controllerAs: 'itemCtrl',
                resolve: {
                    itemsData: ['$stateParams', 'MenuDataService', function ($stateParams, MenuDataService) {
                        return MenuDataService.getItemsForCategory($stateParams.categoryName)
                            .then(function (data) {
                                console.log("data", data.data);
                                return data.data;
                            });
                    }]
                }
            });
    }
})();