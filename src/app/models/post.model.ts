export class Post {
  
    public created_at: Date;

    constructor(public title: string,public content: string,public loveIts: number,public id: number) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.loveIts = loveIts;
        this.created_at = new Date();
    }

}



