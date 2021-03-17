import React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import NextImage from 'next/image'
import useSWR from 'swr'
import { v4 as uuidV4 } from 'uuid';
import Layout from '../components/layout'
import { Button, Tooltip, Typography, message, Card, List, Avatar, Space, Skeleton, Image, Tag, Empty, Statistic, Row, Col, Tabs, Badge, Spin, PageHeader } from 'antd'
import { PlusOutlined, SendOutlined, StarTwoTone, QuestionCircleOutlined, LikeOutlined, DislikeOutlined, ExperimentOutlined, SoundOutlined, CheckCircleOutlined, SafetyCertificateOutlined, LinkOutlined, ExceptionOutlined, BulbOutlined } from '@ant-design/icons'
import CreateBrightIdeaForm from '../components/createbi'
import Cookies from 'universal-cookie'
const { Title } = Typography
const cookies = new Cookies()
import { EyeOutlined } from '@ant-design/icons';
import FrontLoading from '../components/frontLoading'
import FrontLandingPage from '../components/frontLandingpage'
import FeasibilityTable from '../components/feasbilitytable'
import RiskAssessmentTable from '../components/riskassessmenttable'
import ActionRequestTable from '../components/actionrequesttable'
import ImplementationTable from '../components/implementationtable'
import moment from 'moment'

const { TabPane } = Tabs;

function callback(key) {
  console.log(key);
}

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
  const { data, error, isValidating, mutate } = useSWR( user ? [`http://10.3.10.209:4541/showbrightideaforfaassessor/${token}`, user] : null, fetchWithFaBody)
  return {
    fa: data,
    isFaLoading: !error && !data,
    isFaError: error,
    isFaValidating: isValidating,
    boundFaMutate: mutate
  }
}


const fetchWithRaBody = (url, user) => fetch(url, {
  headers: { 'Content-Type': 'application/json' },
  method: 'POST',
  body: JSON.stringify({
    employee_number: user.employee_number
  })
}).then(r => r.json())
// get user for feasibility assessment data 
function useRaAssessor(token, user){
  const { data, error, mutate } = useSWR( user ? [`http://10.3.10.209:4541/showbrightideaforriskassessor/${token}`, user] : null, fetchWithRaBody)
  return {
    ra: data,
    isRaLoading: !error && !data,
    isRaError: error,
    boundRaMutate: mutate
  }
}


const fetchWithArBody = (url, user) => fetch(url, {
  headers: { 'Content-Type': 'application/json' },
  method: 'POST',
  body: JSON.stringify({
    employee_number: user.employee_number
  })
}).then(r => r.json())
// get user for feasibility assessment data 
function useActionRequest(token, user){
  const { data, error, mutate } = useSWR( user ? [`http://10.3.10.209:4541/showbrightideaforactionowner/${token}`, user] : null, fetchWithArBody)
  return {
    ar: data,
    isArLoading: !error && !data,
    isArError: error,
    boundArMutate: mutate
  }
}


const fetchWithImpBody = (url, user) => fetch(url, {
  headers: { 'Content-Type': 'application/json' },
  method: 'POST',
  body: JSON.stringify({
    employee_number: user.employee_number
  })
}).then(r => r.json())
// get user for feasibility assessment data 
function useImplementation(token, user){
  const { data, error, mutate } = useSWR( user ? [`http://10.3.10.209:4541/showbrightideaforimplementation/${token}`, user] : null, fetchWithImpBody)
  return {
    implementation: data,
    isImplementationLoading: !error && !data,
    isImplementationError: error,
    boundImplementationMutate: mutate
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
  const { fa, isFaLoading, isFaError, isFaValidating, boundFaMutate } = useFaAssessor(token, user)
  const { ra, isRaLoading, isRaError, boundRaMutate } = useRaAssessor(token, user)
  const { ar, isArLoading, isArError, boundArMutate } = useActionRequest(token, user)
  const { implementation, isImplementationLoading, isImplementationError, boundImplementationMutate } = useImplementation(token, user)
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
      boundFaMutate(fa, true)
    }

  };

  const [ submitted, setSubmitted ] = useState([])
  const [ approved, setApproved ] = useState([])
  const [ acknowledged, setAcknowledged ] = useState([])
  const [ implemented, setImplemented ] = useState([])
  const [ rejected, setRejected ] = useState([])

  useEffect(() => {
    if(post){
      if(post.length > 0 ){
        setSubmitted(post.filter(data => data.current === 'submitted'))
        setApproved(post.filter(data => data.current === 'approved'))
        setAcknowledged(post.filter(data => data.current === 'acknowledged'))
        setImplemented(post.filter(data => data.current === 'implemented'))
        setRejected(post.filter(data => data.current === 'rejected'))
      }
    }
  }, [ post ])
  
  if(isError) return <div><FrontLandingPage/></div>
  if(!token) return <div>Please login. <Link href="/login" style={{color:"blue"}}>go to login</Link></div>
  if(!user) return <div><FrontLoading /></div>
  //console.log(post)
  //console.log(user)

  return (
    <Layout name={user.name} employee_number={user.employee_number}>
      <div style={{marginBottom: 16}}>
        <Card>
        <div style={{ display: 'flex'}}>
          <div style={{margin: 10}}>
            <NextImage src="/doge.png" width={150} height={180} />
          </div>
          <div style={{marginTop: 40}}>
            <Typography>
              <Title level={3}>Hi {user.name}! 👋</Title>
            </Typography>
            <Statistic 
              title={<>Score <Tooltip title="Overall score of your implemented Bright Ideas" placement="right">
              <QuestionCircleOutlined /></Tooltip></>} 
              value={0} 
              suffix={<StarTwoTone twoToneColor="#FFD700" />} 
            />
            <Tooltip title="Click here to submit your bright idea." placement="bottomLeft">
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => {
                setOnCreateResponse('')
                setVisible(true);
              }}
              style={{marginTop: 10}}
            >
              Submit a Bright Idea
            </Button>
            </Tooltip>
          </div>
        </div>
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
      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="Recent ideas" key="1">
          <PageHeader style={{paddingTop: 0}}>
            <Row gutter={[16, 16]}>
              <Col span={4}>
                <Statistic 
                  title={<>Total BI <Tooltip title="Number of bright ideas that you have submitted" placement="right">
                  <QuestionCircleOutlined /></Tooltip></>} 
                  value={post ? post.length > 0 ? post.length : 0 : 0}
                  prefix={<BulbOutlined />}
                />
              </Col>
              <Col span={4}>
                <Statistic 
                  title={<>Submitted <Tooltip title="Number of bright ideas for feasibility and risk assessment" placement="right">
                  <QuestionCircleOutlined /></Tooltip></>} 
                  value={submitted ? submitted.length > 0 ? submitted.length : 0 : 0}
                  prefix={<ExperimentOutlined />}
                />
              </Col>
              <Col span={4}>
                <Statistic 
                  title={<>Approved <Tooltip title="Number of bright ideas for action request" placement="right">
                  <QuestionCircleOutlined /></Tooltip></>} 
                  value={approved ? approved.length > 0 ? approved.length : 0 : 0}
                  prefix={<LikeOutlined />}
                />
              </Col>
              <Col span={4}>
                <Statistic 
                  title={<>Acknowledged <Tooltip title="Number of bright ideas for implementation" placement="right">
                  <QuestionCircleOutlined /></Tooltip></>} 
                  value={acknowledged ? acknowledged.length > 0 ? acknowledged.length : 0 : 0}
                  prefix={<LinkOutlined />}
                />
              </Col>
              <Col span={4}>
                <Statistic 
                  title={<>Implemented <Tooltip title="Number of bright ideas that has been implemented" placement="right">
                  <QuestionCircleOutlined /></Tooltip></>} 
                  value={implemented ? implemented.length > 0 ? implemented.length : 0 : 0}
                  prefix={<SafetyCertificateOutlined />}
                />
              </Col>
              <Col span={4}>
                <Statistic 
                  title={<>Rejected <Tooltip title="Number of bright ideas that has been rejected" placement="right">
                  <QuestionCircleOutlined /></Tooltip></>} 
                  value={rejected ? rejected.length > 0 ? rejected.length : 0 : 0}
                  prefix={<ExceptionOutlined />}
                />
              </Col>
            </Row>
          </PageHeader>
          <div>
            {
              post ? (
                post.length > 0 ? (
              <div>
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
              </div>
              ):(
                <Empty/>
              )
              ):(
                <div>
                  <div><Skeleton avatar paragraph={{ rows: 4 }} /></div>
                </div>
              )
            }
          </div>
        </TabPane>
        <TabPane tab={<><Badge count={fa ? fa.length ? fa.length : 0 : 0} offset={[10, 0]}>Feasibility assessment</Badge></>} key="2">
          {
            isFaValidating ? <Spin /> 
            :
            <div>
              <FeasibilityTable fa={fa} user={user} boundFaMutate={boundFaMutate} ra={ra} boundRaMutate={boundRaMutate} ar={ar} boundArMutate={boundArMutate} />
            </div>
          }
        </TabPane>
        <TabPane tab={<><Badge count={ra ? ra.length ? ra.length : 0 : 0} offset={[10, 0]}>Risk assessment</Badge></>} key="3">
          <div>
            <RiskAssessmentTable ra={ra} user={user} boundRaMutate={boundRaMutate} implementation={implementation}  boundImplementationMutate={boundImplementationMutate}  />
          </div>
        </TabPane>
        <TabPane tab={<><Badge count={ar ? ar.length ? ar.length : 0 : 0} offset={[10, 0]}>Action Request</Badge></>} key="4">
          <div>
            <ActionRequestTable ar={ar} user={user} boundArMutate={boundArMutate} implementation={implementation}  boundImplementationMutate={boundImplementationMutate}  />
          </div>
        </TabPane>
        <TabPane tab={<><Badge count={implementation ? implementation.length ? implementation.length : 0 : 0} offset={[10, 0]}>Implementation</Badge></>} key="5">
          <div>
            <ImplementationTable implementation={implementation} user={user} boundImplementationMutate={boundImplementationMutate} />
          </div>
        </TabPane>
      </Tabs>
    </Layout>
  )
}

export default Index