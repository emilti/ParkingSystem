import { Component, OnInit } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { HomeService } from '../core/home.service';
import CategoryInfo from '../core/models/CategoryInfo';
import DiscountInfo from '../core/models/DiscountInfo';
import StaticData from '../core/models/StaticData';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  totalParkingSpacesTitle = "Total Parking Spaces:";
  availableParkingSpacesTitl = "Free Parking Spaces:";
  categoriesTitle = "Categories:";
  discountsTitle = "Discounts:";
  totalParkingSpacesCardBody: String = "";
  availableParkingSpacesBody: String = "";
  categoriesCardBody: String = "";
  categories: Array<CategoryInfo> = [];
  discounts: Array<DiscountInfo> = [];
  discountCardBody: String = "";

  constructor(private homeService: HomeService) { 
    
  }

  ngOnInit(): void {
    this.homeService.getStaticData().subscribe((data) => {
      this.totalParkingSpacesCardBody = data.totalParkingSpaces.toString();
      this.categories = data.categories;
      this.discounts = data.discounts;
    })
  }

}
