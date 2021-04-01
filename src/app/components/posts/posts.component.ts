import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { HttpClient } from "@angular/common/http";
import { AuthService } from "../../shared/services/auth.service";

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: [
    './posts.component.scss'
  ]
})
export class PostsComponent implements OnInit {
  metadataList: any[] = [];

  constructor(private http: HttpClient,
    private authService: AuthService,
    private afStorage: AngularFireStorage) { }

  ngOnInit(): void {
    this.getAllPosts();
  }

  getAllPosts(): void {
    var ref = this.afStorage.ref('');
    ref.listAll().subscribe(data => {
      for (var item of data.items) {
        console.log(item);
        item.getDownloadURL().then(url => {
          this.http.get(url).subscribe(data => {
            console.log(data);
          });
        });
        //console.log(item)
        //item.getMetadata().then(metadata => {
        //  this.metadataList.push(metadata);
        //});
      }
    });
  }

}
