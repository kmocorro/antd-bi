
import Link from 'next/link'
import Layout from '../components/layout'
import { Typography } from 'antd'
const { Title } = Typography
import useSWR from 'swr'
import Cookies from 'universal-cookie'
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
  const { data, error } = useSWR(`http://10.3.10.209:4546/getuserprofile/${token}`, fetcher)
  
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
  const { data, error, mutate } = useSWR( user ? [`http://10.3.10.209:4546/showbrightideaforfaassessor/${token}`, user] : null, fetchWithFaBody)
  return {
    fa: data,
    isFaLoading: !error && !data,
    isFaError: error,
    boundMutate: mutate
  }
}

const FeasibilityPage = () => {
  // get token
  const token = cookies.get('token')
  const { user, isLoading, isError } = useUser(token);
  const { fa, isFaLoading, isFaError, boundMutate } = useFaAssessor(token, user)

  console.log(fa)

  if(isError) return <div>failed to load. {isError} <Link href="/login" style={{color:"blue"}}>go to login</Link></div>
  if(!token) return <div>Please login. <Link href="/login" style={{color:"blue"}}>go to login</Link></div>
  if(!user) return <div>Loading...</div>

  return (
    <Layout name={user.name}>
      <div>
        <Typography>
          <Title>Feasibility</Title>
        </Typography>
      </div>
    </Layout>
  )
}

export default FeasibilityPage