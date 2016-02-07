tmi.service('Order', ['API_URL', '$resource', function (API_URL, $resource) {
    return $resource(API_URL + '/order/:id', {
        id: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);