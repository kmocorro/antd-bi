import React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { v4 as uuidV4 } from 'uuid';
import Layout from '../components/layout'
import { Button, Tooltip, Typography, message, Card, List, Avatar, Space, Skeleton, Image, Tag, Empty, Statistic, Row, Col } from 'antd'
import { PlusOutlined, SendOutlined, StarTwoTone, QuestionCircleOutlined } from '@ant-design/icons'
import CreateBrightIdeaForm from '../components/createbi'
import Cookies from 'universal-cookie'
const { Title } = Typography
const cookies = new Cookies()
import { EyeOutlined } from '@ant-design/icons';
import FrontLoading from '../components/frontLoading'
import FrontLandingPage from '../components/frontLandingpage'
import moment from 'moment'

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// get user data
const fetcher = url => fetch(url).then(r => r.json())
function useUser(token){
  if(!token){
    return {
      user: '',
      isLoading: false,
      isError: 'No token'
    }
  }
  const { data, error } = useSWR(`http://10.3.10.209:4541/getuserprofile/${token}`, fetcher)
  
  return {
    user: data,
    isLoading: !error && !data,
    isError: error
  }
}

// get user bright idea data
const fetchWithPostBody = (url, user) => fetch(url, {
  headers: { 'Content-Type': 'application/json' },
  method: 'POST',
  body: JSON.stringify({
    employee_number: user.employee_number
  })
}).then(r => r.json())
function usePost(token, user) {
  const { data, error, mutate } = useSWR( user ? [`http://10.3.10.209:4541/showbrightideacreatedbyuser/${token}`, user] : null, fetchWithPostBody)
  return {
    post: data,
    isPostLoading: !error && !data,
    isPostError: error,
    boundPostMutate: mutate
  }
}


const fetchWithFaBody = (url, user) => fetch(url, {
  headers: { 'Content-Type': 'application/json' },
  method: 'POST',
  body: JSON.stringify({
    employee_number: user.employee_number
  })
}).then(r => r.json())
// get user for feasibility assessment data 
function useFaAssessor(token, user){
  const { data, error, mutate } = useSWR( user ? [`http://10.3.10.209:4541/showbrightideaforfaassessor/${token}`, user] : null, fetchWithFaBody)
  return {
    fa: data,
    isFaLoading: !error && !data,
    isFaError: error,
    boundMutate: mutate
  }
}


// get all users bright idea data based on DEFINED year and weeks
const fetchWithAllPost = (url) => fetch(url, {
  headers: { 'Content-Type': 'application/json' },
  method: 'POST',
  body: JSON.stringify({
    fromweek: `2020-W1`,
    toweek: `2030-W53`,
    searchparam: 'ALL',
    button: 'ALL'
  })
}).then(r => r.json())
function usePostAll(){
  const { data, error, mutate } = useSWR(`http://10.3.10.209:4541/search`, fetchWithAllPost)
  //console.log(data)
  return {
    postAll: data,
    isPostAllLoading: !error && !data,
    istPostAllError: error,
    boundPostAllMutate: mutate
  }
}

const Index = () => {

  const token = cookies.get('token')
  const [ onCreateResponse, setOnCreateResponse ] = useState('')
  const { user, isLoading, isError } = useUser(token)
  const { fa, isFaLoading, isFaError, boundMutate } = useFaAssessor(token, user)
  const { post, isPostLoading, isPostError, boundPostMutate } = usePost(token, user)
  const { postAll, isPostAllLoading, isPostAllError, boundPostAllMutate } = usePostAll()
  const [visible, setVisible] = useState(false)

  if(onCreateResponse === 'success'){
    message.success('Bright idea successfully created!');
    setOnCreateResponse('')
    boundPostMutate()
  } else if (onCreateResponse === 'failed'){
    message.error('Error while saving BI. Try again.');
    setOnCreateResponse('')
    boundPostMutate()
  }

  const onCreate = async (values) => {
    //console.log('Received values of form: ', values);
    setVisible(false);

    let image2upload = [{
      blob: (values.before_imageArray[0].thumbUrl).replace(/^data:image\/.*;base64,/, ""),
      path: (values.before_imageArray[0].name)
    }]

    let body_fields = JSON.stringify({
      uuid: uuidV4(),
      title: values.title,
      creator: user.employee_number,
      sps_team: user.sps_team,
      shift: user.shift,
      current_practice: values.current_practice,
      proposal: values.proposal,
      benefactor: values.benefactor,
      initial_impact: values.initial_impact,
      before_imageArray: image2upload
    })
    
    let response = await fetch('http://10.3.10.209:4541/submit', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: body_fields
    })
    
    if(response.status === 200){
      setOnCreateResponse(await response.json())
    }

  };
  
  if(isError) return <div><FrontLandingPage/></div>
  if(!token) return <div>Please login. <Link href="/login" style={{color:"blue"}}>go to login</Link></div>
  if(!user) return <div><FrontLoading /></div>
  //console.log(post)
  //console.log(user)
  return (
    <Layout name={user.name} employee_number={user.employee_number}>
      <div style={{marginBottom: 16}}>
        <Card>
        <Typography>
          <Title level={3}>Hi {user.name}! 👋</Title>
        </Typography>
        <Row gutter={[16, 24]}>
          <Col span={4}>
            <Statistic title={<>Score <Tooltip title="Overall score of your implemented Bright Ideas" placement="right"><QuestionCircleOutlined /></Tooltip></>} value={0} suffix={<StarTwoTone twoToneColor="#FFD700" />} />
          </Col>
        </Row>
        <Tooltip title="Click here to submit your bright idea." placement="bottomLeft">
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => {
            setOnCreateResponse('')
            setVisible(true);
          }}
        >
          Submit a Bright Idea
        </Button>
        </Tooltip>
        </Card>
        <CreateBrightIdeaForm
          visible={visible}
          onCreate={onCreate}
          onCancel={() => {
            setOnCreateResponse('')
            setVisible(false);
          }}
        />
      </div>
      <div style={{marginTop: 20}}>
        {
          post ? (
            post.length > 0 ? (
          <Card>
          <Title level={4}>Recent Ideas</Title>
          <List
            itemLayout="vertical"
            pagination={{
              onChange: page => {
               // console.log(page);
              },
              pageSize: 5,
            }}
            dataSource={post}
            footer={''
            }
            renderItem={item => (
              <List.Item
                key={item.uuid}
                actions={[
                  <a href={`http://meswebspf409.sunpowercorp.com:3004/v/${item.uuid}`}  target="_blank">See more</a>,
                ]}
                extra={
                  <Image
                    width={272}
                    src={`http://10.3.10.209:4541/images/${item.before_image}`}
                  />
                }
              >
                <List.Item.Meta
                  avatar={
                    <Avatar 
                      src={`http://10.3.10.209:4000/codecs-img/${user.employee_number}.png`}
                    />
                  }
                  title={
                    <>
                    <a href={`http://meswebspf409.sunpowercorp.com:3004/v/${item.uuid}`}  target="_blank">
                      {`${item.title}`}
                      
                    </a>{` `}
                    {item.current === 'rejected' ? <Tag color="red" style={{marginLeft: 12}}>{item.current}</Tag> : <Tag color="green"  style={{marginLeft: 12}}>{item.current}</Tag>}
                    </>
                  }
                  description={`${moment(item.status_date).format('llll')}`}
                />
                {item.proposal}
              </List.Item>
            )}
          />
          </Card>
          ):(
            <Empty/>
          )
          ):(
            <Card
              title={
                <Typography>
                  <Title level={4}>Recent Ideas</Title>
                </Typography>
              }
            >
            <div><Skeleton avatar paragraph={{ rows: 4 }} /></div>
            </Card>
          )
        }
      </div>
    </Layout>
  )
}

export default Index