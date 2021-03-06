import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import {FoodService} from "../../app/providers/food.service";
import {Food} from "../../app/model/food.model";
import {PlaceService} from "../../app/providers/place.service";

@IonicPage()
@Component({
  selector: 'page-edit-food',
  templateUrl: 'edit-food.html',
})
export class EditFoodPage {

  public minDate = new Date().toISOString();

  private _food: Food;
  private _callback: Function;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, private _foodService: FoodService, private _placeService: PlaceService) {

  }

  ionViewDidLoad() {
    if(this.navParams.get('id')) {
      this._callback = this.navParams.get('callback');
      this._foodService.getFood(this._placeService.selectedPlace.id, this.navParams.get('id'))
        .subscribe(res => {
          this._food = res;
        });
    }
  }

  public _updateFood(food: Food): void {
    this._food = Object.assign(new Food(), {
      id: this._food.id,
      name: food.name,
      quantity: food.quantity,
      picture: this._food.picture,
      dlc: food.dlc
    });
    this._foodService.updateFood(this._placeService.selectedPlace.id, this._food)
      .subscribe(res => {
        this._callback().then(() => this.navCtrl.pop());
      });
  }

}
