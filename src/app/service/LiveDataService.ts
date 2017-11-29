import { Injectable } from '@angular/core';
import { Http, Headers, Response,RequestOptionsArgs,RequestOptions } from '@angular/http';
import { DataService } from './DataService';
import { Ng2Storage } from '../service/storage';
import * as util from '../common/utils/util';
import { 
    ILogin, User, 
    Timesheet,SaveConfigEmployeeData,
    ChargeCode,ConfigEmployeeData,
    TimePeriod,AssignrolesResponse,
    ResourceData,Assignroles,
    PeriodData,EmployeeData,
    ChargeCodeDetails,TimeSheetSummaryReport,
    FunctionGroups, BusinessUnit,
    DeliverUnit,SaveChargeCodeResp,
    SaveChargeCode,ChargeCodeType,
    LastLoginDetails,chargeCodeObject, Roles,
    Location
    } from '../app.interface';
import { find } from 'lodash';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


@Injectable()
export class LiveDataService extends DataService {

    private readonly basePath = 'http://172.16.28.51:8111/'; // This is for local
    //private readonly basePath = '/timesheet/';             // This is for Production
    private readonly MyTrUrl = 'mytr/';
    private readonly userLoginUrl =  this.getBaseURI()+'authenticate';
    private readonly timeSheetDetail = this.getBaseURI()+'timesheetdetails'
    private readonly userUrl = this.getBaseURI();
    private readonly ChargeCodesList = this.getBaseURI()+'chargecodeslist';
    private readonly TimePeriod = this.getBaseURI()+'periods';
    private readonly SaveTimeSheet = this.getBaseURI()+'savesheet';
    private readonly ReviewDetails = this.getBaseURI()+'resources';
    private readonly PeriodDetails = this.getBaseURI()+'allperiods';
    
    private readonly employeeDetails = this.getBaseURI()+'allemployees';
    private readonly allEmployeeDetails = this.getBaseURI()+'allemps';
    private readonly saveConfigEmployeeDetail = this.getBaseURI()+'saveapproverdetails';
    private readonly getConfigEmployeeDetails = this.getBaseURI()+'getapproverdetails';

    private readonly Chargecodesdetails = this.getBaseURI()+'chargecodesdetails'; //adminchargecodedetails
    private readonly FunctionGroups = this.getBaseURI()+'allfunctiongroups';
    private readonly BusinessUnit = this.getBaseURI()+'allbusinessunits';
    private readonly DeliveryUnit = this.getBaseURI()+'alldeliveryunits';
    private readonly ChargeCodeTypeUrl = this.getBaseURI()+'allchargecodetypes';
    private readonly SubChargeCodeTypeUrl = this.getBaseURI()+'allchargecodesubtypes';
    private readonly AccountIdsUrl = this.getBaseURI()+'allaccountids';
    private readonly SaveChargeCodeUrl = this.getBaseURI()+'savechargecodedetails';
    private readonly lastLoginDetails = this.getBaseURI()+'lastlogindate';
    private readonly SubmitChargeCodes = this.getBaseURI()+'assignchargecodes';
    private readonly AssignrolesUrl = this.getBaseURI()+'assignroles';
    private readonly RolesUrl = this.getBaseURI()+'roles';
    private readonly TimeSheetSummaryReport = this.getBaseURI()+'timesheetsummaryreport';
    private readonly Locations = this.getBaseURI()+'locations';

    public UserData:any={};

    private readonly REQUEST_HEADERS: Headers = new Headers({ 
        'Content-Type': 'application/json; charset=utf-8',
        'Accept':'application/json'
    });
    private readonly REQUEST_OPTIONS: RequestOptionsArgs = new RequestOptions({ headers: this.REQUEST_HEADERS });

    private getBaseURI(){
       return this.basePath +  this.MyTrUrl;
    }

    constructor(private http: Http, private storage:Ng2Storage) {
        super();
    }
    public generateEmptyGrid( dayCount){
        var obj = {
            details:[],
            actionStatus:true,
            errorMessage:null,
            totalHours:[],
            totalTsHorsLogged:0
        };

       return this.mapTimeSheetData(obj,dayCount);
    }
    private getTotalHors(  arr ){
        var ind = 0;
        if(arr && arr.length<=0){
          return false;
        }
        return arr.reduce((sum, value) => {
          return sum + value.hours;
        },0);
    }
    private mapTimeSheetData( obj, dateLenCount){
        var i=0;
        var objs = {
            details:[],
            actionStatus:true,
            errorMessage:null,
            totalHours:[],
            totalTsHorsLogged:0,
        };
        var data = obj?obj:objs;
        var tabData = data.details;
        var len = tabData.length;
        if(!data ||  tabData.length <=0){
           var x=0;
           for(x; x<dateLenCount;x++){
            data.totalHours[x]={
                dayHrs:0,
                day:'',
                weekday:'',
                holiday:'',
                isValidHour:false,
                location_hours:9
            };
           }
          return data;
        }
        
        for(i; i<len; i++){
            tabData[i].tsTotal = this.getTotalHors(tabData[i].dataBean);
            var hours = tabData[i].dataBean;
            tabData[i].location_hours = 9;
            var x=0;
            if(i==0){
                data.totalHours = [];
                var y=0;
                for(y; y<hours.length; y++){
                    data.totalHours[y] = {
                        dayHrs:0,
                        day:'',
                        weekday:hours[y].weekday,
                        holiday:hours[y].holiday,
                        isValidHour:false,
                        location_hours:9
                    }
                }
            }
            for(x; x<hours.length; x++){
                var h = hours[x];
                    h.countryName = 'HYD';
                    h.countryId = 1;
                    h.editCountry = false;
                h.hours = h.hours > 0 ? h.hours : null;
                h.isValidHour = false;
                data.totalHours[x].dayHrs +=hours[x].hours;
                if(i== 0){
                    data.totalHours[x].day=hours[x].day
                }
                if(tabData[i].recordNew){
                    hours[x].hours = null;
                }
            }
            if(tabData[i].recordNew){
                tabData[i].assignmentId = '';
                tabData[i].isSelectValid = false;
                tabData[i].isDisableSelect = false;
            }
        }
        data.totalTsHorsLogged = data.totalHours.reduce((sum, value)=>{
            return sum + value.dayHrs;
        },0);
        return data;
    }

    private isNewData( arr ){
        var arrLen = arr.length;
        var i=0;
        for(i; i<arrLen; i++){
            
        }
    }

    /**
     * Login user
     * @param obj { Object }
     */
    public loginUser( obj: ILogin): Observable<any> {
        let req = JSON.stringify(obj);
        return this.http.post(this.userLoginUrl,req,this.REQUEST_OPTIONS)
        .map((reponse:Response)=>{
            let resp = reponse.json();
           
            if( resp.employeeId ){
                this.storage.setSession('user_data',{
                    userName:resp.employeeName,
                    userId:resp.employeeId,
                    userRoleId:resp.employeeRoleId,
                    userRoleName:resp.employeeRoleName,
                    token:util.generateToken(50)
                });
            }
            return reponse.json();
        });
    }
    
    /**
     * Get Logedin user details
     * @param id {string} EmployeeId
     */
    public getUser( id: string):Observable<User>{
        return this.http.get(this.userUrl+'userId?userId='+ id,this.REQUEST_OPTIONS)
            .map((res:Response)=>{
                var data = res.json();
                var arr = data.details.menuBeanList;
                for(var i=0; i<arr.length; i++){
                    var val = arr[i];
                    var mapTxt = util.toCamelCase(val.menuName.toLowerCase(), ' ');
                    val.url = './'+mapTxt;

                }
                let userId = this.storage.getSession('user_data');   
                let userData = Object.assign({
                    du_id:data.details.userBean.du_id,
                    bu_id:data.details.userBean.bu_id,
                    userEmail:data.details.userBean.userEmail
                  },userId,);
                  this.storage.setSession('user_data',userData)
            return data;
        })
    }
    /**
     * Get Timesheet Details
     * @param empId {string} Employee Id
     * @param periodId {number} Timeperiod Id
     */
    public getTimeSheetDetails(empId,periodId):Observable<Timesheet>{
        return this.http.get(this.timeSheetDetail+`?empId=${empId}&periodId=${periodId}`,this.REQUEST_OPTIONS)
                    .map((resp:Response)=>{
                        var data = resp.json();
                      //  if(data.actionStatus){
                            return this.mapTimeSheetData(data,null);
                       // }
                      //  return resp.json();
                    });
    }
    /**
     * Get Charge Code
     * @param empId {string} Employee Id
     */
    public getChargeCodes(empId:string, chargeCodeId:number):Observable<ChargeCode>{
        return this.http.get(`${this.ChargeCodesList}?empId=${empId}&periodId=${chargeCodeId}`,this.REQUEST_OPTIONS)
                    .map((resp: Response)=> resp.json());
    }
    /**
     * Get Time Period
     * @param date {string} Current Full Date exp: 2017-10-31;
     */
    public getTimePeriod( date:string ):Observable<TimePeriod>{
        return this.http.get(`${this.TimePeriod}?lastDate=${date}`,this.REQUEST_OPTIONS)
                    .map((resp:Response)=>resp.json());
    }
    public saveTimeSheet( obj: Timesheet):Observable<any>{
        return this.http.post(this.SaveTimeSheet, obj, this.REQUEST_OPTIONS)
                    .map((resp:Response)=> resp.json());
    }
    public getReviewDetails( empId:string,periodId:number):Observable<ResourceData>{
        return this.http.get(`${this.ReviewDetails}?empId=${empId}&periodId=${periodId}`,this.REQUEST_OPTIONS)
                    .map((resp:Response)=>{ 
                        return resp.json();
                });
    }
    public getTimePeriodDetails( ):Observable<PeriodData>{
        return this.http.get(`${this.PeriodDetails}`,this.REQUEST_OPTIONS)
            .map((resp:Response)=>resp.json());
    }
    public getChargeCodeDetails( du_id:string ):Observable<ChargeCodeDetails>{
        return this.http.get(`${this.Chargecodesdetails}?deliveryUnitId=${du_id}`,this.REQUEST_OPTIONS)
        .map((resp:Response)=>resp.json());
    }
    public getFunctionGroups():Observable<FunctionGroups>{
        return this.http.get(`${this.FunctionGroups}`,this.REQUEST_OPTIONS)
        .map((resp:Response)=>resp.json());
    }
    public getBusinessUnit( functionId: number):Observable<BusinessUnit>{
        return this.http.get(`${this.BusinessUnit}?functionGrpId=${functionId}`,this.REQUEST_OPTIONS)
        .map((resp:Response)=>resp.json());
    }
    public getDeliveryUnit( buId: number):Observable<DeliverUnit>{
        return this.http.get(`${this.DeliveryUnit}?buId=${buId}`,this.REQUEST_OPTIONS)
        .map((resp:Response)=>resp.json());
    }
    public getChargeCodeType():Observable<ChargeCodeType>{
        return this.http.get(`${this.ChargeCodeTypeUrl}`,this.REQUEST_OPTIONS)
        .map((resp:Response)=>resp.json());
    }
    public getSubChargeCodeType():Observable<ChargeCodeType>{
        return this.http.get(`${this.SubChargeCodeTypeUrl}`,this.REQUEST_OPTIONS)
        .map((resp:Response)=>resp.json());
    }
    public getAccountIds(buId:number, duId:number):Observable<ChargeCodeType>{
        return this.http.get(`${this.AccountIdsUrl}?buId=${buId}&duId=${duId}`,this.REQUEST_OPTIONS)
        .map((resp:Response)=>resp.json());
    }
    public saveChargeCode( obj:SaveChargeCode ):Observable<SaveChargeCodeResp>{
        return this.http.post(`${this.SaveChargeCodeUrl}`,obj,this.REQUEST_OPTIONS)
        .map((resp:Response)=>resp.json());
    }
    public getEmployeeDetails( empId:string ):Observable<EmployeeData>{
        return this.http.get(`${this.employeeDetails}?empId=${empId}`,this.REQUEST_OPTIONS)
            .map((resp:Response)=>resp.json());
    }
    public getAllEmployeeDetails():Observable<EmployeeData>{
        return this.http.get(`${this.allEmployeeDetails}`,this.REQUEST_OPTIONS)
            .map((resp:Response)=>resp.json());
    }

    public saveConfigEmployeeDetails( obj: SaveConfigEmployeeData):Observable<any>{
        return this.http.post(this.saveConfigEmployeeDetail, obj, this.REQUEST_OPTIONS)
                .map((resp:Response)=> resp.json());
    }
    public getConfigEmpDetails(empId:string):Observable<ConfigEmployeeData>{
        return this.http.get(`${this.getConfigEmployeeDetails}?empId=${empId}`,this.REQUEST_OPTIONS)
            .map((resp:Response)=>resp.json());
    }
    public getLastLoginData(empId:string):Observable<LastLoginDetails>{
        return this.http.get(`${this.lastLoginDetails}?userId=${empId}`,this.REQUEST_OPTIONS)
            .map((resp:Response)=>resp.json());
    }
    public submitChargeCodeDetails(obj: chargeCodeObject): Observable<any> {
        return this.http.post(this.SubmitChargeCodes, obj, this.REQUEST_OPTIONS)
            .map((resp: Response) => resp.json());
    }
    public assignRoles( obj: Assignroles):Observable<AssignrolesResponse>{
        return this.http.post(this.AssignrolesUrl, obj, this.REQUEST_OPTIONS)
        .map((resp: Response) => resp.json());
    }
    public getRoles():Observable<AssignrolesResponse>{
        return this.http.get(this.RolesUrl, this.REQUEST_OPTIONS)
        .map((resp: Response) => resp.json());
    }
    public getTimeSheetSummaryReport( empId: string):Observable<TimeSheetSummaryReport>{
        return this.http.get(`${this.TimeSheetSummaryReport}?empId=${empId}`, this.REQUEST_OPTIONS)
        .map((resp: Response) => resp.json());
    }
    public getLocations():Observable<Location>{
        return this.http.get(`${this.Locations}`, this.REQUEST_OPTIONS)
        .map((resp: Response) => resp.json());
    }
   
}

