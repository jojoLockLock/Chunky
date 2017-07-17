/**
 * Created by jojo on 2017/7/13.
 */
export const jsonToQueryString=(jsonObject)=>{
  let keys=Object.keys(jsonObject),
    queryString="?";
  keys.forEach(k=>{
    queryString+=`${k}=${jsonObject[k]}&`
  });
  return  queryString.substring(0,queryString.length-1);
};


export const getStyle=(element,props)=>{
  return window.getComputedStyle(element,null).getPropertyValue(props);
}
