import { Layout, Menu, Button, Typography, Avatar } from 'antd'
import { AuditOutlined, HomeOutlined, ExceptionOutlined, CrownOutlined, DatabaseOutlined, SearchOutlined, LogoutOutlined, GlobalOutlined, BulbTwoTone } from '@ant-design/icons'
import Cookies from 'universal-cookie'
import { useRouter } from 'next/router'
import { useState } from 'react'
const cookies = new Cookies()
const { Title, Text } = Typography

const { Header, Content, Footer, Sider } = Layout

const LayoutComponent = (props) => {
  const router = useRouter()
  console.log(router.pathname)

  const [ selectedKey, setSelectedKey ] = useState(
    router.pathname === '/' ? '1'
    : router.pathname === '/feasibility' ? '2'
    : router.pathname === '/risk' ? '3'  
    : router.pathname === '/action' ? '4' 
    : router.pathname === '/summary' ? '5' 
    : router.pathname === '/search' ? '6' 
    : ''
  )

  const onHome = () => {
    router.push('/')
    setSelectedKey('1')
  }
  const onFeasibility = () => {
    router.push('/feasibility')
    setSelectedKey('2')
  }

  const onLogout = () => {
    cookies.remove()
    router.push('/login')
  }

  const onSummary = () => {
    router.push('/summary')
    setSelectedKey('5')
  }

  return (
    <div>
    <Layout>
      <Sider
        theme="light"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
        }}
        /*
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={broken => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
        */
      >
        <div className="logo" onClick={onHome}>
          <Typography>
            <Title level={4} strong style={{color: '#333'}}>Project Br<BulbTwoTone twoToneColor="#f9d71c" />ght</Title>
          </Typography>
        </div>
        <Menu theme="light" mode="inline" defaultSelectedKeys={[selectedKey]}>
          <Menu.Item key="1" onClick={onHome} icon={<HomeOutlined />}>
            Home
          </Menu.Item>
          <Menu.Item key="2" onClick={onFeasibility} icon={<AuditOutlined/>} >
            Feasibility
          </Menu.Item>
          <Menu.Item key="3" icon={<ExceptionOutlined />} >
            Risk           
          </Menu.Item>
          <Menu.Item key="4" icon={<CrownOutlined />}>
            Action
          </Menu.Item>
          <Menu.Item key="5" onClick={onSummary} icon={<DatabaseOutlined />}>
            Summary
          </Menu.Item>
          {/*
          <Menu.Item key="6" icon={<SearchOutlined />} >
            Search
          </Menu.Item>
          */}
        </Menu>
      </Sider>
      <Layout style={{ background: '#fff', marginLeft: 200}}>
        <Header className="site-layout-sub-header-background" style={{ padding: 0, backgroundColor: '#fff'}} >
          <div style={{display: '-webkit-inline-box', float: 'right', marginRight: 20}}>
            {
              props.name === 'Public' ? (
                <div>
                  <GlobalOutlined/> <Text>Public</Text>
                </div>
              ):(
              <>
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
                <p>{props.name}</p>
                <Button icon={<LogoutOutlined />} type="link"  onClick={onLogout} >Logout</Button>
              </>
              )
            }
          </div>
        </Header>
        <Content style={{ margin: '0 16px 0' }}>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 650 }}>
            {props.children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Project Bright by m@s Team</Footer>
      </Layout>
    </Layout>
    <style jsx>{`
      .logo {
        height: 32px;
        margin: 16px;
        cursor: pointer;
      }
      .site-layout-sub-header-background {
        background: #fff;
      }
      
      .site-layout-background {
        background: #fff;
      }
    `}</style>
    </div>
  )
}

export default LayoutComponent