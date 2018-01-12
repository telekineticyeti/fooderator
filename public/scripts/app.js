var app = angular.module('app', []);

app.controller('add_meal', function($scope, $http) {
	$scope.form_error = '';
	$scope.submit = function() {
		if ($scope.meal_name) {
			var data = {
				name: $scope.meal_name,
				description: $scope.meal_description
			};

			var form = angular.element(document.querySelector('.form_add_meal'));

			form.addClass('processing');

			$http.put('/api/meals', JSON.stringify(data))
				.then(function(response) {
					if (response.status === 200)  {
						$scope.form_success = '' + response.data.message;
						console.log(response.data.message);
					} else {
						$scope.form_error = response.statusText;
					}
					form.removeClass('processing');

				}, function (response) {
					$scope.form_error = response.statusText;
				});

		} else {
			$scope.form_error = 'Please enter the meal name';
		}
	};
});