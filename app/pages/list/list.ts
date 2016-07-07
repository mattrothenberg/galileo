import * as moment from 'moment';
import {Component} from '@angular/core';
import {GalleryData} from '../map/galleryData';
import {NavController} from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/list/list.html'
})
export class ListPage {  
  galleries;
  todayAsNumber = moment().day();

  constructor(private navController: NavController) {
      this.initializeGalleries();
  }

  initializeGalleries() {
      this.galleries = GalleryData;
  }

  getItems(ev) {
    this.initializeGalleries();
    let val = ev.target.value;
    if (val && val.trim() != '') {
        this.galleries = this.galleries.filter((gallery) => {
            return (gallery.name.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
                   (gallery.address.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
    }
  }

  todaysHours(hours) {
     if (hours === null) {
         return 'Closed'
     } else if (hours[this.todayAsNumber].open === null) {
         return 'Hours Unavailable'
     } else {
         return hours[this.todayAsNumber].open + ' - ' + hours[this.todayAsNumber].close;
     }
  }

  galleryIsOpen(hours) {
      if(hours === null) {
        return false;
      } else {
        let matchedHours = hours[this.todayAsNumber];
        let open = moment(matchedHours.open, 'HH:mm A');
        let close = moment(matchedHours.close, 'HH:mm A');
        let currentTime = moment();

        return currentTime.isAfter(open) && currentTime.isBefore(close);
      }
  }

  ionViewLoaded() {
      const todayAsNumber = moment().day();
  }
}
