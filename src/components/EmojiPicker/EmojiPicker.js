/**
 * Created by jojo on 2017/7/27.
 */
import React,{PropTypes} from 'react';
import styles from './EmojiPicker.css'
import {Popover,Button,Icon} from 'antd';
const emojis= [
  "😀",
  "😃",
  "😄",
  "😁",
  "😆",
  "😅",
  "😂",
  "🤣",
  "😊",
  "😇",
  "🙂",
  "🙃",
  "😉",
  "😌",
  "😍",
  "😘",
  "😗",
  "😙",
  "😚",
  "😋",
  "😜",
  "😝",
  "😛",
  "🤑",
  "🤗",
  "🤓",
  "😎",
  "🤡",
  "🤠",
  "😏",
  "😒",
  "😞",
  "😔",
  "😟",
  "😕",
  "🙁",
  // "☹",
  "😣",
  "😖",
  "😫",
  "😩",
  "😤",
  "😠",
  "😡",
  "😶",
  "😐",
  "😑",
  "😯",
  "😦",
  "😧",
  "😮",
  "😲",
  "😵",
  "😳",
  "😱",
  "😨",
  "😰",
  "😢",
  "😥",
  "🤤",
  "😭",
  "😓",
  "😪",
  "😴",
  "🙄",
  "🤔",
  "🤥",
  "😬",
  "🤐",
  "🤢",
  "🤧",
  "😷",
  "🤒",
  "🤕",
  "😈",
  "👿",
  "👹",
  "👺",
  "💩",
  "👻",
  "💀",
  // "☠",
  "👽",
  "👾",
  "🤖",
  "🎃",
  "😺",
  "😸",
  "😹",
  "😻",
  "😼",
  "😽",
  "🙀",
  "😿",
  "😾",
  "👐",
  "🙌",
  "👏",
  "🙏",
  "🤝",
  "👍",
  "👎",
  "👊",
  "✊",
  "🤛",
  "🤜",
  "🤞",
  "✌",
  "🤘",
  "👌",
  "👈",
  "👉",
  "👆",
  "👇",
  "☝",
  "✋",
  "🤚",
  "🖐",
  "🖖",
  "👋",
  "🤙",
  "💪",
  "🖕",
  "✍",
  "🤳",
  "💅",
  "🖖",
  "💄",
  "💋",
  "👄",
  "👅",
  "👂",
  "👃",
  "👣",
  "👁",
  "👀",
  "🗣",
  "👤",
  "👥",
  "👶",
  "👦",
  "👧",
  "👨",
  "👩",
  "👱‍",
  "👱",
  "👴",
  "👵",
  "👲",
  "👳‍",
  "👳",
  "👮‍",
  "👷‍",
  "💂‍",
  "🕵",
  "👩‍",
  "👨‍",
  "👚",
  "👕",
  "👖",
  "👔",
  "👗",
  "👙",
  "👘",
  "👠",
  "👡",
  "👢",
  "👞",
  "👟",
  "👒",
  "🎩",
  "🎓",
  "👑",
  "⛑",
  "🎒",
  "👝",
  "👛",
  "👜",
  "💼",
  "👓",
  "🕶",
  "🌂",
  "☂"
]

class EmojiPicker extends React.Component{
  constructor(props) {
    super(props);
  }
  onClick=(e)=>{
    let {target}=e;
    if(target.tagName==="TD"){
      this.props.onClick&&this.props.onClick(target.innerText);
    }
  }
  componentDidMount=()=>{
    $(this.target).niceScroll({cursorborder:"",cursorcolor:"#cccccc",boxzoom:false});
  }
  render() {
    const rows=[];
    const count=8;
    emojis.forEach((e,index)=>{
      let row=rows[parseInt(index/count)]||[];
      row.push(<td key={`${index}-emoji-cell`}>{e}</td>)

      rows[parseInt(index/count)]=row;

    })



    return <div className={styles["emoji-picker-wrap"]}
                ref={target=>{
                  this.target=target;
                  this.props.ref&&this.props.ref(target)
                }}>
      <table onClick={this.onClick}>
        <tbody>
        {rows.map((r,index)=>{
          return <tr key={`${index}-emoji-row`}>
            {r}
          </tr>
        })}
        </tbody>
      </table>
    </div>
  }
}



export default class extends React.Component{
  static PropTypes={
    onChange:PropTypes.func,
    onClick:PropTypes.func,
    visible:PropTypes.bool
  }
  constructor(props) {
    super(props);
    this.state={
      visible:props.visible||false,
    }
  }
  onClick=()=>{
    let newValue=!this.state.visible;

    if("visible" in this.props){

      this.props.onChange&&this.props.onChange(newValue)

    }else{

      this.setState({
        visible:newValue
      })
    }
  }
  componentWillReceiveProps=(newProps)=>{
    if("visible" in newProps){
      this.setState({
        visible:newProps.visible,
      })
    }
  }
  render() {
    const {onClick}=this.props;
    return (
      <Popover content={<EmojiPicker onClick={onClick}/>}
               title=""
               visible={this.state.visible}
               placement="top"
               trigger={"click"}>
        <a className={styles["emoji-picker-icon"]}
           onClick={this.onClick}>
          <Icon type="smile-o"/>
        </a>
      </Popover>
    )
  }
}
