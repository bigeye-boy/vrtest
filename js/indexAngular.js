listapp.controller('indexCtrl', function($scope,$http) {
        $http.get(getJson)
        .success(function(response){
              getSuccess($scope,$http,response); 
              funSlide(response.slides);
              $scope.type = function(e){return e.type != 'app';};
              $('#indexslide').flexslider();
              $scope.pay = function(){
                  pay($scope,$http,this);
                  $scope.payprice = this.list.payment.pay;
              };
              $scope.jump = function(list,classifys) {
                jump(list,classifys);
              };
          }
        );
});

 listapp.controller('detailCtrl', function($scope,$http) {
        $http.get(getJson)
        .success(function(response){
            getSuccess($scope,$http,response); 
            $scope.response = response;
            $scope.type = function(e){return e.type != 'app' && e.uid == GetQueryString('uid');};
            $scope.jump = function(list,classifys){
                  jump(list,classifys);
              };
            // var classArray = response.classifys; //获取类别数组
            // var index = fClass(classArray,'uid');
            // $scope.classifys = response.classifys[index];
          });
});