tmi.controller('SidebarCtrl', ['$scope', 'Order', 'Auth', 'OrderForm', 'snapRemote', function ($scope, Order, Auth, OrderForm, snapRemote) {

    $scope.user = $scope.orderToCancel = {};
    $scope.orders = [];

    $scope.init = function () {
        getUser();
    }

    $scope.setCancelOrder = function (order) {
        console.log(order.id);
        $scope.orderToCancel = order;
    }
    
    $scope.keepOrder = function () {
        $scope.orderToCancel = {};
    }

    $scope.cancelOrder = function () {
        $scope.orderToCancel.active = false;
        updateOrder($scope.orderToCancel, function (res) {
            getOrders();
            $scope.orderToCancel = {};
        });
    }

    $scope.orderFormScope = OrderForm.getScope();
    $scope.$watch('orderFormScope.ordered', function (newOrder) {
        if (newOrder)
            getOrders(function () {
                snapRemote.open('right');
            });
    });

    function updateOrder(order, callback) {
        //Update order
        Order.update({
            id: order.id
        }, order, function (res) {
            if (typeof callback === 'function')
                callback(res.data);
        }, function (err) {
            console.log(err.data);
            alert(err.data.summary);
        });
    }

    function getUser() {
        //Get current user
        Auth.currentUser().then(function (user) {
            $scope.user = user.data;
            if ($scope.user.admin) {

            }
            if ($scope.user.id)
                getOrders();
        });
    }

    function getOrders(callback) {
        Order.query({
            client: $scope.user.id,
            active: true
        }, function (orders) {
            console.log(orders);
            $scope.orders = orders;
            if (typeof callback === 'function')
                callback(orders);
        }, function (err) {
            console.log(err.data);
            alert(err.data.summary);
        });
    }
}]);