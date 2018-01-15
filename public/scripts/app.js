var app = angular.module('fooderator', ['ngMaterial']).config(function($mdThemingProvider) {
	$mdThemingProvider.theme('default')
	.primaryPalette('green')
	.accentPalette('orange');
});

app.controller('add_meal', function($scope, $http, $mdToast) {

	$scope.snackbar = function(message) {
		$mdToast.show(
			$mdToast.simple()
				.textContent(message)
				.position('bottom right')
				.hideDelay(3000)
		)
	};

	$scope.form_error = '';
	$scope.submit = function() {
		if ($scope.meal_name) {
			var data = {
				name: $scope.meal_name,
				description: $scope.meal_description
			};

			var form = angular.element(document.querySelector('.form_add_meal'));

			$http.put('/api/meals', JSON.stringify(data))
				.then(function(response) {
					if (response.status === 200)  {
						$scope.snackbar(response.data.message);
						console.log(response.data.message);
						$scope.meal_name = null;
						$scope.meal_description = null;
					} else {
						$scope.snackbar(response.statusText);
					}
				});

		} else {
			$scope.form_error = 'Please enter the meal name';
			$scope.snackbar('Please enter the meal name');
		}
	};
});