/**
 * Created by jojo on 2017/7/14.
 */
import React from 'react';
import styles from './FrendList.css';
import classnames from 'classnames';
import {Badge} from 'antd';
class FriensList extends React.Component{
  constructor(props){
    super(props);
    this.state={
      count:0
    }
    setInterval(()=>{
      this.setState({
        count:this.state.count+1,
      })
    },500)
  }

  render() {
    return (
      <div className={styles["friend-list-wrap"]}>
        <ul className={styles["friend-list"]}>
          <FriendItem title={"BboyJojoBboyJojoBboyJojoBboyJojoBboyJojoBboyJojoBboyJojoBboyJojo"}
                      subtext={"BboyJojoBboyJojoBboyJojoBboyJojoBboyJojoBboyJojoBboyJojoBboyJojo"}
                      icon="http://img3.imgtn.bdimg.com/it/u=2677600274,390916543&fm=26&gp=0.jpg"
                      time="17:50"/>
          <FriendItem title={"BboyJojoBboyJojoBboyJojoBboyJojoBboyJojoBboyJojoBboyJojoBboyJojo"}
                      isActive={true}
                      count={this.state.count}
                      subtext={"BboyJojoBboyJojoBboyJojoBboyJojoBboyJojoBboyJojoBboyJojoBboyJojo"}
                      icon="http://img3.imgtn.bdimg.com/it/u=2677600274,390916543&fm=26&gp=0.jpg"
                      time="17:50"/>
        </ul>
      </div>
    )
  }
}

const FriendItem=({title,subtext,icon,time,isActive,count})=>{

  const classes=classnames({
    [styles["friend-list-item"]]:true,
    [styles["friend-list-item-active"]]:isActive
  })

  const offsetLeft=count<10?"55px":"48px";

  return (
    <li className={classes}>
      <a style={{position:"absolute",top:-30,left:offsetLeft,transtion:"left 0.5s"}}>
        <Badge count={count} />
      </a>
        <a className={styles["icon"]}>
          <img src={icon} />
        </a>

      <div className={styles["body"]}>
        <span className={styles["title"]}>{title}</span>
        <span className={styles["subtext"]}>{subtext}</span>
      </div>

      <div className={styles["addtion"]}>
        <span className={styles["time"]}>{time}</span>
        <span></span>
      </div>
    </li>
  )
}

export default FriensList;
