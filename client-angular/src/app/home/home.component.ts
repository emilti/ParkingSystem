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
  totalParkingSpacesCardTitle = "Total Parking Spaces:";
  availableParkingSpacesCardTitle = "Free Parking Spaces:";
  categoriesCardTitle = "Categories:";
  discountsCardTitle = "Discounts:";
  totalParkingSpacesCardBody: String = "";
  availableParkingSpacesCardBody: String = "";
  categoriesCardBody: String = "";
  categories: Array<CategoryInfo> = [];
  discounts: Array<DiscountInfo> = [];
  discountCardBody: String = "";
  totalNumberCard = {
    color: "black",
    fontSize: "35px",
    fontWeight: "bold"
  }

  numberCardContainer = {
    padding: "10%"
  }
  availableNumberCard = {
    color: "green",
    fontSize: "35px",
    fontWeight: "bold"
  }

  listCard = {
    fontSize: "20px",
    fontWeight: "bold",
    color: "black"
  }

  listCardContainer = {
    padding: "4%"
  }


  constructor(private homeService: HomeService) { 
    
  }

  ngOnInit(): void {
    this.homeService.getStaticData().subscribe((data) => {
      this.totalParkingSpacesCardBody = data.totalParkingSpaces.toString();
      this.categories = data.categories;
      this.discounts = data.discounts;
    })

    this.homeService.getAvailableSpaces().subscribe((data) => {
      this.availableParkingSpacesCardBody = data.availableSpaces.toString();
    })
}

}
