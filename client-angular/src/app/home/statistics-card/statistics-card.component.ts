import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-statistics-card',
  templateUrl: './statistics-card.component.html',
  styleUrls: ['./statistics-card.component.css']
})
export class StatisticsCardComponent implements OnInit {

  @Input() cardTitle: String = "";

  constructor() { }

  ngOnInit(): void {

  }

}
