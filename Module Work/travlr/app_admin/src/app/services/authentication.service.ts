import { Inject, Injectable } from '@angular/core';
import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { TripDataService } from './trip-data.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage,
    private tripDataService: TripDataService
  ) {}

  public getToken(): string {
    return this.storage.getItem('travlr-token') || '';
  }

  public saveToken(token: string): void {
    this.storage.setItem('travlr-token', token);
  }

  public login(credentials: { email: string; password: string }): Observable<any> {
    return this.tripDataService.login(credentials)
      .pipe(
        map(authResp => {
          this.saveToken(authResp.token);
          return authResp;
        })
      );
  }

  public register(user: User): Observable<any> {
    return this.tripDataService.register(user)
      .pipe(
        map(authResp => {
          this.saveToken(authResp.token);
          return authResp;
        })
      );
  }

  public logout(): void {
    this.storage.removeItem('travlr-token');
  }

  public isLoggedIn(): boolean {
    const token = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > (Date.now() / 1000);
    }
    return false;
  }

  public getCurrentUser(): User | undefined {
    if (this.isLoggedIn()) {
      const token = this.getToken();
      const { email, name } = JSON.parse(atob(token.split('.')[1]));
      return { email, name } as User;
    }
    return undefined;
  }
}
