import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Form, Input, Button, Checkbox, Typography } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import Cookies from 'universal-cookie'
const cookies = new Cookies()
const { Title, Text } = Typography

const NormalLogin = () => {
  const router = useRouter()
  const [ token, setToken ] = useState('')
  const [ loginResponse, setLoginResponse ] = useState('')

  const onFinish = async (values) => {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    //headers.append('Authorization', '123456789');

    let response = await fetch('http://10.3.10.209:4546/api/login', {
      headers: headers,
      method: 'POST',
      body: JSON.stringify({
        username: values.username,
        password: values.password
      })
    })

    if(response.status === 200){
      setToken(await response.json());
    }

  };

  useEffect(() => {
    
    if(token.token){
      cookies.set('token', token.token);
      router.push('/')
    } else {
      cookies.set('token', '');
      setLoginResponse(token.err)
    }
    
  }, [token])
  

  return (
    <div className="login-form">
    <Typography>
      <Title>Project BI</Title>
    </Typography>
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
    >
      <Form.Item
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your Username!',
          },
        ]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your Password!',
          },
        ]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Typography>
        <Text type="danger">
          {loginResponse}
        </Text>
      </Typography>
      {/*
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
      </Form.Item>
      */}
      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
      </Form.Item>
    </Form>
    <style jsx>{`
      .login-form {
        max-width: 300px;
        margin: auto;
        margin-top: 100px;
      }
      .login-form-forgot {
        float: right;
      }
      .ant-col-rtl .login-form-forgot {
        float: left;
      }
      .login-form-button {
        width: 100%;
      }
    `}</style>
    </div>
  );
};

export default NormalLogin