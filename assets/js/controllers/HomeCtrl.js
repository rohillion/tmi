tmi.controller('HomeCtrl', ['$scope', 'Auth', 'User', 'Dish', 'Order', 'API_URL', 'Upload', 'OrderForm', 'NgMap', function ($scope, Auth, User, Dish, Order, API_URL, Upload, OrderForm, NgMap) {

    $scope.mapLoaded = false;

    $scope.orderForm = OrderForm.getScope();

    $scope.user = {};
    $scope.dish = {};
    $scope.map = {};
    $scope.dishHistory = [];
    $scope.order = {
        qty: 1,
        active: true
    };

    //Dublin by default
    $scope.mapPos = {
        lat: 53.3462285,
        lng: -6.28822
    };

    //List dishes
    $scope.listDish = function (filters, callback) {
        Dish.query(filters, function (dish) {
            if (typeof callback === 'function')
                callback(dish);
        }, function (err) {
            console.log(err.data);
            alert(err.data.summary);
        });
    }

    //Get current user
    Auth.currentUser().then(function (user) {
        $scope.user = user.data;
        if ($scope.user.admin) {
            dropdownInit();
            dimmerInit();
        }
        if ($scope.user.id)
            $scope.order.client = $scope.user.id
    });

    //Create new dish
    $scope.createDish = function () {

        //Set old dish inactive
        if ($scope.dish.active) {
            $scope.dish.active = false;
            $scope.saveDish();
        }

        //Create new dish as active
        Dish.save({
            name: "New Dish...",
            price: "0.00",
            active: true,
            imagePath: '/images/image.png'
        }, function (dish) {
            $scope.dish = dish;
            refreshHistory();
        }, function (err) {
            console.log(err.data);
            alert(err.data.summary);
        });
    }

    //Save changes on blur event
    $scope.saveDish = function (callback) {
        $scope.updateDish($scope.dish, callback);
    }

    //Update changes on blur event
    $scope.updateDish = function (dish, callback) {
        if(dish.price && dish.price.indexOf(',') > 0)
            dish.price = dish.price.replace(",", ".");
        
        Dish.update({
            id: dish.id
        }, dish, function (dish) {
            if (typeof callback === 'function')
                callback(dish);
        }, function (err) {
            console.log(err.data);
            console.log(err.data.summary);
            alert(err.data.summary);
        });
    }

    //Delete dish
    $scope.deleteDish = function () {
        Dish.delete({
            id: $scope.dish.id
        }, function () {
            $scope.dish = {};
            changeActive($scope.dishHistory[0].id);
        }, function (err) {
            console.log(err.data);
            alert(err.data.summary);
        });
    }

    $scope.fileSelected = function (files) {
        if (files && files.length) {
            $('.image-loading').dimmer('show');
            $scope.file = files[0];

            Upload
                .upload({
                    url: '/image/' + $scope.dish.id,
                    file: $scope.file
                }).then(function (res) {
                    $scope.dish.imagePath = res.data.url;
                    console.log(res, 'uploaded');
                    $scope.file = {};
                    $('.image-loading').dimmer('hide');
                }, function (resp) {
                    console.log('Error status: ' + resp.status);
                    $scope.file = {};
                    $('.image-loading').dimmer('hide');
                }, function (evt) {
                    console.log(evt);
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage);
                });
        }
    };

    //Show order/login modal
    $scope.open = function () {
        if (!$scope.mapLoaded) {
            $scope.mapLoaded = true;
            NgMap.getMap().then(function (map) {
                //Store map object and adjust marker and center position
                $scope.map = map;
                if ($scope.user.location && $scope.user.location.lat) {
                    $scope.mapPos = $scope.markerPos = {
                        lat: $scope.user.location.lat,
                        lng: $scope.user.location.lng
                    }
                }
            });
        }
        OrderForm.open();
    }

    $scope.close = function () {
        OrderForm.close();
    }

    $scope.updateLocation = function () {

        //Retreive new place
        var place = this.getPlace();

        //Set data to update
        var data = {
            address: place.formatted_address,
            location: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            }
        };

        $scope.updateUser(data, function (user) {
            //Update map position and markers.
            $scope.user.location = user.location;
            $scope.map.setCenter(place.geometry.location);
            $scope.markerPos = {
                lat: user.location.lat,
                lng: user.location.lng
            }
        });
    }

    //Update user
    $scope.updateUser = function (data, callback) {
        User.update({
            id: $scope.user.id
        }, data, function (user) {
            if (typeof callback === 'function')
                callback(user);
        }, function (err) {
            console.log(err.data);
            alert(err.data.summary);
        });
    }

    $scope.createOrder = function () {
        if ($scope.order.dish) {
            Order.save($scope.order, function (order) {
                $scope.close();
                OrderForm.ordered();
            }, function (err) {
                console.log(err.data);
                alert(err.data.summary);
            });
        }
    }


    //Init jQuery dropdown
    function dropdownInit() {
        setTimeout(function () {
            $('.dish-picker').dropdown({
                onChange: function (dish_id, text, $selectedItem) {
                    changeActive(dish_id);
                }
            });
        }, 0);
    }

    //Init jQuery dimmer
    function dimmerInit() {
        $('.dimmer,.image-loading').dimmer({
            closable: false
        });
    }

    $scope.init = function () {
        $scope.listDish({
            active: true
        }, setDish);

        refreshHistory();
    }

    //Change active dish
    function changeActive(dish_id) {
        $scope.updateDish({
            id: dish_id,
            active: true
        }, function (dish) {
            if ($scope.dish.active) {
                //Unset current active dish
                $scope.dish.active = false;
                $scope.saveDish(function () {
                    //Set new active dish
                    $scope.dish = dish;
                    refreshHistory();
                });
            } else {
                $scope.dish = dish;
                refreshHistory();
            }
        }, function (err) {
            console.log(err.data);
            alert(err.data.summary);
        });
    }

    function refreshHistory() {
        $scope.listDish({
            active: false
        }, setDishHistory);
    }

    function setDish(dish) {
        if (dish[0]) {
            $scope.dish = dish[0];
            $scope.order.dish = $scope.dish.id;
        }
    }

    function setDishHistory(dishes) {
        if (dishes)
            $scope.dishHistory = dishes;
    }
}]);