import {Component} from '@angular/core';
import {Page, Modal, NavController, NavParams, ViewController} from 'ionic-angular';

@Page({
  templateUrl: 'build/components/detail-modal.html',
})

export class DetailModal {
  gallery;

  constructor(public params:NavParams, private nav:NavController, private viewCtrl: ViewController) {
    this.gallery = this.params.get('gallery');
  }

  close() {
    this.viewCtrl.dismiss();
  }
}