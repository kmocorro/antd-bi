import { useEffect, useState } from 'react'
import { Table, Tag, Space, Button, message, Modal, Checkbox, Typography, Tooltip, Menu, Dropdown } from 'antd'
import { CheckOutlined, CloseOutlined, ExclamationCircleOutlined, DownOutlined   } from '@ant-design/icons';
import ApproveFa from './approvefa'
import ChangeApprover from './changeapprover';
import ForRiskAssessment from './forriskassessment';
import ApproveRA from '../components/approvera'
import RejectRA from '../components/rejectra'

const { Text } = Typography

const RiskAssessmentTable = ({ra, implementation, post,  boundRaMutate, boundImplementationMutate, boundPostMutate, user}) => {

  // record means data of the selected row of the table.
  const [ approveRARecord, setApproveRARecord ] = useState({})

  // updateRA means changing property of the object from the array before using it as dataSource of the Table component.
  const [ updatedRA, setUpdatedRA ] = useState([])
  
  // as you've guessed it. for Approve loading
  const [ loadingApprove, setLoadingApprove ] = useState(false)

  // as you've guessed it. for Rejet Loading
  const [ loadingReject, setLoadingReject ] = useState(false)

  // state for selecting row.
  const [ selectedRowKeys, setSelectedRowKeys ] = useState([])


  // table actions
  const menu = (record) => (
    <Menu>
      <Menu.Item 
        onClick={() => {
          approveRA(record)
          setApproveRARecord(record)
        }}
      >
        Approve
      </Menu.Item>
      <Menu.Item 
        danger 
        onClick={() => {
          rejectRA(record) 
          setApproveRARecord(record)
        }}
      >
        Reject
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

  const approveRA = (record) => {
    Modal.confirm({
      title: `Approve risk assessment`,
      icon: <ExclamationCircleOutlined style={{color: 'gray'}} />,
      content: `${record.key ? `${record.bi_id} ${selectedRowKeys.length > 1 ? ' bright ideas are' : ' bright idea is'}` : ''} approve?`,
      okText: 'Approve',
      cancelText: 'Cancel',
      onOk: () => {onApproveRA(record)},
      okButtonProps: { type: 'primary' },
      cancelButtonProps: { type: 'text' }
    });
  }  

  const rejectRA = (record) => {
    Modal.confirm({
      title: `Confirm reject BI`,
      icon: <ExclamationCircleOutlined style={{color: 'gray'}} />,
      content: `${record.key ? `${record.bi_id} ${selectedRowKeys.length > 1 ? ' bright ideas are' : ' bright idea is'}` : ''} not feasible?`,
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk: () => {onRejectRA(record)},
      okButtonProps: { danger: true },
      cancelButtonProps: { type: 'text' }
    });
  }   

  // modal after confirmation box.
  const [visibleApproveRA, setVisibleApproveRA] = useState(false)
  
  const onApproveRA = (record) => {
    setVisibleApproveRA(true)
  }

  const onCreateApproveRA = async (values) => {
    console.log('Received valus of form: ', values)
    setVisibleApproveRA(false) //close modal after maisubmit ng user
    setLoadingApprove(true) // loading 

    // for POST
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let response = await fetch(`http://10.3.10.209:4881/approveriskassessment`,{
      headers: headers,
      method: 'POST',
      body: JSON.stringify({
        //
        employee_number: user.employee_number, 
        fa_assessor_email: user.email,
        //
        uuid: approveRARecord.uuid,
        bi_id: approveRARecord.bi_id,
        creator: approveRARecord.creator,
        creator_email: approveRARecord.email,
        fa_assessor: approveRARecord.fa_assessor,
        //
        tool_process_name: values.tool_process_name,
        category: values.category,
        risk: values.risk,
        mitigation: values.mitigation,
        impact: values.impact,
        commit_date: values.commit_date,
        comment: values.comment
        
      })
    })

    if(response.status === 200){

      if(await response.json() === 'success'){
      
        setSelectedRowKeys([])
        setLoadingApprove(false)
        message.success('Risk assessment completed')
        boundRaMutate(ra, true)
        boundImplementationMutate(implementation, true)
        boundPostMutate(post, true)

      } else {

        setSelectedRowKeys([])
        setLoadingApprove(false)
        message.error('Error. Please try again')
        boundRaMutate(ra, true)
      }
    }
  }

  // modal for reject risk assessment
  const [ visibleRejectRA, setVisibleRejectRA ] = useState(false)

  const onRejectRA = (record) => {
    setVisibleRejectRA(true)
  }

  const onCreateRejectRA = async (values) => {
    console.log('Received valus of form: ', values)
    setVisibleRejectRA(false) //close modal after maisubmit ng user
    setLoadingReject(true) // loading 

    // for POST
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let response = await fetch(`http://10.3.10.209:4881/rejectriskassessment`,{
      headers: headers,
      method: 'POST',
      body: JSON.stringify({
        //
        employee_number: user.employee_number, 
        fa_assessor_email: user.email,
        //
        uuid: approveRARecord.uuid,
        bi_id: approveRARecord.bi_id,
        creator: approveRARecord.creator,
        //creator_email: approveRARecord.email,
        fa_assessor: approveRARecord.fa_assessor,
        //
        tool_process_name: values.tool_process_name,
        type: values.type,
        assessment: values.assessment,
        comment: values.comment
        
      })
    })

    if(response.status === 200){

      if(await response.json() === 'success'){
      
        setSelectedRowKeys([])
        setLoadingReject(false)
        message.success('Successfully rejected risk assessment')
        boundRaMutate(ra, true)
        boundPostMutate(post, true)

      } else {

        setSelectedRowKeys([])
        setLoadingReject(false)
        message.error('Error. Please try again')
        boundRaMutate(ra, true)
      }
    }
  }

  useEffect(() =>{
    if(ra){
      setUpdatedRA(ra.map(({bi_number: key, ...ra}) => ({key, ...ra})))
    }
  }, [ra])

  return (
    <div>
    <Table columns={columns} dataSource={updatedRA} size="small" style={{marginTop: 12}} pagination={{defaultPageSize: 5}} scroll={{ x: 1800 }} />
    <ApproveRA 
      visible={visibleApproveRA}
      onCreate={onCreateApproveRA}
      onCancel={() => {
        setVisibleApproveRA(false);
      }}
    />
    <RejectRA 
      visible={visibleRejectRA}
      onCreate={onCreateRejectRA}
      onCancel={() => {
        setVisibleRejectRA(false);
      }}
    />
    </div>
  )

}

export default RiskAssessmentTable