import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-addalert',
  templateUrl: './addalert.page.html',
  styleUrls: ['./addalert.page.scss'],
})
export class AddalertPage implements OnInit {
  latitude: number = 0;
  longitude: number = 0;
  allergenType: string = '';
  reportedBy: string = '';
  timestamp: string = '';

  constructor(private router: Router,private apiService: ApiService, private http: HttpClient) { }

  ngOnInit() {
  }

  submit(form: NgForm) {
    console.log('Submitting form', form.value);
  
    this.http.post('https://datcbackend.azurewebsites.net/api/allergen/addAllergenZone', form.value, { observe: 'response' })
      .pipe(take(1))
      .subscribe(
        (response: HttpResponse<any>) => {
          console.log('Response:', response);
  
          if (response.status === 201) {
                console.log('Alert added successfully'); 
  
            this.router.navigate(['/homepage']);
          } else {
            console.error('Error:', response);
          }
        },
        (error: any) => {
          console.error('Error:', error);
        }
      );
  }

  clearLat() {
    setTimeout(() => {
      this.latitude = 0; 
    }, 2000);
  }

  clearLng() {
    setTimeout(() => {
      this.longitude = 0; 
    }, 2000);
  }

  clearAlergen() {
    setTimeout(() => {
      this.allergenType = '';
    }, 2000);
  }

  clearReportedBy() {
    setTimeout(() => {
      this.reportedBy = '';
    }, 2000);
  }
  clearTimestamp() {
    setTimeout(() => {
      this.timestamp = '';
    }, 2000);
  }

  backHomepage()
  {
    this.router.navigate(['/homepage']);
  }

}
