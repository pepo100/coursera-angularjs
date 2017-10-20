(function () {
    'use strict';

    angular.module("LunchCheck", [])
        .controller("LunchCheckController", LunchCheckController);

    LunchCheckController.$inject = ['$scope'];
    function LunchCheckController($scope) {

        $scope.items = "";
        $scope.message = "";
        $scope.messageClass = "message";

        $scope.calculateSize = function () {
            var itemsCount = 0;

            angular.forEach($scope.items.split(","), function (item) {
                if (item.trim() !== "")
                    itemsCount++;
            });

            if (itemsCount !== 0) {
                $scope.messageClass = "messageGreen";

                
                if (itemsCount <= 3)
                    $scope.message = "Enjoy";
                else
                    $scope.message = "Too much!";
            } else {
                $scope.message = "Please enter data first";
                $scope.messageClass = "messageRed";
            }
        };
           
    }
})();