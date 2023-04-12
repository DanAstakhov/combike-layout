'use strict';
window.addEventListener('DOMContentLoaded', () => {

    // mapbox
    const mapBlock = document.querySelector('#map');

    if(mapBlock) {
        mapboxgl.accessToken = 'pk.eyJ1IjoidHlwb2RpbiIsImEiOiJjbGR2N2dseWswY3ZrM25wN3FuZmRta3kyIn0.j6TQ-s-vEA2-PfE8U_AhUQ';
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [-73.58, 45.50],
            zoom: 10
        });

        map.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
                trackUserLocation: true,
                showUserLocation: true,
                showUserHeading: true
            })
        );

        function clickElementOnLoad(elementId) {
            window.addEventListener('load', function() {
                let element = document.querySelector('.mapboxgl-ctrl-geolocate');
                if (element) {
                    element.click();
                }
            });
        }
        clickElementOnLoad();
    }


    //open & close
    function toggleClassOnClick(elementOpen, elementClose, target, className) {
        const
            elementShow = document.querySelector(elementOpen),
            elementHide = document.querySelector(elementClose),
            targetNode = document.querySelector(target);
        if (elementShow) {
            elementShow.addEventListener('click', () => {
                targetNode.classList.add(className)
            })
        }
        if (elementHide) {
            elementHide.addEventListener('click', () => {
                targetNode.classList.remove(className)
            })
        }
    }

    toggleClassOnClick(
        '#btnShowSearch',
        '#btnHideSearch',
        '#searchPanel',
        'opened');

});



