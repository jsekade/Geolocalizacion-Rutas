var map,lat,lng,lat_origen,lng_origen,lastlat,lastlng;
    
    $(function(){
      
      function enlazarMarcador(e){ //muestra ruta entre marcas anteriores y actuales
        map.drawRoute({
          origin:[lat,lng], //origen en coordenadas anteriores
          destination:[e.latLng.lat(),e.latLng.lng()], //destino en coordenadas del click o toque actual
          travelMode:'driving',
          strokeColor:'#000000',
          strokeOpacity:0.6,
          strokeWeight:5
        });
        lat = e.latLng.lat(); //guarda coords para marca siguiente
        lng = e.latLng.lng();
        lastlat = e.latLng.lat(); //guarda coords de la última marca para compactar
        lastlng = e.latLng.lng();
        map.addMarker({lat:lat,lng:lng}); //pone marcador en mapa
      }; 

      function geolocalizar(){
        GMaps.geolocate({
          success:function(position){
            lat = position.coords.latitude; //guarda coords en lat y lng
            lng = position.coords.longitude;
            lat_origen = lat; //variables para guardar latitud y longitud iniciales.
            lng_origen = lng;
            map = new GMaps({ //muestra mapa centrado en coords [lat,lng]
              el:'#map',
              lat:lat,
              lng:lng,
              click:enlazarMarcador,
              tap:enlazarMarcador
            });
            map.addMarker({lat:lat,lng:lng}); //marcador en [lat,lng]
          },
          error:function(error){alert('Geolocalización falla:'+error.message);},
          not_supported:function(){alert("Su navegador no soporta geolocalización");},
        });
      };
      geolocalizar();

      $("#compactar").on("click",
        function(){
          //map.removeMarkers(map);
          map = new GMaps({ //dibujar un nuevo mapa con el origen inicial
            el:'#map',
            lat:lat_origen,
            lng:lng_origen,
            click:enlazarMarcador,
            tap:enlazarMarcador
          });
          map.addMarker({lat:lat_origen,lng:lng_origen}); //añadimos la marca del origen
          map.drawRoute({ //dibujamos la ruta hasta el último destino
            origin:[lat_origen,lng_origen],
            destination:[lastlat,lastlng],
            travelMode:'driving',
            strokeColor:'#000000',
            strokeOpacity:0.8,
            strokeWeight:5
          }); //y añadir la marca del último destino seleccionado
          map.addMarker({lat:lastlat,lng:lastlng});
        }
      );
    });
   