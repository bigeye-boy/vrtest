listapp.controller('photoCtrl', function($scope,$http) {
        $http.get(getJson)
        .success(function(response){
            getSuccess($scope,$http,response); 
            $scope.response = response;
            $scope.type = function(e){return e.type == 'photo';};
          });
});

listapp.controller('galleryCtrl', function($scope,$http) {
        $http.get(getJson)
        .success(function(response){
            getSuccess($scope,$http,response);
            $scope.lists = response;
            swipbox();
            $scope.class = function(e){
              return e.uid == GetQueryString("uid");
            };
            $scope.resid = function(e){
              return e.ResID == GetQueryString("resid");
            };
          });
});