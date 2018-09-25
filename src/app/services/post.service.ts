import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from '../models/post.model';


@Injectable()
export class PostService {

    postsSubject = new Subject<Post[]>();

    private posts = [];
    private postsInit = [
        new Post('Le passage de Lorem Ipsum standard, utilisé depuis 1500',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
            , 1, 0),
        new Post('Section 1.10.32 du "De Finibus Bonorum et Malorum" de Ciceron (45 av. J.-C.)',
            'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?'
            , -1, 1),
        new Post('Section 1.10.33 du "De Finibus Bonorum et Malorum" de Ciceron (45 av. J.-C.)',
            'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.'
            , 2, 2)
    ];
    constructor(private httpClient: HttpClient) { }

    emitPostSubject() {
        if (this.posts == null || this.posts.length == 0)
            this.posts = [];
        this.postsSubject.next(this.posts.slice());
    }

    addPost(title: string, content: string) {
        const postObject = {
            id: 0,
            title: '',
            content: '',
            created_at: new Date(),
            loveIts: 0
        };
        postObject.title = title;
        postObject.content = content;
        if (this.posts == null || this.posts.length == 0) {
            postObject.id = 0;
            this.posts = [];
        }
        else
            postObject.id = this.posts[(this.posts.length - 1)].id + 1;
        this.posts.push(postObject);
        this.emitPostSubject();
        this.savePostsToServer();

    }

    likePost(post: Post) {
        var postIndexToLike = this.posts.find(
            (postEl) => {
                if (postEl === post) {
                    return true;
                }
            }
        );
        postIndexToLike.loveIts += 1;
        this.emitPostSubject();
        this.savePostsToServer();
    }

    dislikePost(post: Post) {
        var postIndexToLike = this.posts.find(
            (postEl) => {
                if (postEl === post) {
                    return true;
                }
            }
        );
        postIndexToLike.loveIts -= 1;
        this.emitPostSubject();
        this.savePostsToServer();
    }

    deletePost(post: Post) {
        const postIndexToRemove = this.posts.findIndex(
            (postEl) => {
                if (postEl === post) {
                    return true;
                }
            }
        );
        this.posts.splice(postIndexToRemove, 1);
        this.emitPostSubject();
        this.savePostsToServer();
    }

    initData() {
        this.posts = [];
        this.postsInit.forEach(element => {
            this.posts.push(element);
        });
        this.emitPostSubject();
        this.savePostsToServer();
    }

    savePostsToServer() {
        this.httpClient
            .put('https://blogooc.firebaseio.com//posts.json', this.posts)
            .subscribe(
                () => {
                    console.log('Enregistrement terminé !');
                },
                (error) => {
                    console.log('Erreur ! : ' + error);
                }
            );
    }

    getPostsFromServer() {
        this.httpClient
            .get<any[]>('https://blogooc.firebaseio.com//posts.json')
            .subscribe(
                (response) => {
                    this.posts = response;
                    // if (this.posts === null)
                    //   this.posts = this.postsInit;
                    if (this.posts != null)
                        this.emitPostSubject();
                },
                (error) => {
                    console.log('Erreur ! : ' + error);
                }
            );

    }

}