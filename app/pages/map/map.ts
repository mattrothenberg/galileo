import {Component, NgZone} from '@angular/core';
import * as moment from 'moment';
import {MapStyle} from './mapstyle';
import {GalleryData} from './galleryData';
import {GalleryCoordinates} from './galleryCoordinates';
import {DetailModal} from '../../components/detailModal';
import {Modal, NavController, Page} from 'ionic-angular';

@Page({
  templateUrl: 'build/pages/map/map.html',
})
export class MapPage {

  constructor(private nav: NavController, private ngZone: NgZone) {}

  ionViewLoaded() {
    const todayAsNumber = moment().day();
    let mapEle = document.getElementById('map');
    let ngz = this.ngZone;
    let nav = this.nav;
    let sohoLatLong = new google.maps.LatLng(40.7233, -74.0030);
    let map = new google.maps.Map(mapEle, {
      center: sohoLatLong,
      zoom: 17,
      styles: MapStyle
    });

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
    	let googleCoordinatePair = new google.maps.LatLng(coordinatePair.pos[0], coordinatePair.pos[1]);
      let url = isGalleryOpen(galleryMatch.hours) ? 'img/marker-open.png' : 'img/marker-closed.png';
      let image = {
        url: url,
        size: new google.maps.Size(33, 51),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 15)
      };

    	let marker = new google.maps.Marker({
	    	map: map,
        icon: image,
	    	position: googleCoordinatePair
	    });

			google.maps.event.addListener(marker, 'click', function() {
			  ngz.run(() => {
			    let modal = Modal.create(DetailModal, {gallery: galleryMatch});
			    nav.present(modal);
			  })
			});

    })

    google.maps.event.addListenerOnce(map, 'idle', () => {
      mapEle.classList.add('show-map');
    });
  }
}