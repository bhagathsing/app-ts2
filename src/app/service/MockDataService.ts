import { Injectable } from '@angular/core';
import { DataService } from './DataService';
import { Ng2Storage } from '../service/storage';
import * as util from '../common/utils/util';
import { 
    ILogin, User,
    AllEmployees,Timesheet, 
    ChargeCode, TimePeriod,
    ResourceData,PeriodData,
    ChargeCodeDetails, FunctionGroups,
    BusinessUnit, DeliverUnit,ChargeCodeType,
    SaveChargeCode,SaveChargeCodeResp,
    EmployeeData,SaveConfigEmployeeData,
    LastLoginDetails,chargeCodeObject,
    Assignroles,AssignrolesResponse,Roles,
    TimeSheetSummaryReport,Location,
    ConfigEmployeeData} from '../app.interface';
import { find, filter } from 'lodash';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import * as mockData from './mockData/app.mockData';

@Injectable()
export class MockDataService extends DataService {

    private readonly basePath = 'http://172.16.28.51:8111/';
    private readonly userLoginUrl =  this.getBaseURI('mytr')+'/authenticate';
    private readonly userUrl = this.getBaseURI('mytr/');

    private getBaseURI( url){
       return this.basePath +  url;
    }

    constructor(private storage:Ng2Storage) {
        super();
    }
    /**
     * Login user
     * @param obj { Object }
     */
    public UserData:any = {};
    public loginUser( obj: ILogin): Observable<AllEmployees> {
        var data = mockData.AllUsers;
        return Observable.create( observer => {
            setTimeout(()=>{
                let filterData = find(data,(objs)=>{
                    return objs.userId.toLocaleLowerCase() === obj.userId.toLocaleLowerCase();
                });
                this.storage.setSession('user_data',{
                    userName:filterData.employeeName,
                    userId:filterData.employeeId,
                    userRoleId:filterData.employeeRoleId,
                    userRoleName:filterData.employeeRoleName,
                    token:util.generateToken(50)
                });
                observer.next(filterData);
                observer.complete();
            },1000)
        });
    }
    public generateEmptyGrid( len:number){
        
    }
    
    /**
     * Get Logedin user details
     * @param id {String} - EmployeeId
     */
    public getUser( id: string):Observable<User>{
       var data = mockData.AllUsers;
       return Observable.create( observer => {
           let filterData = find(data,(obj)=>{
                return obj.userId.toLocaleLowerCase() === id.toLocaleLowerCase();
            });
            setTimeout(()=>{
                
                observer.next(filterData);
                observer.complete();
            },1000);
        });
    }
    public getTimeSheetDetails(empId,id):Observable<Timesheet>{
        return Observable.create( observer => {
             setTimeout(()=>{
                 observer.next(mockData.timeSheetDetail);
                 observer.complete();
             },1000);
         });
    }
    public getChargeCodes(empId,chargeCode):Observable<ChargeCode>{
        return Observable.create( observer => {
             setTimeout(()=>{
                 observer.next(mockData.timeSheetDetail);
                 observer.complete();
             },1000);
         });
    }
    public getTimePeriod(empId):Observable<TimePeriod>{
        return Observable.create( observer => {
             setTimeout(()=>{
                 observer.next(mockData.timeSheetDetail);
                 observer.complete();
             },1000);
         });
    }
    public saveTimeSheet(obj: Timesheet):Observable<any>{
        return Observable.create( observer => {
             setTimeout(()=>{
                 observer.next(mockData.timeSheetDetail);
                 observer.complete();
             },1000);
         });
    }
    public getReviewDetails(id:string, num:number):Observable<ResourceData>{
        return Observable.create( observer => {
             setTimeout(()=>{
                 observer.next(mockData.timeSheetDetail);
                 observer.complete();
             },1000);
         });
    }
    public getTimePeriodDetails():Observable<PeriodData>{
        return Observable.create( observer => {
             setTimeout(()=>{
                 observer.next(mockData.timeSheetDetail);
                 observer.complete();
             },1000);
         });
    }
    public getEmployeeDetails(empId):Observable<EmployeeData>{
        return Observable.create( observer => {
             setTimeout(()=>{
                 observer.next(mockData.timeSheetDetail);
                 observer.complete();
             },1000);
         });
    }
     public getAllEmployeeDetails():Observable<EmployeeData>{
        return Observable.create( observer => {
             setTimeout(()=>{
                 observer.next(mockData.timeSheetDetail);
                 observer.complete();
             },1000);
         });
    }
    public saveConfigEmployeeDetails(obj: SaveConfigEmployeeData):Observable<any>{
        return Observable.create( observer => {
             setTimeout(()=>{
                 observer.next(mockData.timeSheetDetail);
                 observer.complete();
             },1000);
         });
    }
    public getConfigEmpDetails(empId):Observable<ConfigEmployeeData>{
        return Observable.create( observer => {
             setTimeout(()=>{
                 observer.next(mockData.timeSheetDetail);
                 observer.complete();
             },1000);
         });
    }
    public getChargeCodeDetails(empId:string ):Observable<ChargeCodeDetails>{
        return Observable.create( observer => {
             setTimeout(()=>{
                 observer.next(mockData.timeSheetDetail);
                 observer.complete();
             },1000);
         });
    }
    public getFunctionGroups():Observable<FunctionGroups>{
        return Observable.create( observer => {
             setTimeout(()=>{
                 observer.next(mockData.timeSheetDetail);
                 observer.complete();
             },1000);
         });
    }
    public getBusinessUnit( functionId: number):Observable<BusinessUnit>{
        return Observable.create( observer => {
             setTimeout(()=>{
                 observer.next(mockData.timeSheetDetail);
                 observer.complete();
             },1000);
         });
    }
    public getDeliveryUnit( functionId: number):Observable<DeliverUnit>{
        return Observable.create( observer => {
             setTimeout(()=>{
                 observer.next(mockData.timeSheetDetail);
                 observer.complete();
             },1000);
         });
    }
    public getChargeCodeType():Observable<ChargeCodeType>{
        return Observable.create( observer => {
             setTimeout(()=>{
                 observer.next(mockData.timeSheetDetail);
                 observer.complete();
             },1000);
         });
    }
    public getSubChargeCodeType():Observable<ChargeCodeType>{
        return Observable.create( observer => {
             setTimeout(()=>{
                 observer.next(mockData.timeSheetDetail);
                 observer.complete();
             },1000);
         });
    }
    public getAccountIds(buId:number ,duId:number):Observable<ChargeCodeType>{
        return Observable.create( observer => {
             setTimeout(()=>{
                 observer.next(mockData.timeSheetDetail);
                 observer.complete();
             },1000);
         });
    }
    public saveChargeCode(obj:SaveChargeCode):Observable<SaveChargeCodeResp>{
        return Observable.create( observer => {
             setTimeout(()=>{
                 observer.next(mockData.timeSheetDetail);
                 observer.complete();
             },1000);
         });
    }
    public getLastLoginData(empId):Observable<LastLoginDetails>{
        return Observable.create( observer => {
             setTimeout(()=>{
                 observer.next(mockData.timeSheetDetail);
                 observer.complete();
             },1000);
         });
    }
    public submitChargeCodeDetails(obj: chargeCodeObject):Observable<any>{
        return Observable.create( observer => {
             setTimeout(()=>{
                 observer.next(mockData.timeSheetDetail);
                 observer.complete();
             },1000);
         });
    }
    public assignRoles(obj: Assignroles):Observable<AssignrolesResponse>{
        return Observable.create( observer => {
             setTimeout(()=>{
                 observer.next(mockData.timeSheetDetail);
                 observer.complete();
             },1000);
         });
    }
    public getRoles():Observable<Roles>{
        return Observable.create( observer => {
             setTimeout(()=>{
                 observer.next(mockData.timeSheetDetail);
                 observer.complete();
             },1000);
         });
    }
    public getTimeSheetSummaryReport( empid: string):Observable<TimeSheetSummaryReport>{
        return Observable.create( observer => {
             setTimeout(()=>{
                 observer.next(mockData.timeSheetDetail);
                 observer.complete();
             },1000);
         });
    }
    public getLocations():Observable<Location>{
        return Observable.create( observer => {
             setTimeout(()=>{
                 observer.next(mockData.timeSheetDetail);
                 observer.complete();
             },1000);
         });
    }

}

