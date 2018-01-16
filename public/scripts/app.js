var app = angular.module('fooderator', ['ngMaterial']).config(function($mdThemingProvider) {
	$mdThemingProvider.theme('default')
	.primaryPalette('green')
	.accentPalette('orange');
});

app.controller('view_meals', function($scope, $http, $mdToast) {
	$scope.snackbar = function(message) {
		$mdToast.show(
			$mdToast.simple().textContent(message).position('bottom right').hideDelay(3000)
		)
	};

	$scope.meal_click = function(id, status, name) {

		let update_data = JSON.stringify({
			pending: status
		});

		$http.post('/api/meals/' + id, update_data)
			.then(response => {
				$scope.snackbar(name + ' has been updated');
			}).catch(error => {
				$scope.snackbar('Error: ' + error);
			});
	}

	$scope.meal_edit = function(item) {
		console.log('EDIT ' + item);
	}

	$http.get('/api/meals')
		.then(response => {
			if (response.status === 200)  {
				$scope.meals = response.data.data;
			} else {
				$scope.snackbar('There was an error fetching meal data: ' + response.statusText);
			}
		});


});


app.controller('add_meal', function($scope, $http, $mdToast) {

	$scope.snackbar = function(message) {
		$mdToast.show(
			$mdToast.simple().textContent(message).position('bottom right').hideDelay(5000)
		)
	};

	$scope.submit = function() {
		if ($scope.meal_name) {
			var data = {
				name: $scope.meal_name,
				description: $scope.meal_description
			};

			$http.put('/api/meals', JSON.stringify(data))
				.then(function(response) {
					if (response.status === 200)  {
						$scope.meal_name = null;
						$scope.meal_description = null;
						$scope.snackbar(response.data.message);
					} else {
						$scope.snackbar('Error: ' + response.statusText);
					}
				});

		} else {
			$scope.snackbar('Please enter the meal name');
		}
	};
});