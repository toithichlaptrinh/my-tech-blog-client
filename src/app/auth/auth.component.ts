import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../core/models';
import { Errors } from '../core/models/errors.model';
import { UserService } from '../core/services';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  authType: String = '';
  title: String = '';
  errors: Errors = { errors: {} };
  isSubmitting = false;
  authForm!: FormGroup;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder) {
    // use FormBuilder to create a form group
    this.authForm = this.fb.group({
      'email': ['', Validators.required],
      'password': ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.url.subscribe(data => {
      // Get the last piece of the URL (it's either 'login' or 'register')
      this.authType = data[data.length - 1].path;

      // Set a title for the page accordingly
      this.title = (this.authType === 'login') ? 'Sign in' : 'Sign up';

      // add form control for username if this is the register page
      if (this.authType === 'register') {
        this.authForm.addControl('username', new FormControl());
      }
    });
  }

  submitForm() {
    this.isSubmitting = true;

    this.errors = { errors: {} };

    
    this.userService
      .attemptAuth(this.authType, this.authForm.value)
      .subscribe(
        data => { this.router.navigateByUrl('/'); console.log(data);},
        err => {
          this.errors = err;
          this.isSubmitting = false;
        }
      );
  }
}
