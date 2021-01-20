import { Typography } from 'antd'
const { Title, Text } = Typography
import { BulbTwoTone } from '@ant-design/icons'
const FrontLoad = () => {
  return (
    <div>
      <div className="loading">  
      <Typography>
        <Title strong style={{color: '#333'}}>Project Br<BulbTwoTone twoToneColor="#f9d71c" />ght</Title>
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