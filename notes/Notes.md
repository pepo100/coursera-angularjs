# Notes

#### Table of Contents
1. [Week 1]
   1. [IIFE](#iife)
   2. [Controllers](#controllers)
   3. [Property annotation](#property-annotation)
2. [Week 2]
   1. [Filters](#filters)
   2. [Digest](#digest)
   3. [repeat, if, show, hide](#ng-repeat)
   4. [Services](#services)
3. [Week 3]
   1. [Promises](#promises)
   2. [Ajax](#ajax)
   3. [Directives](#directives)
4. [Week 4]
   1. [Components](#components)
   2. [Events](#events)
   3. [Modules](#modules)
   4. [Routing](#routing)


#### Resources:
[Coursera - Angularjs](https://www.coursera.org/learn/single-page-web-apps-with-angularjs)

[W3 School](https://www.w3schools.com/angular/)

[Angular Guide](https://docs.angularjs.org/guide/)

## Week 1
Angular Introduction 

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
## Week 2
Filters, Digest Cycle, Controller Inheritance, and Custom Services

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
``` 

**js - filter**
``` javascript
var searchValue = "Bismol";

function containsFilter(value) {
      return value.indexOf(searchValue) !== -1;
}
var searchedShoppingList = shoppingList.filter(containsFilter);
```
**angular - filter**

https://docs.angularjs.org/api/ng/filter/filter
```html
<tr ng-repeat="friend in friends | filter:searchText">
```

#### digest
The $scope.$digest() function iterates through 
all the watches in the $scope object, 
and its child $scope objects (if it has any). 
When $digest() iterates over the watches, 
it calls the value function for each watch. 
If the value returned by the value function is different than the value 
it returned the last time it was called, the listener function for that watch is called.

The $scope.$apply() function takes a function as parameter which is executed, and after that $scope.$digest() is called internally

Example: after $timeaout function diggest will be executed
``` javascript
CounterController.$inject = ['$scope', '$timeout'];

run diggest after function is done 

function CounterController($scope, $timeout) {
      $scope.counter = 0;

      $scope.upCounter = function () {
           $timeout(function () {
                 $scope.counter++;
                 console.log("Counter incremented!");
       }, 2000);
};
```


One time binding:
{{ :: fullName }}

Watcher counts:
console.log("# of Watchers: ", $scope.$$watchersCount);

#### ng-repeat

``` javascript
var shoppingList1 = [
"Milk", "Donuts", "Cookies", "Chocolate", "Peanut Butter", "Pepto Bismol", "Pepto Bismol (Chocolate flavor)", "Pepto Bismol (Cookie flavor)"
];

var shoppingList2 = [
{
name: "Milk",
quantity: "2"
},
{
name: "Donuts",
quantity: "200"
},

 

function ShoppingListController($scope) {
    $scope.shoppingList1 = shoppingList1;
    $scope.shoppingList2 = shoppingList2;

    $scope.addToList = function () {
          var newItem = {
              name: $scope.newItemName,
              quantity: $scope.newItemQuantity
          };

         $scope.shoppingList2.push(newItem);
    };

```

``` html
Get shopping List:
<li ng-repeat = "item in shoppingList2" {{$index + 1}}. Buy {{item.quantity}} of {{item.name}}(s) </li>

Add to shopping list:
<input type="text" ng-model="newItemName" placeholder="item name">

<input type="text" ng-model="newItemQuantity" placeholder="item quantity">

<button ng-click="addToList()">Add To List</button>
```

**ng-if, ng-show, ng-hide**
``` html

<div ng-if="list.errorMessage" class="error">Error: {{list.errorMessage}}</div>
<div ng-show="list.errorMessage" class="error">Error: {{list.errorMessage}}</div>
<div ng-hide="!list.errorMessage" class="error">Error: {{list.errorMessage}}</div>
```

#### Services

Service - single instance

``` javascript
angular.module('ShoppingListApp', [])
.controller('ShoppingListAddController', ShoppingListAddController)
.controller('ShoppingListShowController', ShoppingListShowController)
.service('ShoppingListService', ShoppingListService);

ShoppingListAddController.$inject = ['ShoppingListService'];
function ShoppingListAddController(ShoppingListService) {

    var itemAdder = this;

    itemAdder.itemName = "";
    itemAdder.itemQuantity = "";

    itemAdder.addItem = function () {
            ShoppingListService.addItem(itemAdder.itemName, itemAdder.itemQuantity);
    }
}


ShoppingListShowController.$inject = ['ShoppingListService'];
function ShoppingListShowController(ShoppingListService) {

    var showList = this;

    showList.items = ShoppingListService.getItems();

    showList.removeItem = function (itemIndex) {
           ShoppingListService.removeItem(itemIndex);
    };
}


function ShoppingListService() {

    var service = this;

    // List of shopping items
    var items = [];

    service.addItem = function (itemName, quantity) {
        var item = {
              name: itemName,
              quantity: quantity
        };
        items.push(item);
    };

    service.removeItem = function (itemIdex) {
           items.splice(itemIdex, 1);
    };

    service.getItems = function () {
           return items;
    };
```

**Service Factory**

```javascript
function ShoppingListFactory() {
    var factory = function (maxItems) {
          return new ShoppingListService(maxItems);
     };
    return factory;
    }
})();

angular.module('ControllerAsApp', [])
.controller('ShoppingListController1', ShoppingListController1)
.controller('ShoppingListController2', ShoppingListController2)
.factory('ShoppingListFactory', ShoppingListFactory);

 
// LIST #1 - controller
ShoppingListController1.$inject = ['ShoppingListFactory'];
function ShoppingListController1(ShoppingListFactory) {
     var list1 = this;

     // Use factory to create new shopping list service
     var shoppingList = ShoppingListFactory(3);

     list1.items = shoppingList.getItems();

```

**Service Provider + config**

``` javascript 

function ShoppingListServiceProvider() {
     var provider = this;

      provider.defaults = {
          maxItems: 10
       };

      provider.$get = function () {
         var shoppingList = new ShoppingListService(provider.defaults.maxItems);

      return shoppingList;
      };
}

angular.module('ShoppingListApp', [])
.controller('ShoppingListController', ShoppingListController)
.provider('ShoppingListService', ShoppingListServiceProvider)
.config(Config);

Config.$inject = ['ShoppingListServiceProvider'];
function Config(ShoppingListServiceProvider) {
       ShoppingListServiceProvider.defaults.maxItems = 2;
}


ShoppingListController.$inject = ['ShoppingListService'];
function ShoppingListController(ShoppingListService) {
      var list = this;

      list.items = ShoppingListService.getItems();
...
```

## Week 3
Promises, Ajax, and Custom Directives

#### Promises

Asynchronous with promises and $q

``` javascript
WeightLossFilterService.$inject = ['$q'];
function WeightLossFilterService($q) { {
    
    service.checkName = function(name){
        var deferred = $q.defer(); // create async environmnet

        var result = {
             message: "" 
        };

        $timeout(function () {
             // Check for cookies
             if (name.toLowerCase().indexOf('cookie') === -1) {
                    deferred.resolve(result) // marks successfull
             }
             else {
                    result.message = "Stay away from cookies, Yaakov!";
                    deferred.reject(result); // marks unsucessfull
             }
        }, 3000);

        return deferred.promise; //return promise
    }
}
```
with one promise
``` js

caller function() {

    var promise = asyncFunction();

    promise.then(function (result) {

        //do something with result

    },

    function(error) {

         //do something with error

    });

}
```

with multiple sequentially
``` javascript
var promise = WeightLossFilterService.checkName(name);

promise
.then(function (response) {
    return WeightLossFilterService.checkQuantity(quantity);
 })
 .then(function (response) {
       var item = {
             name: name,
             quantity: quantity
        };
       items.push(item);
 })
 .catch(function (errorResponse) {
        console.log(errorResponse.message);
 });
```

with multiple paralller

``` javascript
var namePromise = WeightLossFilterService.checkName(name);
var quantityPromise = WeightLossFilterService.checkQuantity(quantity);

$q.all([namePromise, quantityPromise]).
 then(function (response) {
          var item = {
                 name: name,
                 quantity: quantity
          };
         items.push(item);
})
.catch(function (errorResponse) {
         console.log(errorResponse.message);
});
```

#### Ajax
``` javascript
service.getMenuForCategory = function (shortName) {
       var response = $http({
             method: "GET",
             url: (ApiBasePath + "/menu_items.json"),
             params: {
                     category: shortName
             }
        });

        return response;
};

}
```

#### Directives

``` javascript

angular.module('ShoppingListDirectiveApp', [])
.controller('ShoppingListController1', ShoppingListController1)
.controller('ShoppingListController2', ShoppingListController2)
.factory('ShoppingListFactory', ShoppingListFactory)
.directive('listItemDescription', ListItemDescription)
.directive('listItem', ListItem);


function ListItem() {

    var ddo = {
           templateUrl: 'listItem.html'
    };

    return ddo;

}

function ListItemDescription() {
    var ddo = {
        template: '{{ item.quantity }} of {{ item.name }}'
        restrict: "E",
    };

    return ddo;
}
```

restrict:

* 'A' - only matches attribute name
* 'E' - only matches element name
* 'C' - only matches class name
* 'M' - only matches comment


## Week 4
Components, Events, Modules, Routers

#### Components
 Component is a special kind of directive that uses a simpler configuration which is suitable for a component-based application structure.

Declaration:
``` javascript
angular.module('ShoppingListComponentApp', [])
.controller('ShoppingListController', ShoppingListController)
.factory('ShoppingListFactory', ShoppingListFactory)
.component('shoppingList', {
  templateUrl: 'shoppingList.html',
  controller: ShoppingListComponentController,
  bindings: {
    items: '<',
    myTitle: '@title',
    onRemove: '&'
  }
}); 

````

Components have a well-defined lifecycle

* $onInit() - Called on each controller after all the controllers on an element have been constructed and had their bindings initialized (and before the pre & post linking functions for the directives on this element). This is a good place to put initialization code for your controller.
* $onChanges(changesObj) - Called whenever one-way bindings are updated. The changesObj is a hash whose keys are the names of the bound properties that have changed, and the values are an object of the form { currentValue, previousValue, isFirstChange() }. Use this hook to trigger updates within a component such as cloning the bound value to prevent accidental mutation of the outer value.
* $doCheck() - Called on each turn of the digest cycle. Provides an opportunity to detect and act on changes. Any actions that you wish to take in response to the changes that you detect must be invoked from this hook; implementing this has no effect on when $onChanges is called. For example, this hook could be useful if you wish to perform a deep equality check, or to check a Date object, changes to which would not be detected by AngularJS's change detector and thus not trigger $onChanges. This hook is invoked with no arguments; if detecting changes, you must store the previous value(s) for comparison to the current values.
* $onDestroy() - Called on a controller when its containing scope is destroyed. Use this hook for releasing external resources, watches and event handlers.
* $postLink() - Called after this controller's element and its children have been linked. Similar to the post-link function this hook can be used to set up DOM event handlers and do direct DOM manipulation. Note that child elements that contain templateUrl directives will not have been compiled and linked since they are waiting for their template to load asynchronously and their own compilation and linking has been suspended until that occurs. This hook can be considered analogous to the ngAfterViewInit and ngAfterContentInit hooks in Angular. Since the compilation process is rather different in AngularJS there is no direct mapping and care should be taken when upgrading.

``` javascript
ShoppingListComponentController.$inject = ['$element']
function ShoppingListComponentController($element) {
  var $ctrl = this;
  var totalItems;
...
  $ctrl.$onInit = function () {
    totalItems = 0;
  };

  $ctrl.$onChanges = function (changeObj) {
    console.log("Changes: ", changeObj);
  }

  $ctrl.$doCheck = function () {
    if ($ctrl.items.length !== totalItems) {
      console.log("# of items changed. Checking for Cookies!");
      totalItems = $ctrl.items.length;
      if ($ctrl.cookiesInList()) {
        console.log("Oh, NO! COOKIES!!!!!");
        var warningElem = $element.find('div.error');
        warningElem.slideDown(900);
      }
      else {
        console.log("No cookies here. Move right along!");
        var warningElem = $element.find('div.error');
        warningElem.slideUp(900);
      }
    }
  };  
...
```

#### Events

* Publish-subscribe from anywhere in system
* $scope.$emit sends the event up to scope
* $scope.$broadcas down the chain

* to all nodes use $rootScope.$broadcast (must be deregister)
* listen -> $scope.$on, $rootScope.$on

``` javascript
.component('shoppingList', {
  templateUrl: 'shoppingList.html',
  controller: ShoppingListComponentController,
  bindings: {
    items: '<',
    myTitle: '@title',
    onRemove: '&'
  }
})
.component('loadingSpinner', {
  templateUrl: 'spinner.html',
  controller: SpinnerController
});
```

``` javascript
SpinnerController.$inject = ['$rootScope']
function SpinnerController($rootScope) {
  var $ctrl = this;

  var cancelListener = $rootScope.$on('shoppinglist:processing', function (event, data) {
    console.log("Event: ", event);
    console.log("Data: ", data);

    if (data.on) {
      $ctrl.showSpinner = true;
    }
    else {
      $ctrl.showSpinner = false;
    }
  });

  $ctrl.$onDestroy = function () {
    cancelListener();
  };

}; 
```

``` javascript
ShoppingListComponentController.$inject = ['$rootScope', '$element', '$q', 'WeightLossFilterService']
function ShoppingListComponentController($rootScope, $element, $q, WeightLossFilterService) {
  var $ctrl = this;
  var totalItems;

  $ctrl.$onInit = function () {
    totalItems = 0;
  };


  $ctrl.$doCheck = function () {
    if ($ctrl.items.length !== totalItems) {
      totalItems = $ctrl.items.length;

      $rootScope.$broadcast('shoppinglist:processing', {on: true});
      var promises = [];
      for (var i = 0; i < $ctrl.items.length; i++) {
        promises.push(WeightLossFilterService.checkName($ctrl.items[i].name));
      }

      $q.all(promises)
      .then(function (result) {
        // Remove cookie warning
        var warningElem = $element.find('div.error');
        warningElem.slideUp(900);
      })
      .catch(function (result) {
        // Show cookie warning
        var warningElem = $element.find('div.error');
        warningElem.slideDown(900);
      })
      .finally(function () {
        $rootScope.$broadcast('shoppinglist:processing', { on: false });
      });
    }
  };

```

#### Modules
Provide modularity for your application

* module.config method fires before module.run 
* dependency modules get configured first 

**project structure**
Example 

* css
* images
* lib
	* angular.min.js
	* jquery-3.1.0.min.js
* src
	* shoppinglist
      * shoppinglist.component.js
      * shoppinglist.controller.js
      * shoppinglist.factory.js
      * shoppinglist.module.js
      * shoppinglist.template.html
      * weigthlossfilter.service
    * spinner
      * loadingspinner.component.js
      * loadingspinner.template.html
      * spinner.module
 
```html
 <!-- Libraries -->
    <script src="lib/jquery-3.1.0.min.js"></script>
    <script src="lib/angular.min.js"></script>

    <!-- Modules -->

    <script src="src/shoppinglist/shoppinglist.module.js"></script>
    <script src="src/spinner/spinner.module.js"></script>

    <!-- 'ShoppingList' module artifacts -->
    <script src="src/shoppinglist/shoppinglist.component.js"></script>
    <script src="src/shoppinglist/shoppinglist.controller.js"></script>
    <script src="src/shoppinglist/shoppinglist.factory.js"></script>
    <script src="src/shoppinglist/weightlossfilter.service.js"></script>

    <!-- 'Spinner' module artifacts -->
    <script src="src/spinner/loadingspinner.component.js"></script>
```

shoppinglist.module:
```javascript
(function () {
'use strict';

angular.module('ShoppingList', ['Spinner']);

angular.module('ShoppingList')
.config(function () {
  console.log("ShoppingList config fired.");
})
.run(function () {
  console.log("ShoppingList run fired.");
});

})(); 
```

shoppinglist.component.module:
```javascript
(function () {
'use strict';

angular.module('ShoppingList')
.component('shoppingList', {
  templateUrl: 'src/shoppinglist/shoppinglist.template.html',
  controller: ShoppingListComponentController,
  bindings: {
    items: '<',
    myTitle: '@title',
    onRemove: '&'
  }
});


ShoppingListComponentController.$inject = ['$rootScope', '$element', '$q', 'WeightLossFilterService']
function ShoppingListComponentController($rootScope, $element, $q, WeightLossFilterService) { 
```
#### Routing

ngRoute | ui-router
--------|------
Google | Community
No UI state | UI state is central
Route by URL | UI state base URL
No nested views | Nested view
OK for prototypes | most popular

``` javascript

(function () {

angular.module('RoutingApp',['ui.router']);

angular.module('RoutingApp')
.config(RoutesConfig);

RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
function RoutesConfig($stateProvider, $urlRouterProvider) {

  // Redirect to tab 1 if no other URL matches
  $urlRouterProvider.otherwise('/tab1'); 

  // Set up UI states
  $stateProvider
    .state('tab1', {
      url: '/tab1', // optional-> change url
      templateUrl: 'src/tab1.html'
    })

    .state('tab2', {
      url: '/tab2',
      templateUrl: 'src/tab2.html'
    });
}


})(); 

```

index.html
```html
    <div class="tabs">
      <a ui-sref="tab1" ui-sref-active="activeTab">Tab 1</a> //ui-sref-active set up class for Tab1 if active
      <a ui-sref="tab2" ui-sref-active="activeTab">Tab 2</a>
      <!-- <button ui-sref="tab2">Tab 2</button> -->
    </div>

    <ui-view></ui-view>

    <!-- Libraries -->
    <script src="lib/angular.min.js"></script>
    <script src="lib/angular-ui-router.min.js"></script>


```

**state with controller**
declare a controller that is responsible for the state's template right in the state's declaration

```javascript
  // *** Set up UI states ***
  $stateProvider

  // Home page
  .state('home', {
    url: '/',
    templateUrl: 'src/shoppinglist/templates/home.template.html'
  })

  // Premade list page
  .state('mainList', {
    url: '/main-list',
    templateUrl: 'src/shoppinglist/templates/main-shoppinglist.template.html',
    controller: 'MainShoppingListController as mainList'
  });
}
```
main-shoppinglist.template.html:

```html
<!-- <div id="list" ng-controller='MainShoppingListController as mainList'> -->
  <a ui-sref="home">Home</a> &lt; <span>List</span>
  <h3>Premade List with Absolutely No Cookies in it</h3>
  <shopping-list items="mainList.items"></shopping-list>
<!-- </div> -->

```

##### Handling data with routing

* **Resolve** property can be used to inject values directly into the controller responsible for the state.
	* If resolve property is a promis -> will not render state until datas retrieve

routes.js:
```javascript
.state('mainList', {
    url: '/main-list',
    templateUrl: 'src/shoppinglist/templates/main-shoppinglist.template.html',
    controller: 'MainShoppingListController as mainList',
    resolve: {
      items: ['ShoppingListService', function (ShoppingListService) {
        return ShoppingListService.getItems();
      }]
    }
  });

```

main-shoppinglist.controler.js:
``` js
// MainShoppingListController.$inject = ['ShoppingListService'];
// function MainShoppingListController(ShoppingListService) {
MainShoppingListController.$inject = ['items'];
function MainShoppingListController(items) {
  var mainList = this;
  mainList.items = items;

  // mainList.$onInit = function () {
  //   ShoppingListService.getItems()
  //   .then(function (result) {
  //     mainList.items = result;
  //   });
  // };
}
```

* State's url property can be declared with **parameters** "/{paramName}"
	* user $stateParams service to retrieve parameters "$stateParams.paramName
    * construct a ulr with ui-sref directive: ui-sref="stateName({paramName: value})

routes.js
``` js
.state('itemDetail', {
    url: '/item-detail/{itemId}',
    templateUrl: 'src/shoppinglist/templates/item-detail.template.html',
    controller: 'ItemDetailController as itemDetail',
    resolve: {
      item: ['$stateParams', 'ShoppingListService',
            function ($stateParams, ShoppingListService) {
              return ShoppingListService.getItems()
                .then(function (items) {
                  return items[$stateParams.itemId];
                });
            }]
    }
  }); 
```

shoppinglist.template.html:
``` html
<ul>
  <li ng-repeat="item in $ctrl.items"
      ui-sref="itemDetail({itemId: $index})">
    {{ item.quantity }} of {{ item.name }}
  </li>
</ul>
```

* Nested states allow nested views
  * Parent state has ui-view for child state 
  * child state is declared as parent.child
  * Parent resolve property is inherited by child

reuters.js:
``` js
  // Item detail
  .state('mainList.itemDetail', {
    // url: '/item-detail/{itemId}',
    templateUrl: 'src/shoppinglist/templates/item-detail.template.html',
    controller: 'ItemDetailController as itemDetail',
    params: {
      itemId: null
    }
  });
```

main-shoppinglist.template.html:
``` html
<a ui-sref="home">Home</a> &lt; <span>List</span>

<h3>Premade List with Absolutely No Cookies in it</h3>
<shopping-list items="mainList.items"></shopping-list>

<ui-view></ui-view>

```

* ui-router State Change Events
  * exposes numerous change events
  * all are fired to $rootScope
  * $stateChangeStart - starts the state transition
    * call event.preventDefault() to prevent the transition
  * $stateChangeSuccess - indicates a successful transition
  * $stateChangeError -indicates error (including errors in the resolve)
    * catch ALL errors during state change

spinner.component.js
``` js
SpinnerController.$inject = ['$rootScope']
function SpinnerController($rootScope) {
  var $ctrl = this;
  var cancellers = [];

  $ctrl.$onInit = function () {
    var cancel = $rootScope.$on('$stateChangeStart',
    function(event, toState, toParams, fromState, fromParams, options){
      $ctrl.showSpinner = true;
    });
    cancellers.push(cancel);

    cancel = $rootScope.$on('$stateChangeSuccess',
    function(event, toState, toParams, fromState, fromParams){
      $ctrl.showSpinner = false;
    });
    cancellers.push(cancel);

    cancel = $rootScope.$on('$stateChangeError',
    function(event, toState, toParams, fromState, fromParams, error){
      $ctrl.showSpinner = false;
    });
    cancellers.push(cancel);
  };

  $ctrl.$onDestroy = function () {
    cancellers.forEach(function (item) {
      item();
    });
  };

};
```