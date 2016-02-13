tmi.service('Config', ['API_URL', '$resource', function (API_URL, $resource) {
    return $resource(API_URL + '/config/:id', {
        id: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);