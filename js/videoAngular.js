listapp.controller('videoCtrl', function($scope,$http) {
        $http.get(getJson)
        .success(function(response){
            getSuccess($scope,$http,response);
            $scope.response = response;
            $scope.class = function(e){
              return e.uid == GetQueryString("uid");
            };
            $scope.resid = function(e){
              return e.ResID == GetQueryString("resid");
            };
            $scope.pay = function(resid,classifys) {
              $scope.payprice = this.resid.payment.pay;
              pay(resid,classifys,$scope,$http);
            };
            
          });
});