import {Component} from '@angular/core';
import * as moment from 'moment';
import {MapStyle} from './mapstyle';
import {GalleryJson} from './galleries';
import {DetailModal} from '../../components/detailModal';
import {Modal, NavController, Page, Loading} from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/map/map.html',
})
export class MapPage {
  todayAsString = moment().format('dddd').toLowerCase();

  constructor(private nav: NavController) {
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

    let loading = Loading.create({
      content: "Please wait...",
      duration: 3000
    });

    this.nav.present(loading);

    setTimeout(function() {
      map.resize();
    }, 200);

    let newFeatures = [];

    for(var i = 0; i < GalleryJson.features.length; i++) {
      var galleryInQuestion = GalleryJson.features[i].properties;
      var openHour = moment(galleryInQuestion[this.todayAsString + '_open'], 'HH:mm A');
      var closeHour = moment(galleryInQuestion[this.todayAsString + '_close'], 'HH:mm A');
      var currentTime = moment();
      var openCoefficient = currentTime.isAfter(openHour) && currentTime.isBefore(closeHour) ? 1 : 0;
      galleryInQuestion['foop'] = openCoefficient
      newFeatures.push(GalleryJson.features[i]);
    }


    map.on('load', function () {
      var geoJsonSource = new mapboxgl.GeoJSONSource({
        data: {
          "type": "FeatureCollection",
          "features": newFeatures
        }
      })

      map.addSource("points", geoJsonSource)

      map.addLayer({
        "id": "points",
        "type": 'circle',
        "source": 'points',
        paint: {
          'circle-opacity': {
            property: 'foop',
            stops: [
              [0, .55],
              [1, 1]
            ]
          },
          'circle-color': {
            property: 'foop',
              stops: [
                [0, '#FFFFFF'],
                [1, '#FF0000']
              ]
            },
            'circle-radius': 13
          }
      });

      loading.dismiss();
      
    });

    map.on('click', function (e) {
    var features = map.queryRenderedFeatures(e.point, { layers: ['points'] });

    if (!features.length) {
        return;
    }

    var feature = features[0];
      let modal = Modal.create(DetailModal, {gallery: feature.properties});
      console.log(feature.properties);
      nav.present(modal);
    });
  }
}