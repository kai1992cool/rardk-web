import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectionsComponent } from './components/collections/collections.component';
import { HomeComponent } from './components/home/home.component';
import { NowComponent } from './components/now/now.component';
import { SocialLinksComponent } from './components/social-links/social-links.component';
import { LegoSetsComponent } from './components/collections/lego-sets/lego-sets.component';
import { BoardGamesComponent } from './components/collections/board-games/board-games.component';
import { BlogComponent } from './components/blog/blog.component';
import { BlogPostComponent } from './components/blog/blog-post/blog-post.component';
import { TimezonesComponent } from './components/bots/timezonebot/timezones/timezones.component';
import { AuthenticationGuard } from './guards/authentication-guard.guard';
import { ReplybotServerSelectorComponent } from './components/bots/replybot/replybot-server-selector/replybot-server-selector.component';
import { GuildReplyDefinitionsComponent } from './components/bots/replybot/guild-reply-definitions.component';
import { CallbackComponent } from './components/bots/callback/callback.component';
import { BotsComponent } from './components/bots/bots.component';

const routes: Routes = [
  { path: 'blog/:postId', component: BlogPostComponent },
  { path: 'blog', component: BlogComponent },
  {
    path: 'board-games',
    redirectTo: 'collections/board-games',
    pathMatch: 'full',
  },
  { path: 'lego', redirectTo: 'collections/lego', pathMatch: 'full' },
  { path: 'collections/board-games', component: BoardGamesComponent },
  { path: 'collections/lego', component: LegoSetsComponent },
  { path: 'now', component: NowComponent },
  { path: 'collections', component: CollectionsComponent },
  { path: 'socials', component: SocialLinksComponent },
  {
    path: 'timezones',
    component: TimezonesComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'replybot-server-selector',
    component: ReplybotServerSelectorComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'reply-definitions',
    component: GuildReplyDefinitionsComponent,
    canActivate: [AuthenticationGuard],
  },
  { path: 'bots', component: BotsComponent },
  { path: 'home', component: HomeComponent },
  { path: 'callback', component: CallbackComponent },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
