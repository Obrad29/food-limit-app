import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {PlaceService} from "../../app/providers/place.service";
import {Place} from "../../app/model/place.model";
import {ListFoodPage} from "../list-food/list-food";

/**
 * Generated class for the ListPlacePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-list-place',
  templateUrl: 'list-place.html',
})
export class ListPlacePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private _placeService: PlaceService) {
    this._placeService.loadPlaces().subscribe();
  }

  public selectPlace(place: Place): void {
    this._placeService.selectedPlace = place;
    this.navCtrl.setRoot(ListFoodPage);
  }

  public createPlace(place: Place): void {
    this.navCtrl.push("AddPlacePage");
  }

  public deletePlace(place: Place): void {
    this._placeService.deletePlace(place.id);
  }

  public editPlace(place: Place): void {
    this.navCtrl.push("EditPlacePage", {
      'id': place.id,
      callback: () => new Promise((resolve, reject) => {
        resolve();
      })
    });
  }

  public viewPlace(place: Place): void {
    this.navCtrl.push("DetailPlacePage", {
      'id': place.id
    });
  }
}
