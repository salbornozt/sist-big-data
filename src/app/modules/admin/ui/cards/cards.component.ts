import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, QueryList, Renderer2, ViewChildren, ViewEncapsulation } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { FuseCardComponent } from '@fuse/components/card';
import { Observable, Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { Book } from './card.types';
import { CardsService } from './cards.service';

@Component({
    selector       : 'cards',
    templateUrl    : './cards.component.html',
    styles         : [
        `
            cards fuse-card {
                margin: 16px;
            }
        `
    ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardsComponent implements AfterViewInit, OnInit
{
    @ViewChildren(FuseCardComponent, {read: ElementRef}) private _fuseCards: QueryList<ElementRef>;

    filters: string[] = ['all', 'article', 'listing', 'list', 'info', 'shopping', 'pricing', 'testimonial', 'post', 'interactive'];
    numberOfCards: any = {};
    selectedFilter: string = 'all';
    covidData: any[] = [];
    contacts$: Observable<Book[]>;
    books: Book[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(private _renderer2: Renderer2, private _cardService:CardsService)
    {
    }
    ngOnInit(): void {
        // Get the contacts
        this.contacts$ = this._cardService.contacts$;
        this._cardService.getContacts()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((contacts: Book[]) => {

                // Update the counts
                //this.contactsCount = contacts.length;
                console.log('sat tag '+contacts);
                this.books = contacts
                
                // Mark for check
                //this._changeDetectorRef.markForCheck();
            });

        this._cardService.readCsvData()
            .subscribe((result: any) => {
                const list = result.split('\n');

                list.forEach( e => {

                    this.covidData.push(e);
                    //console.log(e);
                })
                
                

                // Update the counts
                //this.contactsCount = contacts.length;
                //console.log('sat tag '+contacts);
                
                // Mark for check
                //this._changeDetectorRef.markForCheck();
            });

    }
    getRecomendation(pos:number):void
    {
        let aux = this.covidData[pos].split(",")
        let msg = ""
        let recomendation1 = aux[2]
        let r1 = this.limit (recomendation1)
        let recomendation2 = aux[3]
        let r2 = this.limit (recomendation2)
        let recomendation3 = aux[4]
        let r3 = this.limit (recomendation3)
        let recomendation4 = aux[5]
        let r4 = this.limit (recomendation4)
        let recomendation5 = aux[6]
        let r5 = this.limit (recomendation5)


        //console.log(this.books[recomendation1].title);

        
        if(r1 == true){
            msg = "> "+ this.books[recomendation1].title + '<br>'           
        }if(r2 == true){
            msg +="> "+this.books[recomendation2].title+ "<br>"   
        }if(r3 == true){
            msg +="> "+ this.books[recomendation3].title+ "<br>"   
        }if(r4 == true){
            msg +="> "+ this.books[recomendation4].title+ "<br>"   
        }if(r5 == true){
            msg +="> "+ this.books[recomendation5].title+ "<br>"   
        }

        if(msg==""){
            msg= "No sabriamos que recomendarte, lo sentimos  😞"
        }
        
        Swal.fire({
            title:'Recomendaciones',
            html: msg,
            padding: '3em',
            color: '#716add',
            background: '#fff url(/images/trees.png)',
            backdrop: `
                rgba(0,0,123,0.4)
                url("/images/nyan-cat.gif")
                left top
                no-repeat
            `
        })

    }

    limit(cod:number):boolean{
        if(cod<110){
            return true
        }else
        return false
    }

    

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    
    /**
     * After view init
     */
    ngAfterViewInit(): void
    {
        // Calculate the number of cards
        this._calcNumberOfCards();

        // Filter the cards for the first time
        this._filterCards();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * On filter change
     *
     * @param change
     */
    onFilterChange(change: MatButtonToggleChange): void
    {
        // Set the filter
        this.selectedFilter = change.value;

        // Filter the cards
        this._filterCards();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    private _calcNumberOfCards(): void
    {
        // Prepare the numberOfCards object
        this.numberOfCards = {};

        // Prepare the count
        let count = 0;

        // Go through the filters
        this.filters.forEach((filter) => {

            // For each filter, calculate the card count
            if ( filter === 'all' )
            {
                count = this._fuseCards.length;
            }
            else
            {
                count = this.numberOfCards[filter] = this._fuseCards.filter(fuseCard => fuseCard.nativeElement.classList.contains('filter-' + filter)).length;
            }

            // Fill the numberOfCards object with the counts
            this.numberOfCards[filter] = count;
        });
    }

    /**
     * Filter the cards based on the selected filter
     *
     * @private
     */
    private _filterCards(): void
    {
        // Go through all fuse-cards
        this._fuseCards.forEach((fuseCard) => {

            // If the 'all' filter is selected...
            if ( this.selectedFilter === 'all' )
            {
                // Remove hidden class from all cards
                fuseCard.nativeElement.classList.remove('hidden');
            }
            // Otherwise...
            else
            {
                // If the card has the class name that matches the selected filter...
                if ( fuseCard.nativeElement.classList.contains('filter-' + this.selectedFilter) )
                {
                    // Remove the hidden class
                    fuseCard.nativeElement.classList.remove('hidden');
                }
                // Otherwise
                else
                {
                    // Add the hidden class
                    fuseCard.nativeElement.classList.add('hidden');
                }
            }
        });
    }
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
