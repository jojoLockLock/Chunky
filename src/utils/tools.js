/**
 * Created by Administrator on 2017/2/16.
 */
//将一个对象进行浅复制，并可以添加或修改属性
export const clone=(target,value)=>{
    return Object.assign({},target,value);
};
//
const add=(target,value)=>{
    return [...target,value]
};
const replace=(target,value,index)=>{
    return [...target.slice(0,index),value,...target.slice(index+1)]
};
const del=(target,index)=>{
    return [...target.slice(0,index),...target.slice(index+1)];
};
//纯函数 （无副作用）
export const pureFunction={
    add,
    replace,
    del,
    clone
};
//永久缓存 关闭会话保存 清除浏览器缓存后会被清除
export const setCache=(name,object)=>{
    if(arguments.length<2){
        return false;
    }
    localStorage.setItem(name,JSON.stringify(object));
    return true;
};
export const getCache=(name)=>{
    return JSON.parse(localStorage.getItem(name));
};
//临时缓存 关闭会话清除
export const setTemp=(name,object)=>{
    if(arguments.length<2){
        return false;
    }
    sessionStorage.setItem(name,JSON.stringify(object));
    return true;
};
export const getTemp=(name)=>{
    return JSON.parse(sessionStorage.getItem(name));
};


//..........获得页面大小...
export const getPageSize=()=>{
    const width=document.documentElement.clientWidth;
    const pageSize={
        xs:false,
        sm:false,
        md:false,
        lg:false
    };
    switch (true){
        case width<768:
            pageSize.xs=true;
            break;
        case width>=768&&width<992:
            pageSize.sm=true;
            break;
        case width>=992&&width<1200:
            pageSize.md=true;
            break;
        case width>=1200:
            pageSize.lg=true;
            break;
        default:
            break;

    }
    return pageSize;
};
//注意之箭头函数的arguments和this都是指向创建的对象的
const getMouseMoveDirection=function(pageX,pageY,conDom){
    if(arguments.length!=3){
        return;
    }
    let width=conDom.offsetWidth,
        height=conDom.offsetHeight,
        left=conDom.offsetLeft,
        top=conDom.offsetTop,
        x=(pageX - left - (width / 2)) * (width > height? (height / width) : 1),
        y=(pageY - top - (height / 2)) * (height > width ? (width / height) : 1);

    return Math.round((((Math.atan2(y, x) * (180 / Math.PI)) + 180) / 90) + 3) % 4;
    //direction的值为“0,1,2,3”分别对应着“上，右，下，左”
};


export function getTimeString(time) {
  let dt=new Date(time);
  return (`${dt.getFullYear()}-${dt.getMonth()+1}-${dt.getDate()} ${dt.getHours()}:${dt.getMinutes()}`);

}
