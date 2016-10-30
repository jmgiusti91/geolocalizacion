angular.module('alta.controllers')
  .controller('mapaDelitos', function($scope, NgMap, Delitos, $interval){
    $scope.map = {};
    $scope.map.name = "Alarmas";
    $scope.map.latitud = "-34.597208699999996";
    $scope.map.longitud = "-58.4163428";
    $scope.mapMarkers = [];

    $scope.mostrarMapa = function(row){

        // $scope.map.name = 'name';// row.entity.nombre;
        // $scope.map.latitud = 32;// row.entity.latitud;
        // $scope.map.longitud = 32;//row.entity.logitud;
        $scope.mapMarkers.length = 0;

        Delitos.getDelitosMarcadores()
        .then(function(data){
            $scope.alarmas = data;
            data.forEach(function(item){
              console.log(item);
              $scope.mapMarkers.push(
                {
                  title: item.tipo,
                  lat: item.latitud,
                  lng: item.longitud,
                  icon: item.icon
                })
            })
          })
      };
      $scope.mostrarMapa();
  })
