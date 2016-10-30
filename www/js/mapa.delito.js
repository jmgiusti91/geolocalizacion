'use strict';
angular
  .module('mapa.delito', ['firebase'])

  .service('DB',['$firebaseArray', '$rootScope',
    function($firebaseArray, $rootScope){

      this.ref       = ref;
      this.lista     = lista;
      this.listaRef  = listaRef;
      this.cargarUID = cargarUID;
      this.cargar    = cargar;
      this.updateUID = updateUID;
      this.update    = update;
      this.listaPers = listaPers;
      /*
      *
      */
      function ref(coleccion){
        if (!coleccion){
          console.log("Debe pasar una coleccion como parametro");
          return Promise.fail("Debe pasar una coleccion como paramtero");
        }
        var ref = firebase.database().ref();

        return ref.child(coleccion);
      }

      /*
      *
      */
      function lista(coleccion){

        return $firebaseArray(ref(coleccion));
      }

      /*
      *
      */
      function listaPers(ref){

        return $firebaseArray(ref);
      }
      /*
      *
      */
      function listaRef(ref){

        return $firebaseArray(ref);
      }

      /*
      *
      */
      function cargarUID(objeto, coleccion){
        if (!$rootScope.user.uid || !coleccion){
          console.log('No existe uid que cargar.');

          return Promise.fail('No existe uid que cargar.');
        }
        // coleccion += '/' + $rootScope.user.uid;

        // return cargar(objeto, coleccion);
        return firebase.database().ref(anadirUID(coleccion)).set(objeto);
      }

      /*
      *
      */
      function cargar(objeto, coleccion){
        if (!objeto || typeof objeto != 'object' || !coleccion){
          console.log('El parametro tiene que ser un objeto.');
          return Promise.fail('El parametro tiene que ser un objeto.');
        }

        return lista(coleccion)
        .$add(objeto)
        .then(function(ref){
          return ref.key
        })
        .catch(function(e){
          return e
        })
      }
      /*
      *
      */
      function updateUID(objeto, coleccion){
        if (!objeto || typeof objeto != 'object' || !coleccion){
          console.log('El parametro tiene que ser un objeto.');
          return Promise.fail('El parametro tiene que ser un objeto.');
        }
        if (!$rootScope.user.uid || !coleccion){
          console.log('No existe uid que modificar.');

          return Promise.fail('No existe uid que modificar.');
        }
        return firebase.database().ref(anadirUID(coleccion)).update(objeto);

      }
      /*
      *
      */
      function update(objeto, coleccion){
        if (!objeto || typeof objeto != 'object' || !coleccion){
          console.log('El parametro tiene que ser un objeto.');
          return Promise.fail('El parametro tiene que ser un objeto.');
        }
        if (!$rootScope.user.uid || !coleccion){
          console.log('No existe uid que modificar.');

          return Promise.fail('No existe uid que modificar.');
        }
        return firebase.database().ref(coleccion).update(objeto);

      }

      function anadirUID(coleccion){
        return coleccion + '/' + $rootScope.user.uid;
      }
    }])

  .service('Delitos',['DB',
    function(DB){

      this.cargar = cargar;
      this.cargarAlarma = cargarAlarma;
      this.getDelitos = getDelitos;
      this.getAlarmas = getAlarmas;
      this.listado = listado;
      this.getAlarmasMarcadores = getAlarmasMarcadores;
      this.getDelitosMarcadores = getDelitosMarcadores;
      function listado(){
        var ref = DB.ref('delitos/');//.orderByChild('uid').equalTo($rootScope.uid);

        try {
          console.log(ref);
          return DB.listaPers(ref);
        } catch (e) {
          console.log(e);
        } finally {

        }
      }
      function listadoAlarmas(){
        var ref = DB.ref('alarmas/');//.orderByChild('uid').equalTo($rootScope.uid);

        try {
          console.log(ref);
          return DB.listaPers(ref);
        } catch (e) {
          console.log(e);
        } finally {

        }
      }
      function cargar(objeto){
        var coleccion = 'delitos/';

        return DB.cargar(objeto, coleccion);

      }
      function cargarAlarma(objeto){
        var coleccion = 'alarmas/';

        return DB.cargar(objeto, coleccion);

      }
      function getDelitos(){
        var ref = DB.ref('delitos/');//.orderByChild('nombre');

        console.log(ref);
        return DB.listaRef(ref);
      }
      function getAlarmas(){
        var ref = DB.ref('alarmas/');//.orderByChild('nombre');

        return DB.listaRef(ref);
      }
      function getAlarmasMarcadores(){
        var ref = DB.ref('alarmas/')
        return DB.listaRef(ref).$loaded(function(data){
          return agregarIconos(data);

        }, function(e){
          return e;
        })
      }
      function getDelitosMarcadores(){
        var ref = DB.ref('delitos/')
        return DB.listaRef(ref).$loaded(function(data){

          return agregarIconos(data);

        }, function(e){
          console.log(e);
          return e;
        })
      }

      function _fechas(dia, hora){

        dia.setHours(hora.getHours());
        dia.setMinutes(hora.getMinutes());

        return dia.getTime();
      }

      function agregarIconos(data){
        data.forEach(function(item){
          switch (item.tipo) {
            case "Violencia":
              item.icon = "Violencia.png";
              break;
            case "Accidente":
              item.icon = "Accidente.png";
              break;
            case "Asalto":
              item.icon = "Asalto.png";
              break;
            default:
              item.icon = "Violencia.png";

          }
        })
        return data;
      }
    }]);
