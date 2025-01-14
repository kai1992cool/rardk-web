import { Component } from '@angular/core';
import { FeedItem } from 'src/app/models/feed-item';
import { GoodreadsItem } from 'src/app/models/goodreads-item';
import { GoodreadsService } from './goodreads.service';
import { take } from 'rxjs';
import { FeedPostersComponent } from '../../shared/feed-posters/feed-posters.component';

@Component({
    selector: 'app-goodreads-card',
    templateUrl: './goodreads-card.component.html',
    styleUrls: ['./goodreads-card.component.scss'],
    standalone: true,
    imports: [FeedPostersComponent],
})
export class GoodreadsCardComponent {
  public isFinishedBooksLoading: boolean;
  public isCurrentlyReadingLoading: boolean;
  public finishedBooksFeedItems: FeedItem[];
  public currentlyReadingBooksFeedItems: FeedItem[];
  private numberOfBooksToList = 5;

  constructor(private goodreadsService: GoodreadsService) {}

  ngOnInit() {
    this.isFinishedBooksLoading = true;
    this.isCurrentlyReadingLoading = true;
    this.populateFinishedBooksItems();
    this.populateCurrentlyReadingBooksItems();
  }

  public async populateFinishedBooksItems() {
    this.goodreadsService
      .getGoodreadsFinishedBooksFeed(this.numberOfBooksToList)
      .pipe(take(1))
      .subscribe((result: GoodreadsItem[]) => {
        this.finishedBooksFeedItems = result.map((m) => {
          return {
            title: m.title,
            summary: m.summary,
            imageUrl: m.imageUrl,
            rating: m.rating * 2, //goodreads sends this value out of 5, so multiply it to make it out of 10
            url: m.url,
          } as FeedItem;
        });
        this.isFinishedBooksLoading = false;
      });
  }

  public async populateCurrentlyReadingBooksItems() {
    this.goodreadsService
      .getGoodreadsCurrentlyReadingBooksFeed(this.numberOfBooksToList)
      .pipe(take(1))
      .subscribe((result: GoodreadsItem[]) => {
        this.currentlyReadingBooksFeedItems = result.map((m) => {
          return {
            title: m.title,
            summary: m.summary,
            imageUrl: m.imageUrl,
            url: m.url,
          } as FeedItem;
        });
        this.isCurrentlyReadingLoading = false;
      });
  }
}
