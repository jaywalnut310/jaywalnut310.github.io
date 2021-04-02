export class Post {
  title: string;
  abstract: string;
  date: Date;
  contents: string;

  constructor(payload: any){
    this.title = payload.title;
    this.abstract = payload.abstract;
    if (payload.date) {
      this.date = payload.date;
    }
    else { // from timestamp string
      this.date = new Date(parseInt(payload.timestamp));
    }
    this.contents = payload.contents || "{'ops':[]}";
  }

  get fname() {
    return this.timestamp + '.json'
  }

  get dateString() {
    var d = this.date.toDateString().split(' ').slice(1, 4);
    return `${d[0]} ${d[1]}, ${d[2]}` 
  }

  get timestamp() {
    return this.date.getTime().toString()
  }
}
