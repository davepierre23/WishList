import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection  } from '@angular/fire/firestore';
import { forkJoin, Observable, of } from 'rxjs';
import { Fakebooksong } from 'src/models/song';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WishListService {
  dbName :string= "wishListItems";
  wishListItemsCollections! : AngularFirestoreCollection<Fakebooksong>;
  wishListItems!: Observable<Fakebooksong[]>;

  constructor(private firestore: AngularFirestore ) { }

  //get all available Songs
  getWishListItems() :Observable<Fakebooksong[]>{
    this.wishListItemsCollections = this.firestore.collection<Fakebooksong>(this.dbName);
    this.wishListItems = this.wishListItemsCollections.valueChanges();
    console.debug("The fakebooksongs that from service",this.wishListItems)
    return  this.wishListItems
  }
  //get a fakebooksong by their ID
  getWishListItem(fakeBokkSongId: number): Observable<(Fakebooksong | undefined )[]> {
    return this.firestore.collection<Fakebooksong | undefined>(this.dbName, ref=> ref.where("id","==",fakeBokkSongId))
            .valueChanges()
  }
  //used to get the search request by
  getFakeBookSongFromSearchResult(searchResults: number[][]): Observable<(Fakebooksong | undefined)[]> {
    if(searchResults.length>0){
        let songSearchResults: Observable<(Fakebooksong | undefined)[]>[] = searchResults.map(key => this.firestore.collection<Fakebooksong | undefined>(this.dbName, ref=> ref.where("id",'in',key))
        .valueChanges().pipe(take(1))) //used to complete the observable
        return forkJoin(songSearchResults).pipe(
          map(songs => songs.reduce((acc, cur) => [...acc, ...cur], []) )); //merge all the results of the call into one array
      }else{
        return of([])
      }
    }
}
