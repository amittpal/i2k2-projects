import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../../exam-services/auth/auth.service';
import { Observable } from 'rxjs/index';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isAuthenticated()) {
      //*****************************************
      //check if state.url is permitted route
      //*****************************************

      //state.url   = "_feature2"
 
      //if yes
        //return true;
      //else
        //return true;
        //this.router.navigate(['/permission-denied']);
        //return false;
      //end
      
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
