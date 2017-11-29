import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BsModalService,BsModalRef } from 'ngx-bootstrap/modal';

import { DataService } from '../../../service/DataService';
import { Ng2Storage } from '../../../service/storage';
import { Timesheet, ChargeCode, TimePeriod, PeriodData, SaveConfigEmployeeData, Location } from '../../../app.interface';
import { Subscription } from 'rxjs/Subscription';
import { TableComponent } from '../../../common/table/table.component';
import { CalendarService } from '../../../common/calendar/calendar.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ConfirmComponent } from '../../confirm/confirm.component';
import { CommonService } from '../../../service/common.service';
import { findIndex, find, filter } from 'lodash';
import { RecordHistoryComponent } from '../../record-history/record-history.component';
@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css']
})
export class RecordComponent implements OnInit, AfterViewInit {
  @ViewChild(TableComponent) tables: TableComponent;
  @ViewChild(ConfirmComponent) public confirmModal: ConfirmComponent;
  bsConfig: Partial<BsDatepickerConfig>;
  public minDate: Date;
  public maxDate: Date;


  public timeSheetData: Timesheet;
  public busy: Subscription;
  public dateRange: string;
  public chargeCode: ChargeCode;
  public empData;
  public calendarData: any;
  public isSave: boolean = false;
  public statusTxt: string = '';
  public allperiods: PeriodData;
  public emptyDates: any[];
  public commentTxt: string = '';
  public approverListData: SaveConfigEmployeeData;

  public confirmPopupData: any;
  public modalRef: BsModalRef;
  public locations:Location;
  public myData = 'Bhagath nSIngh';
  public sampleHtml:string;

  public modalConfig = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: false
   // class: ' modal-lg add-assign'
  };

  constructor(
    private dataService: DataService,
    private modalService: BsModalService,
    private storage: Ng2Storage,
    private calendarService: CalendarService,
    private commonService: CommonService) { }

  public ngOnInit() {
    this.getLocaions();
    this.empData = this.storage.getSession('user_data');
    this.confirmPopupData = this.commonService.setConfirmOptions('Confirm', 'Are you sure want to submit without saving details ?', 'Yes', 'Cancel', 'warning', 'No'
    );
    this.getAllPeriodsData();
    this.getApproversList();
    this.commonService.getAllConfigEmp.subscribe((data) => {
      this.getApproversList();
    })
  }

  ngAfterViewInit(){
    this.sampleHtml = `<div>{{myData}}</div>`;
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
  public getApproversList() {
    this.dataService.getConfigEmpDetails(this.empData.userId).subscribe((data) => {
      if (data.details) {
        this.approverListData = data.details
      }
    })
  }
  public getStartAndEndDate(dateArray) {
    let startDate = dateArray[0].date + ' ' + dateArray[0].monthName + ' ' + dateArray[dateArray.length - 1].year;
    let endDate = dateArray[dateArray.length - 1].date + ' ' + dateArray[dateArray.length - 1].monthName + ' ' + dateArray[dateArray.length - 1].year;
    this.calendarData = dateArray;
    return startDate + ' - ' + endDate
  }
  public getTimeSheetDetails(id: number) {
    this.busy = this.dataService.getTimeSheetDetails(this.empData.userId, id).subscribe((data: Timesheet) => {
      this.timeSheetData = data;
      if (this.timeSheetData.details.length > 0) {
        this.statusTxt = this.timeSheetData.details[0].tstatus;
        this.commentTxt = this.timeSheetData.details[0].comments;
        // if(this.statusTxt == "Rejected"){
        //   this.statusTxt = "Rejected";
        // }
        this.timeSheetData.tableHeader = this.timeSheetData.details[0].dataBean;
      } else {
        this.statusTxt = '';
        let dayCounts = this.emptyDates.length;
        this.timeSheetData = this.dataService.generateEmptyGrid(dayCounts);
        this.timeSheetData.tableHeader = this.emptyDates;
      }
    }, (err) => {
      console.log(err);
    })
  }
  public getChargeCode(periodId: number) {
    this.busy = this.dataService.getChargeCodes(this.empData.userId, periodId).subscribe((data: ChargeCode) => {
      data.details.unshift({
        charge_code: '',
        charge_code_description: '--- Select ---',
        charge_code_id: ''
      });
      this.chargeCode = data;
    })
  }

  public getAllPeriodsData() {
    // let lastDate = this.getLastDate();
    // let date = `${lastDate.year}-${lastDate.getMonth + 1}-${lastDate.date}`
    this.busy = this.dataService.getTimePeriodDetails().subscribe((data: PeriodData) => {
      this.allperiods = data;
      this.emptyDates = this.getDateRange(this.allperiods.currentPeriodDetailsBean.timePeriodName);
      this.dateRange = data.currentPeriodDetailsBean.timePeriodName;
      let dates = data.timePeriodMasterBean;
      this.minDate = new Date(dates[0].timePeriodLastdate);
      this.maxDate = new Date(dates[dates.length-1].timePeriodLastdate);
      this.getTimeSheetDetails(data.currentPeriodDetailsBean.timePeriodId);
      this.getChargeCode(data.currentPeriodDetailsBean.timePeriodId);
    });

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
        day: cDate + ' ' + cMonthName + ' ' + cWeekName,
        countryName:'HYD',
        editCountry:false,
        countryId:1
      });
    }

    return dateArray;
  }

  public nextDate() {
    let index = this.allperiods.timePeriodMasterBean.findIndex(x => x.timePeriodId == this.allperiods.currentPeriodDetailsBean.timePeriodId) + 1;
    if (index < this.allperiods.timePeriodMasterBean.length) {
      this.allperiods.currentPeriodDetailsBean = this.allperiods.timePeriodMasterBean[index];
      this.emptyDates = this.getDateRange(this.allperiods.currentPeriodDetailsBean.timePeriodName);
      this.dateRange = this.allperiods.currentPeriodDetailsBean.timePeriodName;
      this.getTimeSheetDetails(this.allperiods.currentPeriodDetailsBean.timePeriodId);
      this.getChargeCode(this.allperiods.currentPeriodDetailsBean.timePeriodId);
    }
  }
  public prevDate() {
    let index = this.allperiods.timePeriodMasterBean.findIndex(x => x.timePeriodId == this.allperiods.currentPeriodDetailsBean.timePeriodId) - 1;
    if (index >= 0) {
      this.allperiods.currentPeriodDetailsBean = this.allperiods.timePeriodMasterBean[index];
      this.emptyDates = this.getDateRange(this.allperiods.currentPeriodDetailsBean.timePeriodName);
      this.dateRange = this.allperiods.currentPeriodDetailsBean.timePeriodName;
      this.getTimeSheetDetails(this.allperiods.currentPeriodDetailsBean.timePeriodId);
      this.getChargeCode(this.allperiods.currentPeriodDetailsBean.timePeriodId);
    }
  }

  public saveTimesheet(val) {
    let saveObj = Object.assign({}, this.timeSheetData);
    let mappedData = this.MapTimeSheet(saveObj, val);
    let mappedDataN = Object.assign({}, mappedData);

    this.validateEmptyHoursWithSelectedChargeCode(mappedData.details);
    let filterSelectedData = this.commonService.findSelectedChargeCode(mappedData.details, 'selected');
    mappedData.details = filterSelectedData;
    if (val === 'Submitted') {
      var valid = this.validateHours(mappedData, mappedDataN.details);
      if (valid) {
        if (this.approverListData.approverIds) {
          this.confirmModal.show(this.approverListData)
            .then((data): void => {
              if (data.isCheckbox) {
                this.saveTimesheetData(val, mappedData, "submitted");
              }
            }).catch(() => {
            });
        } else {
          this.confirmPopupData = this.commonService.setConfirmOptions('Error', 'Please select the approvers whom you need to submit the timesheet report', 'Ok', '--', 'danger');
          this.confirmModal.show(null)
            .then((): void => {
            }).catch(() => {
            })
        }
      }
    }
    if (val !== 'Submitted') {
      let isEmpty = this.validateEmptyAndDuplicate(saveObj, mappedDataN.details);
      if (isEmpty) {
        this.saveTimesheetData(val, mappedData, "saved");
      }
    }
  }

  public saveTimesheetData(val, data, param) {
    this.busy = this.dataService.saveTimeSheet(data).subscribe((res) => {
      if (!res.actionStatus) {
        this.confirmPopupData = this.commonService.setConfirmOptions('Error', 'Data not ' + param, 'Ok', '--', 'danger');
        this.confirmModal.show(null)
          .then((): void => {
          }).catch(() => {
          })
      } else {
        this.confirmPopupData = this.commonService.setConfirmOptions('Success', 'Data ' + param + ' successfully', 'Ok', '--', 'success');
        this.confirmModal.show(null)
          .then((): void => {
          }).catch(() => {
          })
      }
      this.getTimeSheetDetails(this.allperiods.currentPeriodDetailsBean.timePeriodId);
    }, (err) => {
      this.confirmPopupData = this.commonService.setConfirmOptions('Error', 'Unable to save the data', 'Ok', '--', 'danger');
      this.confirmModal.show(null)
        .then((): void => {
        }).catch(() => {
        })
    })
  }
  public MapTimeSheet(obj, val) {
    for (var i = 0; i < obj.details.length; i++) {
      obj.details[i].tstatus = val;
    }
    return obj;
  }

  private findEmptyHrswithSelectedChrgeCode(data, cloneData) {
    let filtereData = filter(cloneData, (obj) => {
      if (obj.assignmentId !== '') {
        let count = 0;
        var findData = find(obj.dataBean, (objs) => {
          if (objs.hours) {
            return true;
          }
        });
        return !findData;


      }
    });

    return filtereData;
  }

  private validateHours(data: Timesheet, cloneData?) {
    let d_empty = this.validateEmptyAndDuplicate(data, cloneData);
    if (!d_empty) {
      return false;
    }
    let emptyHrs = this.findEmptyHrswithSelectedChrgeCode(data, cloneData)
    let isToalHours = this.checkTotalHours(data.totalHours, 9);
    if (isToalHours.length > 0) {
      this.confirmPopupData = this.commonService.setConfirmOptions('Error', 'All the working days should be clocked 9 hrs', 'Ok', '--', 'danger');
      this.confirmModal.show(null)
        .then((): void => {
        }).catch(() => {
        })
      return false;
    }
    if (emptyHrs.length > 0) {
      this.confirmPopupData = this.commonService.setConfirmOptions('Error', 'Please select hours', 'Ok', '--', 'danger');
      this.confirmModal.show(null)
        .then((): void => {
        }).catch(() => {
        })
      return false;
    }

    let arrData = data.details;
    let totalCount = data.totalHours;
    let len = totalCount.length * 9;
    let isHoliday = data.tableHeader.filter((obj) => {
      return (!obj.weekday || obj.holiday);
    });
    // let allHours = totalCount.reduce((sum, next)=>{
    //    return sum + next.dayHrs;
    // },0);
    let holidayValidation = totalCount.find((obj) => {
      return (!obj.weekday && obj.dayHrs > 24);
    });
    let allHours = totalCount.find((obj) => {
      return (obj.weekday && (obj.dayHrs < 9 || obj.dayHrs > 24));
    });
    let totalHrs = len - (isHoliday.length * 9);
    let isToalHours2 = this.checkTotalHours(data.totalHours, 24);
    if (holidayValidation) {
      this.confirmPopupData = this.commonService.setConfirmOptions('Error', 'Holiday hours should not be more than 24 hrs', 'Ok', '--', 'danger');
      this.confirmModal.show(null)
        .then((): void => {
        }).catch(() => {
        })
      return false;
    }
    if (allHours) {
      this.confirmPopupData = this.commonService.setConfirmOptions('Error', 'Day hours should be minimum 9hrs and Maximum 24 hrs', 'Ok', '--', 'danger');
      this.confirmModal.show(null)
        .then((): void => {
        }).catch(() => {
        })
      return false;
    } else {
      this.confirmPopupData = this.commonService.setConfirmOptions('Confirm', 'Are you sure want to submit without saving details ?', 'Yes', 'Cancel', 'warning', 'Yes', 'I acknowledge the hours that are charged against the assignment are appropriate.');
      return true;
    }
  }

  private validateEmptyAndDuplicate(data: Timesheet, mappedData?: any) {

    let isChargeCode = this.commonService.findSelectedChargeCode(data.details, 'selected');
    let isDuplicate = this.commonService.findSelectedChargeCode(data.details, 'no');

    if (isChargeCode.length <= 0) {
      this.confirmPopupData = this.commonService.setConfirmOptions('Error', 'Charge code should not be empty', 'Ok', '--', 'danger');
      this.confirmModal.show(null)
        .then((): void => {
        }).catch(() => {
        })
      return false;
    }
    if (isDuplicate.length > 0) {
      this.confirmPopupData = this.commonService.setConfirmOptions('Error', 'Duplicate charge code not allowed', 'Ok', '--', 'danger');
      this.confirmModal.show(null)
        .then((): void => {
        }).catch(() => {
        })
      return false;
    }
    let allHours = data.totalHours.find((obj) => {
      return (obj.weekday && obj.dayHrs > 24);
    });
    if (allHours) {
      this.checkTotalHours(data.totalHours,24);
      this.confirmPopupData = this.commonService.setConfirmOptions('Error', 'Day hours should not be more than 24 hrs', 'Ok', '--', 'danger');
      this.confirmModal.show(null)
        .then((): void => {
        }).catch(() => {
        })
      return false;
    }

    let selectedChargeCode = this.validateEmptyHoursWithSelectedChargeCode(mappedData);
    if (selectedChargeCode) {
      this.confirmPopupData = this.commonService.setConfirmOptions('Error', 'You should select charge code along with hours', 'Ok', '--', 'danger');
      this.confirmModal.show(null)
        .then((): void => {
        }).catch(() => {
        })
      return false;
    }
    return true;
  }

  private checkTotalHours(data, hour) {
    data.forEach(obj => {
      obj.isValidHour = false;
      if (hour === 9) {
        if (obj.weekday && obj.dayHrs < hour) {
          obj.isValidHour = true;
        }
      } else {
        if (obj.dayHrs > hour) {
          obj.isValidHour = true;
        }
      }
    });
    return data.filter((obj) => {
      return obj.isValidHour;
    });
  }


  private validateEmptyHoursWithSelectedChargeCode(arr) {
    var getInd = findIndex(arr, (obj) => {
      var findData = find(obj.dataBean, (objs) => {
        if (objs.hours) {
          return true;
        }
      });
      return findData && !obj.assignmentId;
    });
    if (getInd !== -1) {
      arr[getInd].isSelectValid = true;
      return true;
    } else {
      return false;
    }
  }

  private monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  public onDateSelect(event) {
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
    this.getTimeSheetDetails(this.allperiods.currentPeriodDetailsBean.timePeriodId);
    this.getChargeCode(this.allperiods.currentPeriodDetailsBean.timePeriodId);
  }

  public clearAllFormData() {
    this.getTimeSheetDetails(this.allperiods.currentPeriodDetailsBean.timePeriodId);
    // let gridData = this.timeSheetData.details;
    // console.log(this.timeSheetData)
    //   gridData.forEach((obj)=>{
    //     obj.assignmentId = '';
    //     obj.tsTotal = 0;
    //     var beanData = obj.dataBean;
    //     beanData.forEach((objs)=>{
    //       objs.hours = null;
    //     })
    //   });
    // let totalHours = this.timeSheetData.totalHours;
    // totalHours.forEach((obj)=>{
    //   obj.dayHrs = 0;
    // });
    // this.timeSheetData.totalTsHorsLogged = 0;
  }

  public getHistory(){
    this.modalRef = this.modalService.show(RecordHistoryComponent,this.modalConfig);
  }
}
