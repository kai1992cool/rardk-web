import { Component, OnInit } from '@angular/core';
import { BlogService } from './blog.service';
import { BlogPost } from 'src/app/models/blog-post';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
})
export class BlogComponent implements OnInit {
  public blogPosts: BlogPost[];
  isLoading: boolean;

  constructor(private blogService: BlogService, private router: Router) {}

  ngOnInit() {
    this.isLoading = true;
    this.blogService.getBlogPosts().subscribe({
      next: (blogPosts: BlogPost[]) => {
        this.blogPosts = blogPosts.sort((p1, p2) =>
          p1.publishDate > p2.publishDate ? 1 : -1
        );
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error(error);
      },
    });
  }

  openBlogPost($event: MouseEvent, postId: string) {
    // found at https://stackoverflow.com/a/64279838/386869
    if ($event.button == 1) {
      window.open('/blog/' + postId);
    } else {
      this.router.navigate(['blog', postId]);
    }
  }
}
