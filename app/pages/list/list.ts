import * as moment from 'moment';
import {Component} from '@angular/core';
import {GalleryJson} from '../map/galleries';
import {DetailModal} from '../../components/detailModal';
import {Modal, NavController} from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/list/list.html'
})
export class ListPage {  
  galleries;
  todayAsNumber = moment().day();
  todayAsString = moment().format('dddd').toLowerCase();

  constructor(private navController: NavController) {
      this.initializeGalleries();
      this.navController = navController;
  }

  showModal(gallery) {
    var modal = Modal.create(DetailModal, {gallery: gallery.properties});
    this.navController.present(modal);
  }

  initializeGalleries() {
      this.galleries = GalleryJson.features;
  }

  getItems(ev) {
    this.initializeGalleries();
    let val = ev.target.value;
    if (val && val.trim() != '') {
        this.galleries = this.galleries.filter((gallery) => {
            return (gallery.properties.name.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
                   (gallery.properties.address.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
    }
  }

  todaysHours(gallery) {
    var openAt = gallery[this.todayAsString + '_open'];
    var closedAt = gallery[this.todayAsString + '_close'];

    if (openAt.length == 0 || closedAt.length == 0) {
      return 'Hours Unavaialble'
    } else {
      return openAt + ' - ' + closedAt;
    }
  }

  galleryIsOpen(gallery) {
      var openAt = gallery[this.todayAsString + '_open'];
      var closedAt = gallery[this.todayAsString + '_close'];

      if ( openAt.length == 0 || closedAt.length == 0 ) {
        return false;
      } else {
        let open = moment(openAt, 'HH:mm A');
        let close = moment(closedAt, 'HH:mm A');
        let currentTime = moment();
        return currentTime.isAfter(open) && currentTime.isBefore(close);
      }
  }

  ionViewLoaded() {
      const todayAsNumber = moment().day();
  }
}
