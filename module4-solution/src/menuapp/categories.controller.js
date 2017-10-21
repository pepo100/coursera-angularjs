(function () {
    'use strict';
    console.log("this");
    angular.module("MenuApp")
        .controller("CategoriesController", CategoriesController);

    CategoriesController.$inject = ['categoriesData'];
    function CategoriesController(categoriesData) {
        var catCtrl = this;
        catCtrl.categories = categoriesData;
    }
})();