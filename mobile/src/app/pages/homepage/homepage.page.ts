import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { ApiService } from 'src/app/api.service';
import { Alert } from './homepage.model';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.page.html',
  styleUrls: ['./homepage.page.scss'],
})
export class HomepagePage implements OnInit {
  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  markAlert: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  alertData: Alert[] = [
  ];
  constructor(private router: Router, private apiService: ApiService, private http: HttpClient) { }

  ngOnInit() {
    this.fetchLocation();
    this.fetchAllergenZones();
  }

  async fetchLocation() {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            reject(error);
          }
        );
      });

      this.setPosition(position);

    } catch (error) {
      console.error("Error getting location: ", error);
    }
  }

  setPosition(position: any) {
    this.center = position;
    console.log("Received position:", position);
  }

  async fetchAllergenZones() {
    try {
      const response: HttpResponse<any> | undefined = await this.http.get(`https://datcbackend.azurewebsites.net/api/allergen/getAllAllergens`, {
        observe: 'response',
        headers: {
          'Authorization': localStorage.getItem('token') || ''
        }
      }).pipe(take(1)).toPromise();

      console.log('Response:', response);

      if (response?.status === 200) {
        const data = response.body;
        
        this.alertData = data.allergens;
        console.log('Allergens:', data.allergens);
        this.alertData.forEach((alert: Alert)=>{
          const pos: google.maps.LatLngLiteral = { lat: alert.latitude, lng: alert.longitude };
          this.setMarkedAlert(pos);
        });
        
      }
    } catch (error) {
      console.error("Error fetching allergen zones:", error);
    }
  }

  setMarkedAlert(position: any) {
    this.markAlert = position;
    console.log("Received position:", position);
  }

  addAlert()
  {
    this.router.navigate(['/addalert']);
  }


  signOut()
  {
    this.router.navigate(['/login']);
  }
}
