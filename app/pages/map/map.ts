import {Component, NgZone} from '@angular/core';
import * as moment from 'moment';
import {MapStyle} from './mapstyle';
import {DetailModal} from '../../components/detailModal';
import {Modal, NavController, Page} from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/map/map.html',
})
export class MapPage {

  constructor(private nav: NavController, private ngZone: NgZone) {
    this.nav = nav;
  }

  ionViewLoaded() {
    mapboxgl.accessToken = 'pk.eyJ1IjoibWF0dHJvdGhlbmJlcmciLCJhIjoiY2lxNzAxM2k1MDBqN2ZxbTZwcXQ1cndicyJ9.JCea1zx6hAn6J8cWL0tGsg';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mattrothenberg/ciq701j2s0019bymc8zits5e4',
        center: [-74.0030, 40.7233],
        // dragRotate: false,
        // touchZoomRotate: false,
        zoom: 15,
        minZoom: 11,
        maxZoom: 18
    });

    var nav = this.nav;

    setTimeout(function() {
      map.resize();
    }, 200);

    map.on('load', function () {
      map.addSource("points", {
        "type": "geojson",
        "data": "./data/galleries.geojson"
      });

      map.addLayer({
          "id": "points",
          "type": "symbol",
          "source": "points",
          "layout": {
            "icon-image": "{icon}-15",
            "icon-size": 1.5,
            "icon-allow-overlap": true,
          }
      });
  });

    map.on('click', function (e) {
    var features = map.queryRenderedFeatures(e.point, { layers: ['points'] });

    if (!features.length) {
        return;
    }

    var feature = features[0];
      let modal = Modal.create(DetailModal, {gallery: feature.properties});
      nav.present(modal);
    });
  }
}