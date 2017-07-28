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
    $(this.target).parent()[0].style.padding="0";


    if(this.props.closable){
      window.document.body.addEventListener("click",(e)=>{
        let isInclude=!!e.target.querySelector(`.${styles["emoji-picker-cell"]}`);
        isInclude=isInclude||e.target.className===`${styles["emoji-picker-cell"]}`;
        isInclude&&this.props.close();
      })
    }


  }

  render() {
    const rows=[];
    const count=8;
    emojis.forEach((e,index)=>{
      let row=rows[parseInt(index/count)]||[];
      row.push(<td key={`${index}-emoji-cell`}
                   className={styles["emoji-picker-cell"]}>
        {e}</td>)

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
  static defaultProps={
    placement:"topLeft",
    closable:true,
  }
  static PropTypes={
    onChange:PropTypes.func,
    onClick:PropTypes.func,
    closable:PropTypes.bool,
    placement:PropTypes.string,
  }
  constructor(props) {
    super(props);
    this.state={
    }
  }
  close=()=>{
    this.setState({
      visible:false,
    })
    setTimeout(()=>{
      this.setState({
        visible:null,
      })
    })
  }

  render() {
    const {onClick,closable,placement,style,className}=this.props;
    const content=<EmojiPicker onClick={onClick}
                               close={this.close}
                               closable={closable}/>

    const popProps=this.state.visible===false?{visible:false}:{}


    return (
      <Popover content={content}
               title=""
               {...popProps}
               placement={placement}
               trigger={"click"}>
        <a onClick={this.onClick} style={style} className={className}>
          <Icon type="smile-o"/>
        </a>
      </Popover>
    )
  }
}
