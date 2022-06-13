import { Injectable } from '@angular/core';
import { from, map } from 'rxjs';
import { assign, cloneDeep } from 'lodash-es';
import {books as bookData} from 'app/mock-api/common/books/data'
import {books2 as bookData2} from 'app/mock-api/common/books/data2'
import { FuseMockApiService, FuseMockApiUtils } from '@fuse/lib/mock-api';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

    private _books: any[] = bookData;
    private _books2: any[] = bookData2;
    

    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService)
    {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void
    {
        // -----------------------------------------------------------------------------------------------------
        // @ Contacts - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/common/books/all')
            .reply(() => {

                // Clone the contacts
                const contacts = cloneDeep(this._books);

                // Sort the contacts by the name field by default
                contacts.sort((a, b) => a.title.localeCompare(b.title));

                // Return the response
                return [200, contacts];
            });

            this._fuseMockApiService
            .onGet('api/apps/common/books/200')
            .reply(() => {

                // Clone the contacts
                const contacts = cloneDeep(this._books2);

                // Sort the contacts by the name field by default
                contacts.sort((a, b) => a.title.localeCompare(b.title));

                // Return the response
                return [200, contacts];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Contacts Search - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/contacts/search')
            .reply(({request}) => {

                // Get the search query
                const query = request.params.get('query');

                // Clone the contacts
                let contacts = cloneDeep(this._books);

                // If the query exists...
                if ( query )
                {
                    // Filter the contacts
                    contacts = contacts.filter(contact => contact.title && contact.title.toLowerCase().includes(query.toLowerCase()));
                }

                // Sort the contacts by the name field by default
                contacts.sort((a, b) => a.title.localeCompare(b.title));

                // Return the response
                return [200, contacts];
            });

        
    }
}
