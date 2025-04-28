import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BROWSER_STORAGE } from '../storage';
import { AuthResponse } from '../models/authresponse';
import { Trip } from '../models/trip';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class TripDataService {
  private apiBaseUrl = 'http://localhost:3000/api';
  private tripUrl = `${this.apiBaseUrl}/trips`;

  constructor(
    private httpClient: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.storage.getItem('travlr-token');
    return new HttpHeaders({
      Authorization: `Bearer ${token || ''}`,
      'Content-Type': 'application/json'
    });
  }

  public addTrip(formData: Trip): Observable<Trip> {
    return this.httpClient.post<Trip>(this.tripUrl, formData, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  public getTrip(tripCode: string): Observable<Trip> {
    return this.httpClient.get<Trip>(`${this.tripUrl}/${tripCode}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }
  
  public getTrips(): Observable<Trip[]> {
    return this.httpClient.get<Trip[]>(this.tripUrl, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }
  

  public updateTrip(formData: Trip): Observable<Trip> {
    return this.httpClient.put<Trip>(`${this.tripUrl}/${formData.code}`, formData, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  public deleteTrip(tripCode: string): Observable<any> {
    if (!tripCode) {
      return throwError(() => new Error('Invalid trip code for deletion'));
    }
    return this.httpClient.delete(`${this.tripUrl}/${tripCode}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  public login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    const url = `${this.apiBaseUrl}/login`;
    return this.httpClient.post<AuthResponse>(url, credentials)
      .pipe(catchError(this.handleError));
  }

  public register(user: User): Observable<AuthResponse> {
    const url = `${this.apiBaseUrl}/register`;
    return this.httpClient.post<AuthResponse>(url, user)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error(error.error?.message || 'Server error'));
  }
}
