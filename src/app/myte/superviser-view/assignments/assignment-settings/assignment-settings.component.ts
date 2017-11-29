import { Component, OnInit, AfterViewChecked, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs/Subscription';
import { User, UserData, EmployeeData, EmployeeDetails, ConfigEmployeeData, PeriodData } from '../../../../app.interface';
import { Ng2Storage } from '../../../../service/storage';
import { DataService } from '../../../../service/DataService';
import { CommonService } from '../../../../service/common.service';
import { filter } from 'lodash';

@Component({
  selector: 'app-assignment-settings',
  templateUrl: './assignment-settings.component.html',
  styleUrls: ['./assignment-settings.component.css']
})
export class AssignmentSettingsComponent implements OnInit {

  public userData: User;
  public empData;
  public confirmPopupData: any;
  public config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: false
  };
  public trReviwersListSelected;
  public trSubmitToListModel: EmployeeDetails[] = [];
  public trSubmitToList: EmployeeDetails[] = [];
  public configEmpData: EmployeeData;
  public busy: Subscription;
  public selectedData;
  public allperiods;
  public assignmentTimePeriods = [];
  public selectedAssigneeTimePeriods = [];
  public assignmentObject;
  public mySettings = {
    enableSearch: true,
    checkedStyle: 'fontawesome',
    buttonClasses: 'btn btn-default btn-block',
    dynamicTitleMaxItems: 3,
    displayAllSelectedText: true
  };
  // Text configuration
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
  public trReviewers = [];
  public approvedReviewers = [];
  public notifiedReviewers = [];
  constructor(
    private storage: Ng2Storage,
    public bsModalRef: BsModalRef,
    private dataService: DataService,
    private currentRoute: ActivatedRoute,
    private commonService: CommonService,
    private modalService: BsModalService,
    private router: Router, ) { }

  public ngOnInit() {
    this.empData = this.storage.getSession('user_data');
    this.getAllEmployeeDetails();
    setTimeout(() => {
      console.log(this.selectedData)
    }, 800);
    this.getAllPeriodsData();
  }
  public getAllPeriodsData() {
    // let lastDate = this.getLastDate();
    // let date = `${lastDate.year}-${lastDate.getMonth + 1}-${lastDate.date}`
    this.busy = this.dataService.getTimePeriodDetails().subscribe((data: PeriodData) => {
      this.allperiods = data;
      let index = this.allperiods.timePeriodMasterBean.findIndex(x => x.timePeriodId == this.allperiods.currentPeriodDetailsBean.timePeriodId);
      for (let i = index; i < this.allperiods.timePeriodMasterBean.length; i++) {
        this.assignmentTimePeriods.push(this.allperiods.timePeriodMasterBean[i])
      }
    });

  }


  public populateAssignieesTPData(data, status) {
    console.log(data, status);
    if (this.selectedAssigneeTimePeriods.indexOf(data) === -1 && status) {
      this.selectedAssigneeTimePeriods.push(data);
    } else if (!status) {
      let index = this.selectedAssigneeTimePeriods.indexOf(status);
      this.selectedAssigneeTimePeriods.splice(index, 1);
    }
  }
  public submitAssignmentDetails() {
    let chrgeCodeIds = this.selectedData.map((a) => {
      return a.charge_code_id;
    });
    let AssignToIds = this.trSubmitToListModel.map((a) => {
      return a.userId;
    });
    let timePeriodIds = this.selectedAssigneeTimePeriods.map((a) => {
      return a.timePeriodId;
    });
    // this.assignmentObject = {
    //   chargeCodes: this.selectedData,
    //   assignTo: this.trSubmitToListModel,
    //   timePeriods: this.selectedAssigneeTimePeriods
    // }
    var d = new Date(); 
    let assignmentObject = {
     empIds: AssignToIds,
     chargeCodeIds:chrgeCodeIds,
     timePeriodIds:timePeriodIds,
      charge_code_assign_by: this.empData.userId,
      user_charge_code_assign_date:d.toLocaleString()
    }
    console.log(assignmentObject);
        this.busy = this.dataService.submitChargeCodeDetails(assignmentObject).subscribe((res)=>{
          console.log(res);
      if(res.actionStatus){
          this.bsModalRef.hide();
       this.commonService.configurSaving.emit(true);
      }else{
        this.bsModalRef.hide();
        this.commonService.configurSaving.emit(false);
      }
    },(err)=>{
  console.log(err);
      this.commonService.configurSaving.emit(false);
    })
  }

  public onSearch(event, name) {
    console.log(event);
    if (name == "assignToNames") {
      this.trSubmitToList = this.commonService.filterMultiSelectData(this.configEmpData.details, event.filter, 'userName');
    }
  }

  public getAllEmployeeDetails() {
    // let lastDate = this.getLastDate();
    // let date = `${lastDate.year}-${lastDate.getMonth + 1}-${lastDate.date}`
    this.busy = this.dataService.getAllEmployeeDetails().subscribe((data: EmployeeData) => {
      //this.trReviwersListModel = [];
      this.configEmpData = data;
      this.trSubmitToList = data.details;
      // setTimeout(() => {
      //   this.trReviwersListModel.push(this.trReviwersList[0]);
      // })
      setTimeout(() => {
        //this.getConfigEmpDetails();
      })
    })
  }
  public getConfigEmpDetails() {
    // let lastDate = this.getLastDate();
    // let date = `${lastDate.year}-${lastDate.getMonth + 1}-${lastDate.date}`
    this.busy = this.dataService.getConfigEmpDetails(this.empData.userId).subscribe((data: ConfigEmployeeData) => {
      this.trSubmitToListModel = [];
      this.notifiedReviewers = [];
      let notifiers = data.details.copytoId;


      this.trSubmitToListModel = this.notifiedReviewers = notifiers.map(function (obj) {
        let b = obj.split('-');
        let c = {
          userId: b[0],
          userName: b[1]
        }
        return c;
      });

      // this.trReviwersListModel = data.superiorDetails;
      // this.trSubmitToListModel= data.notifierDetails;
      // this.trApproversListModel = data.approverDetails;
      // this.trReviewers =data.superiorDetails;
      // this.notifiedReviewers=data.notifierDetails;
      // this.approvedReviewers=data.approverDetails;

      // setTimeout(() => {
      //   this.trReviwersListModel.push(this.trReviwersList[0]);
      // })
    })
  }

  public removeSlUsers(index, name) {
    if (name == "assignToNames") {
      this.notifiedReviewers.splice(index, 1);
      this.trSubmitToListModel = this.notifiedReviewers;
    }

  }

  public getUserDetails() {
    let userId = this.storage.getSession('user_data');
    // this.dataService.getUser(userId.userId).subscribe((data: User) => {
    //   console.log('USERS', data);
    //   this.commonService.menuItems.emit(data.details.menuBeanList);
    //   this.userData = data;
    // })
  }

  public openModal(template: TemplateRef<any>) {
    // this.trReviwersListModel= [];
    // this.trSubmitToListModel= [];
    // this.trApproversListModel = [];
    // this.trReviwersList;
    // this.trSubmitToList;
    // this.trApproversList;
    this.getAllEmployeeDetails();
    this.bsModalRef = this.modalService.show(AssignmentSettingsComponent);
    // this.modalRef = this.modalService.show(template, this.config);
  }

  public getTimeReport(name) {
    if (name == "assignToNames") {
      let filtereData = filter(this.configEmpData.details, (obj) => {
        return this.commonService.findWithAttr(this.trSubmitToListModel, 'userId', obj['userId']);
      });
      this.notifiedReviewers = filtereData;
    }

  }
  public saveConfigDetails() {

    let notifierIds = this.trSubmitToListModel.map((obj) => {
      // return obj.userId + '-' + obj.userName;
      return obj.userId;
    });
    var configObject = {
      empId: this.empData.userId,
      copytoId: notifierIds,
    };
    // this.busy = this.dataService.saveConfigEmployeeDetails(configObject).subscribe((res) => {
    //   //this.getTimeSheetDetails(this.allperiods.currentPeriodDetailsBean.timePeriodId);
    //   if (res.actionStatus) {
    //     this.bsModalRef.hide();
    //    this.commonService.configurSaving.emit(true);
    //   }else{
    //     this.commonService.configurSaving.emit(false);
    //   }
    // }, (err) => {
    //   console.log('SAVE-ERROR', err);
    //   this.commonService.configurSaving.emit(false);
    // })

  }

}
