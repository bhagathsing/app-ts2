import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Ng2Storage } from '../../../service/storage';
import { Subscription } from 'rxjs/Subscription';
import { DataService } from '../../../service/DataService';
import { EmployeeData, Roles } from '../../../app.interface';
import { ConfirmComponent } from '../../../common/confirm/confirm.component';
import { CommonService } from '../../../service/common.service';

@Component({
  selector: 'app-role-mapping',
  templateUrl: './role-mapping.component.html',
  styleUrls: ['./role-mapping.component.css']
})
export class RoleMappingComponent implements OnInit {
  @ViewChild(ConfirmComponent) public confirmModal: ConfirmComponent;
  
  public confirmPopupData: any;
  public busy: Subscription;
  public allEmployees: EmployeeData;
  public reoleModel:any[] = [];
  public allRolesData: Roles;
  public allRolesDataOptions:any[];
  public empModel:any[] = [];
  public selectedEmp:any[] = [];

  public mySettings = {
    enableSearch: true,
    checkedStyle: 'fontawesome',
    buttonClasses: 'btn btn-default btn-block',
    dynamicTitleMaxItems: 3,
    displayAllSelectedText: true
  };

  public myTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Unselect all',
    checked: 'item selected',
    checkedPlural: 'items selected',
    searchPlaceholder: 'Find',
    searchEmptyResult: 'Nothing found...',
    searchNoRenderText: 'Type in search box to see results...',
    defaultTitle: 'Select',
    allSelected: 'All selected',
  };

  constructor(
    private storage: Ng2Storage, 
    private dataService: DataService,
    private commonService: CommonService,
    private router: Router) { }

  public ngOnInit() {
    this.confirmPopupData = this.commonService.setConfirmOptions('Confirm', 'Are you sure want to submit without saving details ?', 'Yes', 'Cancel', 'warning', 'No'
  );
    this.getAllEmployeeDetails();
    this.getRoles();
  }


  private _disabledV: string = '0';

  public selected(value: any): void {
    this.selectedEmp = [];
    let selectedItem = { userId: value.id, userName: value.text }
    this.selectedEmp.push(selectedItem);
    this.empModel = JSON.parse(JSON.stringify(this.selectedEmp));
  }

  public removed(value: any): void {
    this.selectedEmp = [];
  }



  public getAllEmployeeDetails() {
    let allEmp = this.storage.getSession('allemp');
    if(!allEmp){
      this.busy = this.dataService.getAllEmployeeDetails().subscribe((data: EmployeeData) => {
        this.storage.setSession('allemp',data);
        this.allEmployees = this.storage.getSession('allemp');
        console.log(this.allEmployees);
      })
    }else{
      this.allEmployees = allEmp;
      console.log(this.allEmployees);
    }
  }
  public onSelectRole( evt ){
    this.reoleModel = evt;
  }
  public removeSlUsers(index, arr, type) {
    arr.splice(index,1);
    if(type == 'emp'){
      this.empModel = [];
    }
  }
  public getRoles(){
    this.dataService.getRoles().subscribe((data)=>{
      console.log(data);
      this.allRolesData = data;
      this.allRolesDataOptions = JSON.parse(JSON.stringify(data.details))
    });
  }

  public saveMapRole(){
    if(this.selectedEmp.length === 0 || this.reoleModel.length === 0){
      let message:string = 'Select all fields';
      if(this.selectedEmp.length === 0){
        message = 'Please select one employee';
      }else if(this.reoleModel.length === 0){
        message = 'Please select roles';
      }
      
      this.confirmPopupData = this.commonService.setConfirmOptions('Error', message, 'Ok', '--', 'danger');
      this.confirmModal.show(null)
        .then((): void => {
        }).catch(() => {
        })
        return false;
     }
    let obj = {
      empId:this.selectedEmp[0].userId,
      roleIds:[]
    };
    this.reoleModel.forEach((ele)=>{
      obj.roleIds.push(ele.roleId);
    });
    this.dataService.assignRoles(obj).subscribe((data)=>{
      if(data.actionStatus){

        this.confirmPopupData = this.commonService.setConfirmOptions('Success', 'Successfully saved!', 'Ok', '--', 'success');
        this.confirmModal.show(null)
        .then((): void => {
          setTimeout(()=>{
            this.router.navigate(['/app']);
          },700);
          this.empModel = [];
          this.selectedEmp = [];
          this.reoleModel = [];
        }).catch(() => {
        })
      }else{
        this.confirmPopupData = this.commonService.setConfirmOptions('Error', 'Not saved successfully', 'Ok', '--', 'danger');
        this.confirmModal.show(null)
        .then((): void => {
        }).catch(() => {
        })
      }
    },(err)=>{
      this.confirmPopupData = this.commonService.setConfirmOptions('Error', 'Error while saving', 'Ok', '--', 'danger');
      this.confirmModal.show(null)
      .then((): void => {
      }).catch(() => {
      })
    })
  }
  public onSearch(event) {
      this.allRolesDataOptions = this.commonService.filterMultiSelectData(this.allRolesData.details, event.filter, 'roleName');
  }


}
