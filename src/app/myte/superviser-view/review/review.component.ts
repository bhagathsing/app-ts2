import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../service/DataService';
import { Ng2Storage } from '../../../service/storage';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { Timesheet, ChargeCode, TimePeriod, ResourceData, PeriodData,Location } from '../../../app.interface';
import { Subscription } from 'rxjs/Subscription';
import { TableComponent } from '../../../common/table/table.component';
import { CalendarService } from '../../../common/calendar/calendar.service';
import { CommonService } from '../../../service/common.service';
import { ConfirmComponent } from '../../../common/confirm/confirm.component';
import { find } from 'lodash';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {
  @ViewChild(TableComponent) tables: TableComponent;
  @ViewChild('gridParent') parentElent: ElementRef;
  @ViewChild(ConfirmComponent) public confirmModal: ConfirmComponent;

  bsConfig: Partial<BsDatepickerConfig>;

  public minDate: Date;
  public maxDate: Date;

  public bsModalRef: BsModalRef;
  public confirmPopupData: any;

  public resourceListForm; FormGroup;
  public timeSheetData: Timesheet;
  public busy: Subscription;
  public userData;
  public dateRange: string;
  public empData;
  private originalRowsCountHeightLeft: number;
  private rowHeaderHeight: number = 58;
  private rowBodyHeight: number = 39;
  private periodID: number = 0;
  public allperiods: PeriodData;
  public statusText: string;
  public emptyDates: any[];

  public leftTableRowCount: any;
  public chargeCode: ChargeCode;

  public resourceData: ResourceData;
  public isApprover: boolean = false;
  public commentError: boolean = false;
  public locations:Location;

  constructor(
    private currentRoute: ActivatedRoute,
    private dataService: DataService,
    private storage: Ng2Storage,
    private modalService: BsModalService,
    private commonService: CommonService,
    private calendarService: CalendarService, private fb: FormBuilder) { }

  public ngOnInit() {
    this.resourceListForm = this.fb.group({
      employeeId: ''
    });
    this.empData = this.storage.getSession('user_data');
    // this.dateRange= this.getStartAndEndDate(this.calendarService.MothDaysData);
    this.getAllPeriodsData();
    //this.getTimePeriod();
    this.confirmPopupData = this.commonService.setConfirmOptions('Confirm', 'Are you sure want to approve ?', 'Yes', 'Cancel', 'warning', 'Yes', 'I acknowledge that hours that are charged by the user is verified by me'
    );
    this.getLocaions();
  }
  private getLocaions(){
    let isLocation = this.storage.getSession('locations');
    if(!isLocation){
      this.busy = this.dataService.getLocations().subscribe((data)=>{
        this.storage.setSession('locations',data);
        this.locations = this.storage.getSession('locations');
      })
    }else{
      this.locations = this.storage.getSession('locations');
    }
  }
  public getStartAndEndDate(dateArray) {
    let startDate = dateArray[0].date + ' ' + dateArray[0].monthName + ' ' + dateArray[dateArray.length - 1].year;
    let endDate = dateArray[dateArray.length - 1].date + ' ' + dateArray[dateArray.length - 1].monthName + ' ' + dateArray[dateArray.length - 1].year;
    return startDate + ' - ' + endDate
    //return endDate
  }

  public getChargeCode(empId: string, periodId: number) {
    this.dataService.getChargeCodes(empId, periodId).subscribe((data: ChargeCode) => {
      this.chargeCode = data;
    })
  }

  public getAllPeriodsData() {
    this.busy = this.dataService.getTimePeriodDetails().subscribe((data: PeriodData) => {
      this.allperiods = data;
      this.emptyDates = this.getDateRange(this.allperiods.currentPeriodDetailsBean.timePeriodName);
      let dates = data.timePeriodMasterBean;
      this.minDate = new Date(dates[0].timePeriodLastdate);
      this.maxDate = new Date(dates[dates.length - 1].timePeriodLastdate);

      this.dateRange = data.currentPeriodDetailsBean.timePeriodName;
      this.getResourceDetails(data.currentPeriodDetailsBean.timePeriodId, null);
    });
  }

  public nextDate() {
    let index = this.allperiods.timePeriodMasterBean.findIndex(x => x.timePeriodId == this.allperiods.currentPeriodDetailsBean.timePeriodId) + 1;
    if (index < this.allperiods.timePeriodMasterBean.length) {
      this.allperiods.currentPeriodDetailsBean = this.allperiods.timePeriodMasterBean[index];
      this.emptyDates = this.getDateRange(this.allperiods.currentPeriodDetailsBean.timePeriodName);
      this.dateRange = this.allperiods.currentPeriodDetailsBean.timePeriodName;
      this.getResourceDetails(this.allperiods.currentPeriodDetailsBean.timePeriodId, null);
    }
  }
  public prevDate() {
    this.calendarService.prevDateRange();
    // this.dateRange= this.getStartAndEndDate(this.calendarService.MothDaysData);
    // this.getTimePeriod();

    let index = this.allperiods.timePeriodMasterBean.findIndex(x => x.timePeriodId == this.allperiods.currentPeriodDetailsBean.timePeriodId) - 1;
    if (index >= 0) {
      this.allperiods.currentPeriodDetailsBean = this.allperiods.timePeriodMasterBean[index];
      this.emptyDates = this.getDateRange(this.allperiods.currentPeriodDetailsBean.timePeriodName);
      this.dateRange = this.allperiods.currentPeriodDetailsBean.timePeriodName;
      this.getResourceDetails(this.allperiods.currentPeriodDetailsBean.timePeriodId, null);
    }

  }

  private getDateRange(date) {
    var WeekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var dateArray = [];
    let dateString = date.split(' - ');
    let startDateString = dateString[0];
    let lastDateString = dateString[1];
    let startDate = new Date(startDateString);//timePeriodLastdate
    let endDate = new Date(lastDateString);
    var i = startDate.getDate();
    var len = endDate.getDate();

    for (i; i <= len; i++) {
      var d = new Date((startDate.getMonth() + 1) + '/' + i + '/' + startDate.getFullYear());
      var cDate = d.getDate();
      var cDay = d.getDay();
      var dMonth = d.getMonth();
      var cYear = d.getFullYear();
      var cMonthName = monthNames[dMonth];
      var cWeekName = WeekDays[cDay];
      dateArray.push({
        day: cDate + ' ' + cMonthName + ' ' + cWeekName
      });
    }

    return dateArray;
  }
  public getReviewDetailData(empId: string, periodId: number) {
    this.busy = this.dataService.getTimeSheetDetails(empId, periodId).subscribe((res) => {
      let filterNewRecord = res.details.filter((obj) => {
        return obj.tstatus !== 'Draft'
      })
      this.timeSheetData = res;

      this.timeSheetData.details = filterNewRecord;
     
      if (this.timeSheetData.details.length > 0) {

        let txt = this.timeSheetData.details[0].tstatus;
        this.statusText = txt == 'Draft' ? 'Not Submitted' : txt;

        this.timeSheetData.tableHeader = this.timeSheetData.details[0].dataBean;

      } else {
        this.statusText = '';
        this.timeSheetData.tableHeader = this.emptyDates;
        if (filterNewRecord.length === 0) {
          this.statusText = 'Not Submitted';
          this.timeSheetData.totalHours.map(obj => {
            obj.dayHrs = 0;
          });
          this.timeSheetData.totalTsHorsLogged = 0;
        }
      }
      if (!res.actionStatus) {
      } else {
      }
    }, (err) => {
      console.log(err);
    })
  }


  public getResourceDetails(periodId: number, empId) {
    this.busy = this.dataService.getReviewDetails(this.empData.userId, periodId).subscribe((res) => {
      this.resourceData = res;
      this.originalRowsCountHeightLeft = ((this.resourceData.details.length + 1)) * 38;
      this.getRows(this.parentElent.nativeElement);
      if (this.resourceData.details.length > 0) {

        this.resourceListForm.patchValue({
          employeeId: this.resourceData.details[0].employeeId
        });
        let dataObj = this.resourceData.details;
        let isEmpID = empId ? empId : dataObj[0].employeeId;
        this.isApprover = (dataObj[0].approverorEmpId === this.empData.userId);
        this.getReviewDetailData(isEmpID, periodId);
        this.getChargeCode(this.resourceData.details[0].employeeId, periodId);
      } else {
        this.resourceListForm.patchValue({
          employeeId: ''
        });
        let dayCounts = this.emptyDates.length;
        this.timeSheetData = this.dataService.generateEmptyGrid(dayCounts);
        this.timeSheetData.tableHeader = this.emptyDates;
        this.statusText = '';
        this.isApprover = false;
        this.chargeCode = {details:[],actionStatus:false};
      }
    }, (err) => {
      console.log(err);
    })
  }

  private getRows(ele: any) {
    let offsetTop = ele.getBoundingClientRect().top;
    let wH = window.innerHeight;
    this.leftTableRowCount = Math.floor((wH - offsetTop - 40 - this.rowHeaderHeight - this.originalRowsCountHeightLeft) / this.rowBodyHeight);
    this.leftTableRowCount = this.leftTableRowCount <= 0 ? new Array(0) : new Array(this.leftTableRowCount - 1);
  }

  public changeUser(form: FormGroup, obj) {
    this.statusText = obj.status === 'Draft' ? 'Not Submitted' : obj.status;
    let val = find(this.resourceData.details, (obj) => {
      return obj.employeeId === form.value.employeeId;
    });
    this.isApprover = (val.approverorEmpId === this.empData.userId);
    this.getChargeCode(val.employeeId, this.allperiods.currentPeriodDetailsBean.timePeriodId);
    this.getReviewDetailData(val.employeeId, this.allperiods.currentPeriodDetailsBean.timePeriodId);
  }
  public saveTimesheet(form: FormGroup, val, commentData) {
    let saveObj = Object.assign({}, this.timeSheetData);
    let dataObj = this.MapTimeSheet(saveObj, val, commentData);
    if (val.toLowerCase() === 'approved') {
      this.confirmModal.show(null)
        .then((data): void => {
          if (data.isCheckbox) {
            this.busy = this.dataService.saveTimeSheet(dataObj).subscribe((res) => {
              if (!res.actionStatus) {
                this.confirmPopupData = this.commonService.setConfirmOptions('Error', 'Data not approved', 'Ok', '--', 'danger');
                this.confirmModal.show(null)
                  .then((): void => {
                  }).catch(() => {
                  })
              } else {
                this.confirmPopupData = this.commonService.setConfirmOptions('Success', 'Data approved' + ' successfully', 'Ok', '--', 'success');
                this.confirmModal.show(null)
                  .then((): void => {
                  }).catch(() => {
                  })
              }
              this.getResourceDetails(this.allperiods.currentPeriodDetailsBean.timePeriodId, form.value.employeeId);
            }, (err) => {
              console.log(err);
              this.confirmPopupData = this.commonService.setConfirmOptions('Error', 'Unable to approve the data', 'Ok', '--', 'danger');
              this.confirmModal.show(null)
                .then((): void => {
                }).catch(() => {
                })
            });
          }
        }).catch(() => {
        })
    } else {
      this.commentError = false;
      if (dataObj.details[0].comments) {
        this.busy = this.dataService.saveTimeSheet(dataObj).subscribe((res) => {
          if (!res.actionStatus) {
            this.confirmPopupData = this.commonService.setConfirmOptions('Error', 'Data not rejected', 'Ok', '--', 'danger');
            this.confirmModal.show(null)
              .then((): void => {
              }).catch(() => {
              })
          } else {
            this.confirmPopupData = this.commonService.setConfirmOptions('Success', 'Data rejected successfully with comments', 'Ok', '--', 'success');
            this.confirmModal.show(null)
              .then((): void => {
              }).catch(() => {
              })
          }
          this.getResourceDetails(this.allperiods.currentPeriodDetailsBean.timePeriodId, form.value.employeeId);
          this.bsModalRef.hide();
        }, (err) => {
          console.log(err);
          this.confirmPopupData = this.commonService.setConfirmOptions('Error', 'Unable to reject the data', 'Ok', '--', 'danger');
          this.confirmModal.show(null)
            .then((): void => {
            }).catch(() => {
            })
        });
      } else {
        //alert('Please mention comments');
        this.commentError = true;
      }
    }
  }
  public MapTimeSheet(obj, val, commentData) {
    for (var i = 0; i < obj.details.length; i++) {
      obj.details[i].tstatus = val;
      obj.details[i].comments = commentData;
    }
    return obj;
  }
  public openModal(template: TemplateRef<any>) {
    this.bsModalRef = this.modalService.show(template);
  }
  private monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];


  public onDateSelect(event) {
    console.log(event.getDate() + " " + this.monthNames[event.getMonth()] + " " + event.getFullYear());
    let selectedDate = event.getDate() + " " + this.monthNames[event.getMonth()] + " " + event.getFullYear();
    let selectedDateSplitArray = selectedDate.split(' ');
    //this.findPeriodStartDate(selectedDateSplitArray);
    let period = this.commonService.findPeriodStartDate(selectedDateSplitArray);
    this.findDateRange(period);
  }

  private findDateRange(period) {
    let index = this.allperiods.timePeriodMasterBean.findIndex(x => x.timePeriodName.indexOf(period) > -1);
    this.allperiods.currentPeriodDetailsBean = this.allperiods.timePeriodMasterBean[index];
    this.emptyDates = this.getDateRange(this.allperiods.currentPeriodDetailsBean.timePeriodName);
    this.dateRange = this.allperiods.currentPeriodDetailsBean.timePeriodName;
    this.getResourceDetails(this.allperiods.currentPeriodDetailsBean.timePeriodId, null);
  }
}
