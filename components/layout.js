import { Layout, Menu, Button, Typography, Avatar, BackTop } from 'antd'
import { AuditOutlined, HomeOutlined, ExceptionOutlined, InteractionOutlined, FileSearchOutlined, SearchOutlined, LogoutOutlined, GlobalOutlined, BulbTwoTone, NotificationOutlined, ExperimentOutlined, LikeOutlined, ApartmentOutlined } from '@ant-design/icons'
import Cookies from 'universal-cookie'
import NextImage from 'next/image'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
const cookies = new Cookies()
const { Title, Text } = Typography

const { Header, Content, Footer, Sider } = Layout

const LayoutComponent = (props) => {
  const router = useRouter()
  //console.log(router.pathname)

  const [ selectedKey, setSelectedKey ] = useState(
    router.pathname === '/' ? '1'
    /*
    : router.pathname === '/feasibility' ? '2'
    : router.pathname === '/riskassessment' ? '3'  
    : router.pathname === '/actionrequest' ? '4' 
    : router.pathname === '/implementation' ? '5' 
    */
    : router.pathname === '/summary' ? '2' 
    : ''
  )

  const onHome = () => {
    router.push('/')
    setSelectedKey('1')
  }/*
  const onFeasibility = () => {
    router.push('/feasibility')
    setSelectedKey('2')
  }
  const onRisk = () => {
    router.push('/riskassessment')
    setSelectedKey('3')
  }
  const onActionRequest = () => {
    router.push('/actionrequest')
    setSelectedKey('4')
  }
  const onImplementation = () => {
    router.push('/implementation')
    setSelectedKey('5')
  }
  */
  const onSummary = () => {
    router.push('/summary')
    setSelectedKey('2')
  }

  const onLogout = () => {
    cookies.remove()
    router.push('/login')
  }


  return (
    <div>
    <Head>
      <title>Project Br!ght</title>
    </Head>
    <BackTop  />
    <Layout>
      <Sider
        /*
        theme="dark"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
        }}
        */
        theme="dark"
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={broken => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="logo" onClick={onHome}>
          <Typography>
            <Title level={4} strong style={{color: '#ffffffd9'}}>Project Br<BulbTwoTone twoToneColor="#f9d71c" />ght</Title>
          </Typography>
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={[selectedKey]}>
          <Menu.Item key="1" onClick={onHome} icon={<HomeOutlined />}>
            Home
          </Menu.Item>
          <Menu.Item key="2" onClick={onSummary} icon={<FileSearchOutlined />}>
            Summary
          </Menu.Item>
          {/*
          <Menu.Item key="6" icon={<SearchOutlined />} >
            Search
          </Menu.Item>
          */}
        </Menu>
      </Sider>
      <Layout>
        <Header className="site-layout-sub-header-background" style={{ padding: 0, background: '#ffff' }} >
          <div style={{display: '-webkit-inline-box', float: 'right', marginRight: 20}}>
            {
              props.name === 'Public' ? (
                <div>
                  <GlobalOutlined/> <Text>Public</Text>
                </div>
              ):(
              <>
              
                <Avatar 
                  src={`http://10.3.10.209:4000/codecs-img/${props.employee_number}.png`}
                  size="small"
                  style={{marginRight: 8}}
                />
                {/*
                <Avatar 
                  size="small"
                  style={{
                    color: '#fff',
                    background: 'linear-gradient(to top, #ff9933 0%, #ffff00 100%)',
                    marginRight: 8
                  }} 
                >
                {props.name.split(/\s/).reduce((response,word)=> response+=word.slice(0,1),'')}
                </Avatar>
                */}
                <p>{props.name}</p>
                <Button icon={<LogoutOutlined />} type="link"  onClick={onLogout} >Logout</Button>
              </>
              )
            }
          </div>
        </Header>
        <Content style={{ margin: '0 0 0' }}>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 650, backgroundColor: '#fff' }}>
            {props.children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Project Br<BulbTwoTone twoToneColor="#f9d71c" />ght by m@s Team</Footer>
      </Layout>
    </Layout>
    <style jsx>{`
      .logo {
        height: 32px;
        margin: 16px;
        cursor: pointer;
      }
    `}</style>
    </div>
  )
}

export default LayoutComponent