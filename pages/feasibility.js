
import Link from 'next/link'
import Layout from '../components/layout'
import { Typography } from 'antd'
const { Title } = Typography
import useSWR from 'swr'
import FrontLoading from '../components/frontLoading'
import Cookies from 'universal-cookie'
import FeasibilityTable from '../components/feasbilitytable'
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
    boundFaMutate: mutate
  }
}

const FeasibilityPage = () => {
  // get token
  const token = cookies.get('token')
  const { user, isLoading, isError } = useUser(token);
  const { fa, isFaLoading, isFaError, boundFaMutate } = useFaAssessor(token, user)

  if(isError) return <div>failed to load. {isError} <Link href="/login" style={{color:"blue"}}>go to login</Link></div>
  if(!token) return <div>Please login. <Link href="/login" style={{color:"blue"}}>go to login</Link></div>
  if(!user) return <div><FrontLoading /></div>

  return (
    <Layout name={user.name} employee_number={user.employee_number}>
      <div>
        <Typography>
          <Title level={4}>Feasibility</Title>
        </Typography>
      </div>
      <div>
        <FeasibilityTable fa={fa} user={user} boundFaMutate={boundFaMutate} />
      </div>
    </Layout>
  )
}

export default FeasibilityPage