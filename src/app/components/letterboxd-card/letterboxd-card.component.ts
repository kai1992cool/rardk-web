import { Component } from '@angular/core';
import { take } from 'rxjs';
import { FeedItem } from 'src/app/models/feed-item';
import { LetterboxdItem } from 'src/app/models/letterboxd-item';
import { LetterboxdService } from './letterboxd.service';

@Component({
  selector: 'app-letterboxd-card',
  templateUrl: './letterboxd-card.component.html',
  styleUrls: ['./letterboxd-card.component.scss'],
})
export class LetterboxdCardComponent {
  public isLoading: boolean;
  public feedItems: FeedItem[];
  private numberOfMoviesToList = 5;

  constructor(private letterboxdService: LetterboxdService) {}

  ngOnInit() {
    this.isLoading = true;
    this.populateLetterboxdItems();
  }

  public async populateLetterboxdItems() {
    this.letterboxdService
      .getLetterboxdFeed(this.numberOfMoviesToList)
      .pipe(take(1))
      .subscribe((result: LetterboxdItem[]) => {
        this.feedItems = result.map((m) => {
          return {
            title: m.title,
            summary: m.summary,
            date: m.watchedDate,
            imageUrl: m.imageUrl,
            isRepeat: m.isRewatch,
            rating: m.rating * 2, //letterboxd sends this value out of 5, so multiply it to make it out of 10
            url: m.url,
          } as FeedItem;
        });
        this.isLoading = false;
      });
  }
}
