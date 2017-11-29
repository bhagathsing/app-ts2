export function generateToken(range:number) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < range; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  
}
export function toCamelCase( str: string, symbol){
  return str.replace(/([\s\-][a-z])/g, function($1){return $1.toUpperCase().replace(symbol,'');});
}
