import React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { v4 as uuidV4 } from 'uuid';
import Layout from '../components/layout'
import { Button, Tooltip, Typography, message, Card, List, Avatar,Space } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import CreateBrightIdeaForm from '../components/createbi'
import Cookies from 'universal-cookie'
const { Title } = Typography
const cookies = new Cookies()
import { EyeOutlined } from '@ant-design/icons';

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

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
  const { data, error } = useSWR(`http://10.3.10.209:4546/getuserprofile/${token}`, fetcher)
  
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
  const { data, error, mutate } = useSWR( user ? [`http://10.3.10.209:4546/showbrightideacreatedbyuser/${token}`, user] : null, fetchWithPostBody)
  return {
    post: data,
    isPostLoading: !error && !data,
    isPostError: error,
    boundPostMutate: mutate
  }
}


const Index = () => {

  const token = cookies.get('token')
  const [ onCreateResponse, setOnCreateResponse ] = useState('')
  const { user, isLoading, isError } = useUser(token);
  const { post, isPostLoading, isPostError, boundPostMutate } = usePost(token, user)
  const [visible, setVisible] = useState(false);
  console.log(post)

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
    
    let response = await fetch('http://10.3.10.209:4546/submit', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: body_fields
    })
    
    if(response.status === 200){
      setOnCreateResponse(await response.json())
    }

  };
  
  if(isError) return <div>failed to load. {isError} <Link href="/login" style={{color:"blue"}}>go to login</Link></div>
  if(!token) return <div>Please login. <Link href="/login" style={{color:"blue"}}>go to login</Link></div>
  if(!user) return <div>Loading...</div>

  return (
    <Layout name={user.name}>
      <div style={{marginBottom: 28}}>
        <Typography>
          <Title>Hi.</Title>
        </Typography>
        <Tooltip title="Click here to submit your bright idea." placement="bottomLeft">
        <Button 
          type="dashed" 
          icon={<PlusOutlined />} 
          size="large" 
          onClick={() => {
            setOnCreateResponse('')
            setVisible(true);
          }}
        >
          What's your Bright Idea?
        </Button>
        </Tooltip>
        <CreateBrightIdeaForm
          visible={visible}
          onCreate={onCreate}
          onCancel={() => {
            setOnCreateResponse('')
            setVisible(false);
          }}
        />
      </div>
      <div>
        {
          post ? (
          <List
            itemLayout="vertical"
            size="large"
            pagination={{
              onChange: page => {
                console.log(page);
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
                  <a href={`http://meswebspf409.sunpowercorp.com:3004/v/${item.uuid}`}  target="_blank"><IconText icon={EyeOutlined} text="View Bright Idea" key="list-vertical-edit-o" /></a>,
                ]}
                extra={
                  <img
                    width={272}
                    alt="logo"
                    src={`http://10.3.10.209:4546/images/${item.before_image}`}
                  />
                }
              >
                <List.Item.Meta
                  avatar={<Avatar src={`http://10.3.10.209:4000/codecs-img/${user.employee_number}.png`} />}
                  title={<a href={`http://meswebspf409.sunpowercorp.com:3004/v/${item.uuid}`}  target="_blank">{`${item.bi_id} / ${item.title}`}</a>}
                  description={`${item.current} / ${new Date(item.status_date)}`}
                />
                {item.proposal}
              </List.Item>
            )}
          />
      ):(
        <div>loading...</div>
      )
    }
      </div>
    </Layout>
  )
}

export default Index