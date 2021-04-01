import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from "../../shared/services/auth.service";
import { EditorComponent } from './editor.component';


@Component({
  selector: 'app-write',
  templateUrl: './write.component.html',
  styleUrls: ['./write.component.scss']
})
export class WriteComponent implements OnInit {
  @ViewChild(EditorComponent) editorComponent: any;
  @ViewChild('title') titleEl: any;

  constructor(private authService: AuthService, 
    private afStorage: AngularFireStorage, 
    private router: Router,
    private snackBar: MatSnackBar) {}

  ngOnInit(): void {
  }

  upload(event: any): void {
    const timestamp = new Date().getTime();
    const title = this.titleEl.nativeElement.value;
    var ref = this.afStorage.ref(timestamp + `_${title}.json`);
    var jsonString = JSON.stringify(this.editorComponent.editor.getContents());
    var metadata = {
      customMetadata: {
        'title': title,
        'abstract': this.editorComponent.editor.getText(0, 200),
        'timestamp': timestamp.toString()
      }
    };
    var blob = new Blob([jsonString], {type: "application/json"});
    ref.put(blob, metadata).then((snapshot) => {
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
