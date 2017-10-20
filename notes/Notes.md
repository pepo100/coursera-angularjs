# Notes

#### Table of Contents
1. [Resources](#Resources)
2. [IIFE]
3. [Controllers]
4. [Property annotation]
5. [Filters]
#### Resources:
[Coursera - Angularjs](https://www.coursera.org/learn/single-page-web-apps-with-angularjs)

[W3 School](https://www.w3schools.com/angular/)

[Angular Guide](https://docs.angularjs.org/guide/)

#### IIFE
It's an Immediately-Invoked Function Expression, or IIFE for short. It executes immediately after it's created.

This pattern is often used when trying to avoid polluting the global namespace, because all the variables used inside the IIFE (like in any other normal function) are not visible outside its scope.

```javascript
(function () {
'use strict';

})();
```

#### Controllers
AngularJS applications are controlled by controllers.

The ng-controller directive defines the application controller.

```javascript
.controller('NameCalculatorController', function ($scope) {
	$scope.name = "";
	$scope.totalValue = 0;

	$scope.displayNumeric = function () {
		var totalNameValue = calculateNumericForString($scope.name);
		$scope.totalValue = totalNameValue;
	};


function calculateNumericForString(string) {
	var totalStringValue = 0;
	for (var i = 0; i < string.length; i++) {
		totalStringValue += string.charCodeAt(i);
	}

	return totalStringValue;
}

});

```
#### Property annotation

To allow the minifiers to rename the function parameters and still be able to inject the right services
```javascript
DIController.$inject = ['$scope', '$filter'];
function DIController($scope, $filter) {
	$scope.name = "Yaakov";

	$scope.upper = function () {
	var upCase = $filter('uppercase');
		$scope.name = upCase($scope.name);
	};
}
```

#### Filters
Filters format the value of an expression for display to the user.

[build-in filters](https://docs.angularjs.org/api/ng/filter)
```javascript
MsgController.$inject = ['$scope', '$filter'];
function MsgController($scope, $filter) {
	$scope.name = "Yaakov";
	$scope.stateOfBeing = "hungry";
	$scope.cookieCost = .45;

	$scope.sayMessage = function () {
		var msg = "Yaakov likes to eat healthy snacks at night!";
		var output = $filter('uppercase')(msg);
	return output;
};

//OR IN TEMPLATE

Feed Yaakov Cost: {{ cookieCost | currency : "#blah" : 4 }}

```

**chaining**
```
{{ sayLovesMessage() | truth : 'healthy' : 'cookie' | uppercase }}
```

**custom filters**
``` javascript
angular.module('MsgApp', [])
	.controller('MsgController', MsgController)
	.filter('loves', LovesFilter)

function LovesFilter() {
	return function (input) {
		input = input || "";
		input = input.replace("likes", "loves");
	return input;
	};
}

MsgController.$inject = ['$scope', 'lovesFilter'];

function MsgController($scope, lovesFilter) {

$scope.sayLovesMessage = function () {
	var msg = "Yaakov likes to eat healthy snacks at night!";
	msg = lovesFilter(msg)
	return msg;
};
``` javascript