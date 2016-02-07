tmi.service('User', ['API_URL', '$resource', function (API_URL, $resource) {
    return $resource(API_URL + '/user/:id', {
        id: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);