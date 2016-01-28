tmi.service('Dish', ['API_URL', '$resource', function (API_URL, $resource) {
    return $resource(API_URL + '/dish/:id', {
        id: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);