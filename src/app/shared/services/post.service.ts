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
        var payload = Object.assign(
          {'fname': fname}, 
          metadata.customMetadata);
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
              {'fname': fname, 'contents': contents}, 
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


//  getPostList() { 
//    return new Promise<any>((resolve, reject) => {
//      var ref = this.afStorage.ref('');
//      ref.listAll().subscribe(data => {
//        let requests = data.items.map((item) => {
//          return this.getPost(item.fullPath);
//        });
//        Promise.all(requests).then((data) => resolve(data));
//      });
//    });
//    //return this.angularFirestore
//    //.collection("post-collection")
//    //.snapshotChanges();
//  }



  createPost(post: Post) {
    //return new Promise<any>((resolve, reject) =>{
    //  this.angularFirestore
    //    .collection("post-collection")
    //    .add(post)
    //    .then(response => { console.log(response) }, error => reject(error));
    //});
  }

  deletePost(id: string) {
    //return this.angularFirestore
    //  .collection("post-collection")
    //  .doc(id)
    //  .delete();
  }
  
  updatePost(post: Post, id: string) {
    //return this.angularFirestore
    //  .collection("post-collection")
    //  .doc(id)
    //  .update({
    //    title: post.title,
    //    abs: post.abs,
    //    contents: post.contents,
    //    timestamp: post.date.getTime()
    //  });
  }
}
