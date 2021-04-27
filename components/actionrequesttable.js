import { useEffect, useState } from 'react'
import { Table, Tag, Space, Button, message, Modal, Checkbox, Typography, Tooltip, Menu, Dropdown } from 'antd'
import { CheckOutlined, CloseOutlined, ExclamationCircleOutlined, DownOutlined   } from '@ant-design/icons';
import ApproveFa from './approvefa'
import ChangeApprover from './changeapprover';
import ForRiskAssessment from './forriskassessment'
import RejectAR from './rejectar'

const { Text } = Typography

const ActionRequestTable = ({ar, implementation, fa, boundArMutate, boundImplementationMutate, boundFaMutate, user}) => {

  // record means data of the selected row of the table.
  const [ approveARRecord, setApproveARRecord ] = useState({})

  // updateRA means changing property of the object from the array before using it as dataSource of the Table component.
  const [ updatedAR, setUpdatedAR ] = useState([])
  
  // as you've guessed it. for Approve loading
  const [ loadingApprove, setLoadingApprove ] = useState(false)

  // as you've guessed it. for Rejet Loading
  const [ loadingReject, setLoadingReject ] = useState(false)

  // state for selecting row.
  const [ selectedRowKeys, setSelectedRowKeys ] = useState([])

  useEffect(() =>{
    if(ar){
      setUpdatedAR(ar.map(({bi_number: key, ...ar}) => ({key, ...ar})))
    }
  }, [ar])

  // table actions
  const menu = (record) => (
    <Menu>
      <Menu.Item 
        onClick={() => {
          approveAR(record)
        }}
      >
        Acknowledge
      </Menu.Item>
      <Menu.Item 
        danger 
        onClick={() => {
          rejectRA(record) 
        }}
      >
        Denied
      </Menu.Item>
    </Menu>
  )

  const columns = [
    {
      title: 'ID',
      dataIndex: 'key',
      key: 'key',
      sorter: (a, b) => a.key - b.key,
    },
    {
      title: 'BI Number',
      dataIndex: 'bi_id',
      key: 'bi_id',
    },
    {
      title: 'Team',
      dataIndex: 'sps_team',
      key: 'sps_team',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Practice',
      dataIndex: 'current_practice',
      key: 'current_practice',
    },
    {
      title: 'Proposal',
      dataIndex: 'proposal',
      key: 'proposal',
    },/*
    {
      title: 'Status',
      dataIndex: 'current',
      key: 'current',
    },*/
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Dropdown overlay={menu(record)} trigger={['click']}>
          <Button onClick={e => e.preventDefault()} type='link'>
            Options <DownOutlined />
          </Button>
        </Dropdown>
      ),
    },
  ];

  const approveAR = (record) => {
    
    Modal.confirm({
      title: `Acknowledge action request`,
      icon: <ExclamationCircleOutlined style={{color: 'gray'}} />,
      content: `${record.key ? `${record.bi_id} ${selectedRowKeys.length > 1 ? ' bright ideas are' : ' bright idea is'}` : ''} acknowledge?`,
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk: () => {onApproveAR(record)},
      okButtonProps: { type: 'primary' },
      cancelButtonProps: { type: 'text' }
    });
  }  

  const rejectRA = (record) => {
    Modal.confirm({
      title: `Confirm denied action request`,
      icon: <ExclamationCircleOutlined style={{color: 'gray'}} />,
      content: `${record.key ? `${record.bi_id} ${selectedRowKeys.length > 1 ? ' bright ideas are' : ' bright idea is'}` : ''} action request denied?`,
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk: () => {onRejectAR(record)},
      okButtonProps: { danger: true },
      cancelButtonProps: { type: 'text' }
    });
  }   

  // modal after confirmation box.
  //const [visibleApproveAR, setVisibleApproveAR] = useState(false)
  
  const onApproveAR = async (record) => {
     // for POST
    console.log(record)

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let body_fields =  JSON.stringify({
      //
      employee_number: user.employee_number, 
      fa_assessor_email: user.email,
      //
      uuid: record.uuid,
      bi_id: record.bi_id,
      creator: record.creator,
      creator_email: record.email,
      fa_assessor: record.fa_assessor,
      
    })
 
    let response = await fetch(`http://10.3.10.209:4541/acknowledgeaction`,{
      headers: headers,
      method: 'POST',
      body: body_fields
    })

    console.log(body_fields)
    
    setSelectedRowKeys([])
    setLoadingApprove(true)

    if(response.status === 200){
 
      if(await response.json() === 'success'){
       
        message.success('Successfully acknowledged action request')
        setLoadingApprove(false)
        boundArMutate(ar, true)
        boundImplementationMutate(implementation, true)
 
      } else {
 
        message.error('Error. Please try again')
        setLoadingApprove(false)
        boundArMutate(ar, true)
      }
    }
  }

  // modal for reject risk assessment
  const [ visibleRejectAR, setVisibleRejectAR ] = useState(false)

  const onRejectAR = (record) => {
    setApproveARRecord(record)
    setVisibleRejectAR(true)
  }

  const onCreateRejectAR = async (values) => {
    console.log('Received valus of form: ', values)
    setVisibleRejectAR(false) //close modal after maisubmit ng user
    setLoadingApprove(true) // loading 

    console.log(approveARRecord)

    // for POST
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let response = await fetch(`http://10.3.10.209:4541/actiondenied`,{
      headers: headers,
      method: 'POST',
      body: JSON.stringify({
        //
        employee_number: user.employee_number, 
        fa_assessor_email: user.email,
        //
        uuid: approveARRecord.uuid,
        bi_id: approveARRecord.bi_id,
        creator: approveARRecord.creator,
        //creator_email: approveARRecord.email,
        fa_assessor: approveARRecord.fa_assessor,
        //
        comment: values.comment
        
      })
    })

    if(response.status === 200){

      if(await response.json() === 'success'){
      
        setSelectedRowKeys([])
        setLoadingReject(false)
        message.success('Successfully denied action request')
        boundArMutate(ar, true)
        boundFaMutate(fa, true)
      } else {

        setSelectedRowKeys([])
        setLoadingReject(false)
        message.error('Error. Please try again')
        boundArMutate(ar, true)
      }
    }
  }

  return (
    <div>
    <Table columns={columns} dataSource={updatedAR} size="small" style={{marginTop: 12}} pagination={{defaultPageSize: 5}}/>
    <RejectAR 
      visible={visibleRejectAR}
      onCreate={onCreateRejectAR}
      onCancel={() => {
        setVisibleRejectAR(false);
      }}
    />
    </div>
  )

}

export default ActionRequestTable