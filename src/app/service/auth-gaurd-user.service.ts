import { Injectable }       from '@angular/core';
import { Ng2Storage } from './storage';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  NavigationExtras,
  CanLoad, Route
}                           from '@angular/router';
import { DataService } from '../service/DataService';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: DataService, private router: Router,private storage: Ng2Storage) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    return this.checkLogin(url);
  }

  
  checkLogin(url: string): boolean {
    let metaData =  this.storage.getSession('user_data')
    if (metaData.userRoleName.toLocaleString() !== 'reviewer') { 
      return true; 
    }
    this.router.navigate(['/login']);
    return false;
  }
}