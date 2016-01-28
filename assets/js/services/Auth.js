tmi.service('Auth', ['$q', '$http', function ($q, $http) {
    return {
        currentUser : function(){
            return $http.get('/auth/session');
        }
    }
}]);