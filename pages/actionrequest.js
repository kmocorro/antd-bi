
import Link from 'next/link'
import Layout from '../components/layout'
import { Typography } from 'antd'
const { Title } = Typography
import useSWR from 'swr'
import FrontLoading from '../components/frontLoading'
import Cookies from 'universal-cookie'
import ActionRequestTable from '../components/actionrequesttable'
const cookies = new Cookies()

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

const ActionRequestPage = () => {
  // get token
  const token = cookies.get('token')
  const { user, isLoading, isError } = useUser(token);
  const { ar, isArLoading, isArError, boundArMutate } = useActionRequest(token, user)

  if(isError) return <div>failed to load. {isError} <Link href="/login" style={{color:"blue"}}>go to login</Link></div>
  if(!token) return <div>Please login. <Link href="/login" style={{color:"blue"}}>go to login</Link></div>
  if(!user) return <div><FrontLoading /></div>

  console.log(ar)

  return (
    <Layout name={user.name} employee_number={user.employee_number}>
      <div>
        <Typography>
          <Title level={4}>Action Request</Title>
        </Typography>
      </div>
      <div>
        <ActionRequestTable ar={ar} user={user} boundArMutate={boundArMutate} />
      </div>
    </Layout>
  )
}

export default ActionRequestPage