import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { HttpClient } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})

export class PostService {

  constructor(private http: HttpClient,
    private authService: AuthService,
    private afStorage: AngularFireStorage) {}

  getMetadata(fname: string) {
    return new Promise<any>((resolve, reject) => {
      var ref = this.afStorage.ref(fname);
      ref.getMetadata().subscribe(metadata => {
        var payload = metadata.customMetadata;
        resolve(new Post(payload));
      });
    });
  }

  getPost(fname: string) {
    return new Promise<any>((resolve, reject) => {
      var ref = this.afStorage.ref(fname);
      ref.getDownloadURL().subscribe(url => {
        this.http.get(url).subscribe(contents => {
          ref.getMetadata().subscribe(metadata => {
            var payload = Object.assign(
              {'contents': contents}, 
              metadata.customMetadata);
            resolve(new Post(payload));
          });
        });
      });
    });
  }

  getMetadataList() { 
    return new Promise<any>((resolve, reject) => {
      var ref = this.afStorage.ref('');
      ref.listAll().subscribe(data => {
        let requests = data.items.map((item) => {
          return this.getMetadata(item.fullPath);
        });
        Promise.all(requests).then((data) => resolve(data));
      });
    });
  }

  getPostList() { 
    return new Promise<any>((resolve, reject) => {
      var ref = this.afStorage.ref('');
      ref.listAll().subscribe(data => {
        let requests = data.items.map((item) => {
          return this.getPost(item.fullPath);
        });
        Promise.all(requests).then((data) => resolve(data));
      });
    });
  }

  createPost(post: Post) {
    var metadata = {
      customMetadata: {
        'title': post.title,
        'abstract': post.abstract,
        'timestamp': post.timestamp
      }
    };
    var blob = new Blob([post.contents], {type: "application/json"});
    return this.afStorage.ref(post.fname).put(blob, metadata);
  }

  deletePost(post: Post) {
    return this.afStorage.ref(post.fname).delete();
  }
}
