import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripDataService } from '../services/trip-data.service';
import { AuthenticationService } from '../services/authentication.service';
import { Trip } from '../models/trip';
import { TripListingComponent } from '../trip-listing/trip-listing.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TripListingComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public trips: Trip[] = [];
  public isLoggedIn = false;

  constructor(
    private tripDataService: TripDataService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();

    this.tripDataService.getTrips().subscribe({
      next: (data) => {
        console.log('Trips loaded:', data);
        this.trips = data;
      },
      error: (err) => {
        console.error('Error fetching trips:', err);
      }
    });
  }
}
