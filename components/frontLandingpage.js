import { Typography } from 'antd'
import Link from 'next/link'
const { Title, Text } = Typography
import { BulbTwoTone } from '@ant-design/icons'
const FrontLoad = () => {
  return (
    <div>
      <div className="loading">  
      <Typography>
        <Title strong style={{color: '#333'}}>Project Br<BulbTwoTone twoToneColor="#333" />ght</Title>
        <Link href="/login" style={{color:"blue"}}>Go to login</Link>
      </Typography>
      </div>
      <style jsx>{`
        .loading {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      `}</style>
    </div>
  )
}

export default FrontLoad