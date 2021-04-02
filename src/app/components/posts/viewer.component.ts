import Quill from 'quill';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from "../../shared/services/auth.service";
import { PostService } from "../../shared/services/post.service";
import { Post } from "../../shared/models/post.model";

var icons = Quill.import('ui/icons');
icons['code'] = '<svg viewBox="0 0 18 18"> <polyline class="ql-even ql-stroke" points="5 7 3 9 5 11"></polyline> <polyline class="ql-even ql-stroke" points="13 7 15 9 13 11"></polyline></svg>';


@Component({
  selector: 'app-posts-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit {
  @ViewChild('editor') containerEl: any;
  @ViewChild('title') titleEl: any;
  @ViewChild('publishBtn') publishBtnEl: any;
  @ViewChild('deleteBtn') deleteBtnEl: any;

  private editor: any;
  private post: any;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    public authService: AuthService,
    private postService: PostService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    var theme = 'snow';
    if (this.authService.isLoggedIn !== true) {
      theme = 'bubble';
    }
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
            theme: theme
    });
    if (this.authService.isLoggedIn !== true) {
      this.editor.disable()
      this.containerEl.nativeElement.classList.add("off");
    }
    const fname = this.route.snapshot.paramMap.get('fname') || '';
    this.postService.getPost(fname + ".json")
      .then(post => {
        this.post = post;
        this.titleEl.nativeElement.innerText = this.post.title;
        this.editor.setContents(this.post.contents);
        if (this.authService.isLoggedIn) {
          this.containerEl.nativeElement.classList.add("off");
          this.titleEl.nativeElement.contentEditable = true;
          this.publishBtnEl.nativeElement.disabled= false;
          //this.deleteBtnEl.nativeElement.disabled= false;
        }
      });
  }

  upload(event: any): void {
    var post = this.post;
    post.title = this.titleEl.nativeElement.innerText;
    post.abstract = this.editor.getText(0, 200)
    post.contents = JSON.stringify(this.editor.getContents())

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

  delete(event: any): void {
    var post = this.post;
    this.postService.deletePost(post).subscribe(() => {
      this.router.navigate(['posts']).then((navigated: boolean) => {
        if(navigated) {
          this.snackBar.open('Deleted', '', {
            duration: 2000,
          });
        }
      });
    });
  }
}
