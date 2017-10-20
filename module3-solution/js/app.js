(function () {
    'use strict';

    angular.module("NarrowItDownApp", [])
        .controller("NarrowItDownController", NarrowItDownController)
        .service("MenuSearchService", MenuSearchService)
        .directive("foundItems", FoundItemsDirective)
        .constant("ApiBasePath", "https://davids-restaurant.herokuapp.com");

    function FoundItemsDirective() {
        var ddo = {
            templateUrl: 'loader/founditems.template.html',
            scope: {
                list: '<',
                onRemove: '&'
                //badRemove: '=' will run function from child controller instead of parent
            },
            controller: FoundItemsDirectiveController,
            controllerAs: 'dirCtlr',
            bindToController: true

        };

        return ddo;
    }

    // not needed in this excercise but nice to have as template 
    function FoundItemsDirectiveController() {
        //you can add functionality here for current scope
    }

    NarrowItDownController.$inject = ["MenuSearchService"];
    function NarrowItDownController(MenuSearchService) {
        var cntr = this;

        cntr.found = [];
        cntr.message = "";

        cntr.search = function (searchTerm) {
            var promise = MenuSearchService.getMatchedMenuItems(searchTerm);

            promise.then(function (data) {
                cntr.found = data;
                if (data.length === 0){
                    cntr.message = "Nothing found";
                }
                else{
                    cntr.message = "";
                }
                    
            });
        };

        cntr.remove = function (index) {
            cntr.found.splice(index, 1);
        };
    }

    MenuSearchService.$inject = ['$http', "ApiBasePath"];
    function MenuSearchService($http, ApiBasePath) {
        var service = this;

        service.getMatchedMenuItems = function (searchTerm) {   
            console.log("searchTerm", searchTerm);
            return $http({
                method: "GET",
                url: ApiBasePath + "/menu_items.json"
            }).then(function (result) {
                var foundItems = [];
                var returnAll = searchTerm === undefined || searchTerm === '';

                angular.forEach(result.data.menu_items, function (item) {
                    try {
                        if (returnAll || item.description.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
                            foundItems.push({ 'name': item.name, 'desc': item.description, 'prize': item.price_large });
                        }
                    } catch (error) {
                        console.log(error);
                    }
                });
                return foundItems;
            }).catch(function (error) {
                console.log(error.status, error.statusText);
            });
        };
    }


})();