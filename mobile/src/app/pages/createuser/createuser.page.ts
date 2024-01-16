import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-createuser',
  templateUrl: './createuser.page.html',
  styleUrls: ['./createuser.page.scss'],
})
export class CreateuserPage implements OnInit {
  username: string = '';
  email: string = '';
  password: string = '';
  constructor(private router: Router,private apiService: ApiService, private http: HttpClient) { }

  ngOnInit() {
  }

  submit(form: NgForm) {
    console.log('Submitting form', form.value);
  
    this.http.post('https://datcbackend.azurewebsites.net/api/auth/register', form.value, { observe: 'response' })
      .pipe(take(1))
      .subscribe(
        (response: HttpResponse<any>) => {
          console.log('Response:', response);
  
          if (response && response.status === 201) {
                console.log('User registered successfully'); 
  
            this.router.navigate(['/login']);
          } else {
            console.error('Error:', response);
          }
        },
        (error: any) => {
          console.error('Error:', error);
        }
      );
  }

  clearUser() {
    setTimeout(() => {
      this.username = ''; 
    }, 2000);
  }

  clearEmail() {
    setTimeout(() => {
      this.email = ''; 
    }, 2000);
  }

  clearPass() {
    setTimeout(() => {
      this.password = '';
    }, 2000);
  }
  
  backLogin()
  {
    this.router.navigate(['/login']);
  }

}
