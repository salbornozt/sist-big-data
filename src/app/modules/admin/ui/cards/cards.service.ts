import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Book } from './card.types';

@Injectable({
  providedIn: 'root'
})
export class CardsService {
// Private
  
  private _contacts: BehaviorSubject<Book[] | null> = new BehaviorSubject(null);
  private recomendationLink = "assets/myfile.csv"  
  constructor(private _httpClient: HttpClient) { }
  /**
     * Getter for contact
     */
   get contacts$(): Observable<Book[]>
   {
       return this._contacts.asObservable();
   }

   getContacts(): Observable<Book[]>
    {
        return this._httpClient.get<Book[]>('api/apps/common/books/all')
    }

    getContacts2(): Observable<Book[]>
    {
        return this._httpClient.get<Book[]>('api/apps/common/books/200').pipe(
            tap((contacts) => {
                this._contacts.next(contacts);
            })
        );
    }
/*
    getRecomendations()
    {
        
        return this._httpClient.get<any>(this.recomendationLink, {responseType : "text"})
    }*/
    readCsvData () {
        return this._httpClient.get(this.recomendationLink, {responseType : 'text'})
    }
}
