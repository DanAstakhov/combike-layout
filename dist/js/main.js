'use strict';

window.addEventListener('DOMContentLoaded', function () {
  // mapbox
  var mapBlock = document.querySelector('#map');
  if (mapBlock) {
    var clickElementOnLoad = function clickElementOnLoad(elementId) {
      window.addEventListener('load', function () {
        var element = document.querySelector('.mapboxgl-ctrl-geolocate');
        if (element) {
          element.click();
        }
      });
    };
    mapboxgl.accessToken = 'pk.eyJ1IjoidHlwb2RpbiIsImEiOiJjbGR2N2dseWswY3ZrM25wN3FuZmRta3kyIn0.j6TQ-s-vEA2-PfE8U_AhUQ';
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-73.58, 45.50],
      zoom: 10
    });
    map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserLocation: true,
      showUserHeading: true
    }));
    clickElementOnLoad();
  }

  //open & close
  function toggleClassOnClick(elementOpen, elementClose, target, className) {
    var elementShow = document.querySelector(elementOpen),
      elementHide = document.querySelector(elementClose),
      targetNode = document.querySelector(target);
    if (elementShow) {
      elementShow.addEventListener('click', function () {
        targetNode.classList.add(className);
      });
    }
    if (elementHide) {
      elementHide.addEventListener('click', function () {
        targetNode.classList.remove(className);
      });
    }
  }
  toggleClassOnClick('#btnShowSearch', '#btnHideSearch', '#searchPanel', 'opened');
});