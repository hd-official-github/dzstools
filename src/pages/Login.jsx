/* eslint-disable eqeqeq */
/* eslint-disable jsx-a11y/alt-text */
import React from 'react'
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import { Card, Typography, message } from 'antd'
import logo from '../logo.png'
import { postapis } from '../apis/postapi'
import Cookies from 'universal-cookie'
export default function Lg () {
  const [messageApi, contextHolder] = message.useMessage()
  const error = () => {
    messageApi.open({
      type: 'error',
      content: 'Kon hai bhai tum ? Sahi email se login kar !'
    })
  }
  const error2 = () => {
    messageApi.open({
      type: 'error',
      content: 'Application ke lode lag gaye ! Log check kar'
    })
  }
  const { Title } = Typography
  async function sendLoginRequest (credentialResponse) {
    const cookies = new Cookies()
    try {
      const d = await postapis('api/login/login', {
        credentials: credentialResponse.credential
      })
      if (d.success == true && d.token) {
        console.log(d.token)
        await cookies.set('user_id', d.token, {
          path: '/',
          // maxAge: new Date().getTime() + 60,
          expires: new Date(new Date().getTime() + 5 * 60 * 60 * 1000)
        })

        window.location.reload()
      } else {
        error()
      }
    } catch (err) {
      console.log(err)
      error2()
    }
  }
  return (
    <div className='login-warp'>
      {contextHolder}
      <Card style={{ flexDirection: 'column' }}>
        <img src={logo} />
        <Title level={3} style={{ textAlign: 'center' }}>
          Admin Login with registered google account
        </Title>
        <GoogleOAuthProvider clientId='44651413005-l8vek8aettusdk6ufalhool3i8l0n530.apps.googleusercontent.com'>
          <GoogleLogin
            onSuccess={credentialResponse => {
              console.log('CR ', credentialResponse)
              sendLoginRequest(credentialResponse)
            }}
            onError={() => {
              console.log('Login Failed')
            }}
          />
        </GoogleOAuthProvider>
      </Card>
    </div>
  )
}
