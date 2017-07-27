/**
 * Created by jojo on 2017/7/27.
 */
import React from 'react';
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
      console.info(target.innerText);
    }
  }
  componentDidMount=()=>{
    console.info(this.target);
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
                ref={target=>this.target=target}>
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


export default ({onClick,visible})=>{
  return (
    <Popover content={<EmojiPicker onClick={onClick}/>}
             title=""
             visible={true}
             placement="top"
             trigger={"click"}>
      <a className={styles["emoji-picker-icon"]}>
        <Icon type="smile-o"/>
      </a>
    </Popover>
  )
}
