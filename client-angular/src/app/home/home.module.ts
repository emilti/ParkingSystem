import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { StatisticsCardComponent } from './statistics-card/statistics-card.component';



@NgModule({
  declarations: [HomeComponent, StatisticsCardComponent],
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule
  ],
  bootstrap: [HomeComponent]
})
export class HomeModule { }
