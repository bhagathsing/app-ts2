export class Ng2Storage{
    private sessionStore:Storage = sessionStorage;
    private localStore: Storage = localStorage;
    
    public setSession(key:string, val:object){
        var value = JSON.stringify(val);
        this.sessionStore.setItem(key,value);
    }

    public getSession( key:string ){
        var obj = JSON.parse(this.sessionStore.getItem(key));
        return obj;
    }
    public removeSession(key:string){
        this.sessionStore.removeItem(key);
    }

    public clearAllSession(){
        this.sessionStore.clear();
    }

    public setLocalStorage(key:string, val:object){
        var value = JSON.stringify(val);
        this.localStore.setItem(key,value);
    }

    public getLocalStorage( key:string ){
        var obj = JSON.parse(this.localStore.getItem(key));
        return obj;
    }
    public removeLocalStorage(key:string){
        this.localStore.removeItem(key);
    }
    public clearAllLocalStorage(){
        this.localStore.clear();
    }
}