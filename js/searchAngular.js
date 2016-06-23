listapp.controller('searchCtrl', function($scope,$http) {
        $http.get(getJson)
        .success(function(response){
            getSuccess($scope,$http,response); 
            var searchWd = GetQueryString("wd");
            $scope.type = function(e){return (e.type !== 'app');};
            $scope.searchList = function(s){
            	return(s.desc.indexOf(searchWd) > -1 || s.title.indexOf(searchWd) > -1);
            };
            $scope.jump = function(list,classifys){
                  jump(list,classifys);
              };
          });
});