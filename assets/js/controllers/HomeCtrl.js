tmi.controller('HomeCtrl', ['$scope', 'Auth', 'Dish', 'API_URL', 'Upload', function ($scope, Auth, Dish, API_URL, Upload) {

    $scope.dish = {};
    $scope.dishHistory = [];

    //List dishes
    $scope.listDish = function (filters, callback) {
        Dish.query(filters, function (dish) {
            if (typeof callback === 'function')
                callback(dish);
        });
    }

    //Get current user
    $scope.user = {};
    Auth.currentUser().then(function (user) {
        $scope.user = user.data;
        if ($scope.user.admin) {
            dropdownInit();
            dimmerInit();
        }
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
            price: "0,00",
            active: true,
            imagePath: '/images/image.png'
        }, function (dish) {
            $scope.dish = dish;
            refreshHistory();
        });
    }

    //Save changes on blur event
    $scope.saveDish = function (callback) {
        $scope.updateDish($scope.dish, callback);
    }

    //Update changes on blur event
    $scope.updateDish = function (dish, callback) {
        Dish.update({
            id: dish.id
        }, dish, function (dish) {
            if (typeof callback === 'function')
                callback(dish);
        });
    }

    //Delete dish
    $scope.deleteDish = function () {
        Dish.delete({
            id: $scope.dish.id
        }, function () {
            $scope.dish = {};
            changeActive($scope.dishHistory[0].id);
        });
    }

    $scope.fileSelected = function (files) {
        if (files && files.length) {
            $('.dimmer').dimmer('show');
            $scope.file = files[0];

            Upload
                .upload({
                    url: '/image/' + $scope.dish.id,
                    file: $scope.file
                }).then(function (res) {
                    $scope.dish.imagePath = res.data.url;
                    console.log(res, 'uploaded');
                    $scope.file = {};
                    $('.dimmer').dimmer('hide');
                }, function (resp) {
                    console.log('Error status: ' + resp.status);
                    $scope.file = {};
                    $('.dimmer').dimmer('hide');
                }, function (evt) {
                    console.log(evt);
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage);
                });
        }
    };

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
        $('.dimmer').dimmer({
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
        });
    }

    function refreshHistory() {
        $scope.listDish({
            active: false
        }, setDishHistory);
    }

    function setDish(dish) {
        if (dish[0])
            $scope.dish = dish[0];
    }

    function setDishHistory(dishes) {
        if (dishes)
            $scope.dishHistory = dishes;
    }
}]);