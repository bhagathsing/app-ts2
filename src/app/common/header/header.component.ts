import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';
import { User, UserData, EmployeeData, EmployeeDetails, ConfigEmployeeData, LastLoginDetails } from '../../app.interface';
import { Ng2Storage } from '../../service/storage';
import { DataService } from '../../service/DataService';
import { CommonService } from '../../service/common.service';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { filter } from 'lodash';

import { ConfigSettingsComponent } from '../config-settings/config-settings.component';

@Component({
  selector: 'myte-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public userData: User;
  public modalRef: BsModalRef;
  public lastLoginData:LastLoginDetails;
  constructor(
    private storage: Ng2Storage,
    private dataService: DataService,
    private commonService: CommonService,
    private modalService: BsModalService,
    private router: Router, ) { }

  public ngOnInit() {
    this.getUserDetails();
    this.getLastLoginDetails();
  }
  public getLastLoginDetails() {
    let userId = this.storage.getSession('user_data');
    this.dataService.getLastLoginData(userId.userId).subscribe((data: LastLoginDetails) => {
      // this.commonService.menuItems.emit(data.details.menuBeanList);
      // this.userData = data;
      this.lastLoginData = data;
    })
  }
  
  public getUserDetails() {
    let userId = this.storage.getSession('user_data');
    this.dataService.getUser(userId.userId).subscribe((data: User) => {
      this.commonService.menuItems.emit(data.details.menuBeanList);
      this.userData = data;
    })
  }

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(ConfigSettingsComponent);
  }
  public logOut() {
    this.storage.removeSession('user_data');
    this.storage.clearAllSession();
    this.router.navigate(['/login']);
  }
}

