import { Layout, Menu } from 'antd'
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons'

const { Header, Content, Footer, Sider } = Layout

const LayoutComponent = () => {
  return (
    <div>
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={broken => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="logo" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
          <Menu.Item key="1" icon={<UserOutlined />}>
            Feasibility
          </Menu.Item>
          <Menu.Item key="2" icon={<VideoCameraOutlined />}>
            Risk           
          </Menu.Item>
          <Menu.Item key="3" icon={<UploadOutlined />}>
            Action
          </Menu.Item>
          <Menu.Item key="4" icon={<UserOutlined />}>
            Summary
          </Menu.Item>
          <Menu.Item key="5" icon={<UserOutlined />}>
            Search
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header className="site-layout-sub-header-background" style={{ padding: 0, backgroundColor: '#fff' }} />
        <Content style={{ margin: '24px 16px 0' }}>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            content
            content
            content
            content
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
      </Layout>
    </Layout>
    <style jsx>{`
      .logo {
        height: 32px;
        background: rgba(255, 255, 255, 0.2);
        margin: 16px;
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