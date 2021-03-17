
import Link from 'next/link'
import Layout from '../components/layout'
import { Typography } from 'antd'
const { Title } = Typography
import useSWR from 'swr'
import FrontLoading from '../components/frontLoading'
import Cookies from 'universal-cookie'
import RiskAssessmentTable from '../components/riskassessmenttable'
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

const RiskAssessmentPage = () => {
  // get token
  const token = cookies.get('token')
  const { user, isLoading, isError } = useUser(token);
  const { ra, isRaLoading, isRaError, boundRaMutate } = useRaAssessor(token, user)

  if(isError) return <div>failed to load. {isError} <Link href="/login" style={{color:"blue"}}>go to login</Link></div>
  if(!token) return <div>Please login. <Link href="/login" style={{color:"blue"}}>go to login</Link></div>
  if(!user) return <div><FrontLoading /></div>

  console.log(ra)

  return (
    <Layout name={user.name} employee_number={user.employee_number}>
      <div>
        <Typography>
          <Title level={4}>Risk Assessment</Title>
        </Typography>
      </div>
      <div>
        <RiskAssessmentTable ra={ra} user={user} boundRaMutate={boundRaMutate} />
      </div>
    </Layout>
  )
}

export default RiskAssessmentPage