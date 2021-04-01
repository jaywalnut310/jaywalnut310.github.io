import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../shared/services/auth.service";
import { PostService } from "../../shared/services/post.service";
import { Post } from "../../shared/models/post.model";


@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: [
    './posts.component.scss'
  ]
})
export class PostsComponent implements OnInit {
  metadataList: Array<Post> = [];

  constructor(private authService: AuthService,
    private postService: PostService) { }

  ngOnInit(): void {
    this.postService.getMetadataList()
      .then(posts => {
        posts.sort((a: any, b: any) =>
          b.date - a.date
        )
        this.metadataList = posts;
      });
  }
}
