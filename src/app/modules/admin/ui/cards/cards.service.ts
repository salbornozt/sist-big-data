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
        return this._httpClient.get<Book[]>('api/apps/common/books/all').pipe(
            tap((contacts) => {
                this._contacts.next(contacts);
            })
        );
    }
}
