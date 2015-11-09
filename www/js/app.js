// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'firebase'])

app.factory("Items", function($firebaseArray) {
    var itemsRef = new Firebase("https://foodsta.firebaseio.com/items");
    return $firebaseArray(itemsRef);
})

app.factory("Auth", function($firebaseAuth) {
    var usersRef = new Firebase("https://foodsta.firebaseio.com/");
    return $firebaseAuth(usersRef);
})

app.controller("ListCtrl", function($scope, $ionicListDelegate, Items) {

    $scope.items = Items;

    $scope.purchaseItem = function(item) {
        var itemRef = new Firebase("https://foodsta.firebaseio.com/items/" + item.$id);
        itemRef.child('status').set('purchased');
        $ionicListDelegate.closeOptionButtons();
    };

});

app.controller("AddCtrl", function($scope, Items) {

    $scope.items = Items;

    $scope.addItem = function() {
        var name = $('[data-action=nameInput]').val();
        if (name) {
            $scope.items.$add({
                "name": name
            });
        }
    };

});

app.controller("ProfileCtrl", function($scope, Auth) {
    var usersRef = new Firebase("https://foodsta.firebaseio.com"); 
    var isNewUser = true;

    $scope.login = function() {
        Auth.$authWithOAuthRedirect("facebook");
    };

    $scope.logout = function() {
        Auth.$unauth();
    };

    Auth.$onAuth(function(authData) {
        if (authData && isNewUser) {
            // save the user's profile into the database so we can list users,
            // use them in Security and Firebase Rules, and show profiles
            usersRef.child("users").child(authData.uid).set({
                provider: authData.provider,
                name: getName(authData)
            });
        }
        $scope.authData = authData; // This will display the user's name in our view
    });

    // find a suitable name based on the meta info given by facebook
    function getName(authData) {
        switch(authData.provider) {
            case 'facebook':
                return authData.facebook.displayName;
        }
    }
});

app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/list')
    $stateProvider
    .state('list', {
        url: '/list',
        templateUrl: 'list.html',
        controller: 'ListCtrl'
    })
    .state('add', {
        url: '/add',
        templateUrl: 'add.html',
        controller: 'AddCtrl'
    })
    .state('account', {
        url: '/account',
        templateUrl: 'account.html'
    })
})