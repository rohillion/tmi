tmi.factory('OrderForm', ['$rootScope', function ($rootScope) {

    var scope = $rootScope.$new(true);
    scope.opened = scope.ordered = false;

    return {
        open: function () {
            scope.opened = true;
        },
        close:function(){
            scope.opened = false;
        },
        ordered:function(){
            scope.ordered = Math.random();
        },
        getScope:function(){
            return scope;
        }
    }
}]);