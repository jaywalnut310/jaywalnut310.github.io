export class Post {
  fname: string;
  title: string;
  abstract: string;
  date: Date;
  contents?: object;

  constructor(payload: any){
    this.fname = payload.fname;
    this.title = payload.title;
    this.abstract = payload.abstract;
    this.date = new Date(parseInt(payload.timestamp));
    this.contents = payload.contents || {"ops":[]};
  }

  get dateString() {
    var d = this.date.toDateString().split(' ').slice(1, 4);
    return `${d[0]} ${d[1]}, ${d[2]}` 
  }
}
