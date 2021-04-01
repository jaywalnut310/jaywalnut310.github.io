import Quill from 'quill';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  private editor: any;
  private post: any;

  constructor(private route: ActivatedRoute,
    private authService: AuthService,
    private postService: PostService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    var theme = 'snow';
    if (true) {//this.authService.isLoggedIn !== true) {
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
    if (true) {//this.authService.isLoggedIn !== true) {
      this.editor.disable()
      this.containerEl.nativeElement.classList.add("off");
    }
    const fname = this.route.snapshot.paramMap.get('fname') || '';
    this.postService.getPost(fname + ".json")
      .then(post => {
        this.post = post;
        this.titleEl.nativeElement.value = this.post.title;
        this.editor.setContents(this.post.contents);
      });
  }

  //upload(event: any): void {
  //  var ref = this.afStorage.ref(this.post.fname);
  //  var jsonString = JSON.stringify(this.editorComponent.editor.getContents());
  //  var metadata = {
  //    customMetadata: {
  //      'title': this.post.title,
  //      'abstract': this.editorComponent.editor.getText(0, 200),
  //      'timestamp': this.date.getTime().toString()
  //    }
  //  };
  //  var blob = new Blob([jsonString], {type: "application/json"});
  //  ref.put(blob, metadata).then((snapshot) => {
  //    this.router.navigate(['posts']).then((navigated: boolean) => {
  //      if(navigated) {
  //        this.snackBar.open('Published', '', {
  //          duration: 2000,
  //        });
  //      }
  //    });
  //  });
  //}
}
