import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../../objects/Post';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  @Input() mesPosts: Post[];

  constructor() { }

  ngOnInit() {
  }

}
