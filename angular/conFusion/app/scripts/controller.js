'use strict';

angular.module('confusionApp')

.controller('menuController', ['$scope', 'menuFactory', function($scope, menuFactory) 
{
    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;
    $scope.showMenu = false;
    $scope.message = "Loading ...";

    menuFactory.getDishes().query(
        function(response) 
        {
            $scope.dishes = response;
            $scope.showMenu = true;
        },
        function(response) 
        {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });

    $scope.select = function(setTab) 
    {
        $scope.tab = setTab;
        if (setTab === 2) 
        {
            $scope.filtText = "appetizer";
        }
        else if (setTab === 3) 
        {
            $scope.filtText = "mains";
        }
        else if (setTab === 4) 
        {
            $scope.filtText = "dessert";
        }
        else 
        {
            $scope.filtText = "";
        }
    };

    $scope.isSelected = function (checkTab) 
    {
        return ($scope.tab === checkTab);
    };

    $scope.toggleDetails = function() 
    {
        $scope.showDetails = !$scope.showDetails;
    };
}])

.controller('ContactController', ['$scope', function($scope) 
{
    $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };

    var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];
    $scope.channels = channels;
    $scope.invalidChannelSelection = false;
}])

.controller('FeedbackController', ['$scope', function($scope) 
{
    $scope.sendFeedback = function() 
    {
        console.log($scope.feedback);

        if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) 
        {
            $scope.invalidChannelSelection = true;
            console.log('incorrect');
        }
        else 
        {
            $scope.invalidChannelSelection = false;
            $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
            $scope.feedback.mychannel="";
            $scope.feedbackForm.$setPristine();
            console.log($scope.feedback);
        }
    };
}])

.controller('dishDetailController', ['$scope', '$stateParams', 'menuFactory', function($scope, $stateParams, menuFactory) 
{
    $scope.dish = {};
    $scope.showDish = false;
    $scope.message="Loading ...";

    $scope.dish = menuFactory.getDishes().get({id:parseInt($stateParams.id,10)})
    .$promise.then(
        function(response)
        {
            $scope.dish = response;
            $scope.showDish = true;
        },
        function(response) 
        {
            $scope.message = "Error: "+response.status + " " + response.statusText;
        }
    );
}])

.controller('DishCommentController', ['$scope', 'menuFactory', function($scope,menuFactory)
{
    $scope.mycomment = {rating:5, comment:"", author:"", date:""};

    $scope.submitComment = function () 
    {
        $scope.mycomment.date = new Date().toISOString();
        console.log($scope.mycomment);
        $scope.dish.comments.push($scope.mycomment);
        $scope.commentForm.$setPristine();
        $scope.mycomment = {rating:5, comment:"", author:"", date:""};
    }
}])

// implement the IndexController and About Controller here

.controller('AboutController', ['$scope', 'corporateFactory', function($scope, corporateFactory)
{
    $scope.corporateLeadership = corporateFactory.getLeaders();
}])

.controller('IndexController', ['$scope', 'corporateFactory', 'menuFactory', function($scope, corporateFactory, menuFactory)
{
    $scope.recommendedDish = {};
    $scope.showDish = true;
    $scope.message="Loading ...";
    $scope.recommendedDish = menuFactory.getDishes().get({id:0})
        .$promise.then(
            function(response)
            {
                $scope.dish = response;
                $scope.showDish = true;
            },
            function(response) 
            {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );

    $scope.monthPromotions = menuFactory.getPromotion();
    $scope.executiveChef = corporateFactory.getLeader(2);
}]);
