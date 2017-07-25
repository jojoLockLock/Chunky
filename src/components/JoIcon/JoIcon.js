/**
 * Created by jojo on 2017/7/25.
 */
import classnames from 'classnames'
export default ({type,children,style,className})=>{

  const classNames=classnames({
    [`icon-${type}`]:!!type,
    [className]:!!className
  })
  return <b className={classNames} style={style}>{children}</b>
}
