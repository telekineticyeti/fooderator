var app = angular
  .module('fooderator', ['ngMaterial'])
  .config(function ($mdThemingProvider) {
    $mdThemingProvider
      .theme('default')
      .primaryPalette('green')
      .accentPalette('orange');
  });

app.controller(
  'ingredients',
  function ($scope, $http, $mdToast, $mdDialog, $log) {
    /**
     * Load the ingredient list
     */
    $scope.load_ingredient_list = function () {
      $http.get('/api/ingredients').then((response) => {
        if (response.status === 200) {
          $scope.ingredients = response.data.data;
        } else {
          return false;
        }
      });
      self.new_ingredient = function (chip) {
        return {
          name: chip,
          type: 'unknown',
        };
      };
    };
  }
);

app.controller('meals', function ($scope, $http, $mdToast, $mdDialog, $log) {
  $scope.snackbar = function (message) {
    $mdToast.show(
      $mdToast
        .simple()
        .textContent(message)
        .position('bottom right')
        .hideDelay(3000)
    );
  };

  /**
   * Load the list of meals to be displayed
   */
  $scope.load_meal_list = function () {
    $http.get('/api/meals').then((response) => {
      if (response.status === 200) {
        $scope.meals = response.data.data;
      } else {
        return false;
      }
    });
  };

  /**
   * Handle meal click event (set meal pending status)
   */
  $scope.meal_click = function (id, status, name) {
    let update_data = JSON.stringify({
      pending: status,
    });

    $http
      .post('/api/meals/' + id, update_data)
      .then((response) => {
        $scope.snackbar(name + ' has been updated');
      })
      .catch((error) => {
        $scope.snackbar('Error: ' + error);
      });
  };

  /**
   * Initiate add meal dialog
   */
  $scope.meal_add = function (id, name, description) {
    $mdDialog
      .show({
        controller: add_meal_dialog_controller,
        templateUrl: '/templates/add_meal_dialog.html',
        parent: angular.element(document.body),
        clickOutsideToClose: true,
        fullscreen: $scope.customFullscreen,
      })
      .then(function (data) {
        $scope.snackbar('Meal successfully added');
        $scope.load_meal_list();
      });

    function add_meal_dialog_controller($scope, $mdDialog, $log) {
      $scope.cancel = function () {
        $mdDialog.cancel();
      };
      $scope.save = function (answer) {
        if ($scope.meal_name) {
          var data = JSON.stringify({
            name: $scope.meal_name,
            description: $scope.meal_description,
          });
          $http
            .put('/api/meals', data)
            .then((response) => {
              $mdDialog.hide();
            })
            .catch((error) => {
              $log.log(error);
            });
        }
      };
    }
  };

  /**
   * Initiate meal editing dialog
   */
  $scope.meal_edit = function (id, name, description) {
    var meal_data = {
      id: id,
      name: name,
      description: description,
    };

    $mdDialog
      .show({
        locals: { data: meal_data },
        controller: edit_meal_dialog_controller,
        templateUrl: '/templates/edit_meal_dialog.html',
        parent: angular.element(document.body),
        targetEvent: id,
        clickOutsideToClose: true,
        fullscreen: $scope.customFullscreen,
      })
      .then(function (answer) {
        $scope.snackbar('Meal successfully updated');
        $scope.load_meal_list();
      });

    function edit_meal_dialog_controller($scope, $mdDialog, $log, data) {
      $scope.dialog_data = data;

      $scope.hide = function () {
        $mdDialog.hide();
      };
      $scope.cancel = function () {
        $mdDialog.cancel();
      };

      $scope.save = function (answer) {
        let update_data = JSON.stringify({
          name: $scope.dialog_data.name,
          description: $scope.dialog_data.description,
        });

        $http
          .post('/api/meals/' + $scope.dialog_data.id, update_data)
          .then((response) => {
            $mdDialog.hide();
          })
          .catch((error) => {
            $log.log(error);
          });
      };
    }
  };
});
