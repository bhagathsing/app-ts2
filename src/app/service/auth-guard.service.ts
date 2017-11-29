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
  private adminRoles:string[] = ['reviewer','approver','project admin'];
  constructor(private authService: DataService, private router: Router,private storage: Ng2Storage) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url = route.routeConfig.path;
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    let metaData =  this.storage.getSession('user_data');
    if(!metaData){
      this.router.navigate(['/login']);
      return false;
    }
    let isUser = metaData.userRoleName.toLocaleLowerCase();
    if((this.adminRoles.indexOf(isUser) !== -1 ) && url === 'superviser') {
      return true;
    }else if((this.adminRoles.indexOf(isUser) !== -1 ) && url === 'userview'){
      this.router.navigate(['/app/superviser']);
      return false;
    }else if((this.adminRoles.indexOf(isUser) === -1 )&& url === 'userview'){
      return true;
    }else if((this.adminRoles.indexOf(isUser) === -1 ) && url === 'superviser'){
      this.router.navigate(['/app/userview']);
      return false;
    }
  }
}