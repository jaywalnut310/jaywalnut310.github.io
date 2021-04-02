import Quill from 'quill';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from "../../shared/services/auth.service";
import { PostService } from "../../shared/services/post.service";
import { Post } from "../../shared/models/post.model";

var icons = Quill.import('ui/icons');
icons['code'] = '<svg viewBox="0 0 18 18"> <polyline class="ql-even ql-stroke" points="5 7 3 9 5 11"></polyline> <polyline class="ql-even ql-stroke" points="13 7 15 9 13 11"></polyline></svg>';


@Component({
  selector: 'app-writer',
  templateUrl: './writer.component.html',
  styleUrls: ['./writer.component.scss']
})
export class WriterComponent implements OnInit {
  @ViewChild('editor') containerEl: any;
  @ViewChild('title') titleEl: any;
  private editor: any;
  private post: any;

  constructor(private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService, 
    private postService: PostService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.editor = new Quill(this.containerEl.nativeElement, {
            modules: {
                syntax: true,
                toolbar: [
                  [{ 'header': [1, 2, false] }],
                  ['bold', 'italic', 'underline', 'strike', { 'background': ['#fff', '#fafa86', '#ffc88e', '#ff84fc'] }],
                  ['blockquote', { 'align': ['justify', 'center', 'right'] }],
                  ['formula', 'code', 'code-block'],
                  ['link', 'image']
                ]
            },
            theme: 'snow'
    });
  }

  upload(event: any): void {
    const date = new Date();
    const title = this.titleEl.nativeElement.innerText;
    var post = new Post({
      'title': title,
      'date': date,
      'abstract': this.editor.getText(0, 200),
      'contents': JSON.stringify(this.editor.getContents())
    });

    this.postService.createPost(post).then((snapshot) => {
      this.router.navigate(['posts']).then((navigated: boolean) => {
        if(navigated) {
          this.snackBar.open('Published', '', {
            duration: 2000,
          });
        }
      });
    });
  }
}
