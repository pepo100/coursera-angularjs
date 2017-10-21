(function(){
    (function () {
        'use strict';

        angular.module("MenuApp")
            .controller("ItemsController", ItemsController);

        ItemsController.$inject = ['itemsData'];
        function ItemsController(itemsData) {
            var catCtrl = this;
            catCtrl.items = itemsData.menu_items;
        }
    })();
})();