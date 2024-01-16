import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://datcbackend.azurewebsites.net';

  constructor(private http: HttpClient) { }
  getLoginDetails(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/auth/login`).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  postData(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/auth/login`, data).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError('Something went wrong; please try again later.');
  }
}
