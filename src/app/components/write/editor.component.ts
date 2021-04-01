import Quill from 'quill';
import { Component, OnInit, ViewChild } from '@angular/core';

var icons = Quill.import('ui/icons');
icons['code'] = '<svg viewBox="0 0 18 18"> <polyline class="ql-even ql-stroke" points="5 7 3 9 5 11"></polyline> <polyline class="ql-even ql-stroke" points="13 7 15 9 13 11"></polyline></svg>';


@Component({
  selector: 'app-write-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  @ViewChild('editor') containerEl: any;
  private editor: any;

  constructor() { }

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
            placeholder: 'Write your story ...',
            theme: 'snow'
        });
  }

  DownloadPost(){
    var sJson = JSON.stringify(this.editor.getContents());
    const link = document.createElement('a');
    link.setAttribute('href', "data:text/json;charset=UTF-8," + encodeURIComponent(sJson));
    link.setAttribute('download', 'post.json');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}
