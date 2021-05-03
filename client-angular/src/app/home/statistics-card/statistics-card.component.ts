import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-statistics-card',
  templateUrl: './statistics-card.component.html',
  styleUrls: ['./statistics-card.component.css']
})
export class StatisticsCardComponent implements OnInit {

  @Input() cardTitle: String = "";
  @Input() customContentStyle: Object = {};
  @Input() customContentContainerStyle: Object = {};
  constructor() { } 

  ngOnInit(): void {

  }

}
