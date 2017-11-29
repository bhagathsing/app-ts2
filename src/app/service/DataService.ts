import { Observable } from 'rxjs/Observable';
import { 
    User, ILogin, 
    Timesheet, 
    ChargeCode , 
    TimePeriod,SaveConfigEmployeeData,
    ResourceData,EmployeeData,
    PeriodData,ConfigEmployeeData,Assignroles,
    ChargeCodeDetails,AssignrolesResponse,
    FunctionGroups, BusinessUnit, Roles,
    DeliverUnit, ChargeCodeType,LastLoginDetails,
    SaveChargeCode,SaveChargeCodeResp,chargeCodeObject,
    Location,
    TimeSheetSummaryReport} from '../app.interface';
export abstract class DataService {
    public abstract loginUser( obj: ILogin): Observable<any>;
    public abstract getUser(id: string):Observable<User>;
    public abstract getTimeSheetDetails( empId: string,periodId:number):Observable<Timesheet>;
    public abstract getChargeCodes( empId: string, chargeCodeId:number):Observable<ChargeCode>;
    public abstract getTimePeriod( date:string):Observable<TimePeriod>;
    public abstract saveTimeSheet( obj:Timesheet):Observable<any>;
    public abstract getReviewDetails( empId: string,periodId:number):Observable<ResourceData>;
    public abstract getTimePeriodDetails():Observable<PeriodData>;
    public abstract generateEmptyGrid( len:number);
    
    public abstract getEmployeeDetails(empId: string): Observable<EmployeeData>;
    public abstract getConfigEmpDetails(empId: string): Observable<ConfigEmployeeData>;
    public abstract saveConfigEmployeeDetails(obj: SaveConfigEmployeeData): Observable<any>;

    public abstract getChargeCodeDetails( empId:string ):Observable<ChargeCodeDetails>;
    public abstract getFunctionGroups():Observable<FunctionGroups>;
    public abstract getBusinessUnit( functionId: number):Observable<BusinessUnit>;
    public abstract getDeliveryUnit( buId: number):Observable<DeliverUnit>;
    public abstract getChargeCodeType():Observable<ChargeCodeType>;
    public abstract getSubChargeCodeType():Observable<ChargeCodeType>;
    public abstract getAccountIds(buId:number ,duId:number):Observable<ChargeCodeType>;
    public abstract saveChargeCode(obj:SaveChargeCode):Observable<SaveChargeCodeResp>;
    public abstract getLastLoginData(empId: string): Observable<LastLoginDetails>;
    public abstract submitChargeCodeDetails( obj:chargeCodeObject):Observable<any>;
    public abstract assignRoles( obj:Assignroles):Observable<AssignrolesResponse>;
    public abstract getAllEmployeeDetails(): Observable<EmployeeData>;
    public abstract getRoles():Observable<Roles>;
    public abstract getTimeSheetSummaryReport( empId: string):Observable<TimeSheetSummaryReport>;
    public abstract getLocations():Observable<Location>;
    public abstract UserData:any;
}