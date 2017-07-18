/**
 * Created by jojo on 2017/7/13.
 */
export const jsonToQueryString=(jsonObject)=>{
  let keys=Object.keys(jsonObject),
    queryString="?";
  keys.forEach(k=>{

    let content=jsonObject[k]

    if(content.constructor===[].constructor){
      content=content.join(",")
    }

    queryString+=`${k}=${content}&`
  });
  return  queryString.substring(0,queryString.length-1);
};


export const getStyle=(element,props)=>{
  return window.getComputedStyle(element,null).getPropertyValue(props);
}
