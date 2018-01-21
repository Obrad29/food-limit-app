import {Injectable} from "@angular/core";
import {Food} from "../model/food.model";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";
import {Headers, Http, RequestOptions} from "@angular/http";
import {
  DEFAULT_PICTURE_URL, GETTY_API_KEY, EANDATA_API_KEY, EANDARA_API_URL, SERVER_URL,
  GETTYIMAGES_API_URL
} from '../../config';
import {AuthHttp} from "angular2-jwt";
import {mergeMap} from "rxjs/operators";
import 'rxjs/add/operator/do';


@Injectable()
export class FoodService {
  public foods$: BehaviorSubject<Food[]> = new BehaviorSubject([]);
  private _foodList: Food[];

  constructor(private http: Http, private authHttp: AuthHttp) {
  }

  public loadFoods(): void {
    this.authHttp.get(`${SERVER_URL}/foods`).subscribe((foodList) => {
      this._foodList = foodList.json();
      this.foods$.next(this._foodList);
    });
  }

  public getFood(foodId: number): Observable<Food> {
    return this.authHttp.get(`${SERVER_URL}/foods/${foodId}`)
      .map(res => res.json());
  }

  public deleteFood(foodId: number): void {
    this.authHttp.delete(`${SERVER_URL}/foods/${foodId}`)
      .subscribe(() => {
        this._foodList = this._foodList.filter(f => f.id != foodId);
        this.foods$.next(this._foodList);
      });
  }

  public createFood(food: Food): Observable<Food> {
    return this.getFoodPictures(food.name)
      .pipe(
        mergeMap(res => {
          if (res.json().images.length > 0) {
            food.picture = res.json().images[0].display_sizes[0].uri;
          } else {
            food.picture = DEFAULT_PICTURE_URL;
          }
          return this.authHttp.post(`${SERVER_URL}/foods`, food)
            .map(res => res.json())
            .do(res => {
              this._foodList.push(Object.assign(new Food(), res));
              this.foods$.next(this._foodList);
            });
        })
      )
  }

  public updateFood(food: Food): Observable<Food> {
    return this.authHttp.put(`${SERVER_URL}/foods/${food.id}`, food)
      .map(res => res.json())
      .do(res => {
        this._foodList.forEach((f, index) => {
          if (f.id === food.id) {
            this._foodList[index] = food;
          }
        });
        this.foods$.next(this._foodList);
      });
  }

  public getFoodInfos(gtin: string): Observable<any> {
    return this.http.get(`${EANDARA_API_URL}&keycode=${EANDATA_API_KEY}&mode=json&find=${gtin}`);
  }

  public getFoodPictures(value: string): Observable<any> {
    let headers: Headers = new Headers({ 'Content-Type': 'application/json', 'Api-Key': GETTY_API_KEY });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`${GETTYIMAGES_API_URL}?phrase=${value}`, options);
  }

}
