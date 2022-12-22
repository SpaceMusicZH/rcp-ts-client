export class Cookie
{
    static setCookie(cName: string, cValue: string, expDays?: number, hostname?: string)
    {
        let expires = "";
    
        if (expDays !== undefined)
        {
            let date = new Date();            
            date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
            expires = "expires=" + date.toUTCString();
        }
    
        if (hostname !== undefined)
        {
            document.cookie = cName + "=" + cValue + "; " + expires + "; domain=" + hostname + "; path=/";
        }
        else
        {
            
            document.cookie = cName + "=" + cValue + "; " + expires + "; domain=" + window.location.hostname + "; path=/";
        }
    }
    
    static getCookie(cName: string)
    {
        const name = cName + "=";
        const cDecoded = decodeURIComponent(document.cookie); //to be careful
        const cArr = cDecoded .split('; ');
        let res;
        cArr.forEach(val => {
            if (val.indexOf(name) === 0) res = val.substring(name.length);
        })
        return res;
    }
    
    static deleteCookie(name: string)
    {
        if (name !== undefined && name !== "")
        {        
            document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=" + window.location.hostname + "; path=/";
        }
    }
}