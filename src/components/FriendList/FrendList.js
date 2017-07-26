/**
 * Created by jojo on 2017/7/14.
 */
import React,{PropTypes} from 'react';
import styles from './FrendList.css';
import classnames from 'classnames';
import {Badge} from 'antd';
class FriensList extends React.Component{
  static propTypes={
    data:PropTypes.array,
    activeKey:PropTypes.string,
    onChange:PropTypes.func,
  }
  static defaultProps={
    data:[],
  }
  constructor(props){
    super(props);
    this.state={
      activeKey:props.activeKey||"",
    }
  }
  componentDidMount=()=>{
    $(this.target).niceScroll({cursorborder:"",cursorcolor:"#cccccc",boxzoom:false})
  }
  componentWillReceiveProps=(newProps)=>{
    this.setState({
      activeKey:newProps.activeKey||""
    })
  }
  getOnChange=(key)=>{
    return ()=>{
      if("activeKey" in this.props){

      }else{
        this.setState({
          activeKey:key,
        })
      }
      this.props.onChange&&this.props.onChange(key);
    }
  }
  render() {
    const {data}=this.props;
    const {activeKey}=this.state;
    return (
      <div className={styles["friend-list-wrap"]} ref={target=>this.target=target}>
        <ul className={styles["friend-list"]}>

          {data.map(i=><FriendItem title={i.title}
                                   isActive={i.key===this.state.activeKey}
                                   key={i.key}
                                   count={i.count}
                                   time={i.time}
                                   onClick={this.getOnChange(i.key)}
                                   subtext={i.subtext}
                                   icon={i.icon}/>)}
        </ul>
      </div>
    )
  }
}

const FriendItem=({title,subtext,icon,time,isActive,count,onClick})=>{

  const classes=classnames({
    [styles["friend-list-item"]]:true,
    // [styles["friend-list-item-active"]]:isActive
  })

  const offsetLeft=count<10?"50px":"45px";

  return (
    <li className={classes} onClick={onClick}>
      {/*<a style={{position:"absolute",top:-20,left:offsetLeft,transtion:"left 0.5s"}}>*/}
        {/**/}
      {/*</a>*/}
        <a className={styles["icon"]}>
          <img src={icon} draggable={false}/>
        </a>

      <div className={styles["body"]}>
        <span className={styles["title"]}>{title}</span>
        <span className={styles["subtext"]}>{subtext}</span>
      </div>

      <div className={styles["addtion"]}>
        <span className={styles["time"]}>{time}</span>
        <span className={styles["count"]}><Badge count={count}/></span>
      </div>
    </li>
  )
}


FriendItem.propTypes={
  title:PropTypes.string,
  subText:PropTypes.string,
  icon:PropTypes.string,
  time:PropTypes.string,
  isActive:PropTypes.bool,
  count:PropTypes.number,
}
export default FriensList;
