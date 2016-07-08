import {Component, NgZone} from '@angular/core';
import * as moment from 'moment';
import {MapStyle} from './mapstyle';
import {GalleryData} from './galleryData';
import {GalleryCoordinates} from './galleryCoordinates';
import {DetailModal} from '../../components/detailModal';
import {Modal, NavController, Page} from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/map/map.html',
})
export class MapPage {

  constructor(private nav: NavController, private ngZone: NgZone) {}

  ionViewLoaded() {
    const todayAsNumber = moment().day();
    let mapEle = document.getElementById('map');
    let ngz = this.ngZone;
    let nav = this.nav;

    let mymap = L.map('map').setView([40.7233, -74.0030], 15);

    setTimeout(function() {
      mymap.invalidateSize({});
    }, 200);

    L.tileLayer('https://api.mapbox.com/styles/v1/mattrothenberg/ciq701j2s0019bymc8zits5e4/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWF0dHJvdGhlbmJlcmciLCJhIjoiY2lxNzAxM2k1MDBqN2ZxbTZwcXQ1cndicyJ9.JCea1zx6hAn6J8cWL0tGsg', {
        attribution: '',
        maxZoom: 17,
        id: 'your.mapbox.project.id',
        accessToken: 'your.mapbox.public.access.token'
    }).addTo(mymap);

    function isGalleryOpen(hours) {
      if(hours === null) {
        return false;
      } else {
        let matchedHours = hours[todayAsNumber];
        let open = moment(matchedHours.open, 'HH:mm A');
        let close = moment(matchedHours.close, 'HH:mm A');
        let currentTime = moment();

        return currentTime.isAfter(open) && currentTime.isBefore(close);
      }
    }

    GalleryCoordinates.forEach(coordinatePair => {
    	let index = GalleryCoordinates.indexOf(coordinatePair);
      let galleryMatch = GalleryData[index];

      var openIcon = L.icon({
        iconUrl: 'img/marker-icon-open-2x.png',
        shadowUrl: 'img/marker-shadow.png',
        iconSize:    [25, 41],
        iconAnchor:  [12, 41],
        popupAnchor: [1, -34],
        shadowSize:  [41, 41]
      });

      var closedIcon = L.icon({
        iconUrl: 'img/marker-icon-closed-2x.png',
        shadowUrl: 'img/marker-shadow.png',
        iconSize:    [25, 41],
        iconAnchor:  [12, 41],
        popupAnchor: [1, -34],
        shadowSize:  [41, 41]
      });

      let icon = isGalleryOpen(galleryMatch.hours) ? openIcon : closedIcon;

      var marker = L.marker([coordinatePair.pos[0], coordinatePair.pos[1]], {icon: icon}).addTo(mymap);
      marker.on('click', function(e) {
        let modal = Modal.create(DetailModal, {gallery: galleryMatch});
        nav.present(modal);
      })
    })
  }
}