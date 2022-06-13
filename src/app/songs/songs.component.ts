import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss']
})
export class SongsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window.location.href='https://app-songs-rs.herokuapp.com/';
  }

}
