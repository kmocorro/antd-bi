import { useEffect, useState } from 'react'
import { Table, Tag, Space, Button, message, Modal, Checkbox, Typography, Tooltip, Menu, Dropdown } from 'antd'
import { CheckOutlined, CloseOutlined, ExclamationCircleOutlined, DownOutlined   } from '@ant-design/icons';
import ApproveFa from '../components/approvefa'
import ChangeApprover from './changeapprover';
import ForRiskAssessment from './forriskassessment';

const { Text } = Typography

const FeasibilityTable = ({fa, ra, ar, boundRaMutate, boundFaMutate, boundArMutate, user}) => {

  const [ approveFaRecord, setApproveFARecord ] = useState({})

  const [ updatedFa, setUpdatedFa ] = useState([])
  const [ loadingApprove, setLoadingApprove ] = useState(false)
  const [ loadingReject, setLoadingReject ] = useState(false)
  const [ selectedRowKeys, setSelectedRowKeys ] = useState([])

  // options for autocomplete naming.
  const [ options, setOptions ] = useState([]);
  useEffect(() => {
    getAutoFillSearch();
    async function getAutoFillSearch(){
      let response = await fetch('http://10.3.10.209:4546/autofillsearch');
      if(response.status === 200){
        setOptions(await response.json());
      }
    }
  }, [])
  
  const menu = (record) => (
    <Menu>
      <Menu.Item 
        onClick={() => {
          approveWithoutRA(record)
          setApproveFARecord(record)
        }}
      >
        Approve
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          changeApprover(record)
          setApproveFARecord(record)
        }}
      >
        Change approver
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          forRiskAssessment(record)
          setApproveFARecord(record)
        }}
      >
        For risk assessment
      </Menu.Item>
      <Menu.Item 
        danger 
        onClick={() => {
          notFeasible(record) 
          setApproveFARecord(record)
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

  const notFeasible = (record) => {
    
    Modal.confirm({
      title: `Confirm not feasible`,
      icon: <ExclamationCircleOutlined style={{color: 'gray'}} />,
      content: `${record.key ? `${record.bi_id} ${selectedRowKeys.length > 1 ? ' bright ideas are' : ' bright idea is'}` : ''} not feasible?`,
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk: () => {onReject(record)},
      okButtonProps: { danger: true },
      cancelButtonProps: { type: 'text' }
      
    });
  }   

  const approveWithoutRA = (record) => {
    Modal.confirm({
      title: `Approve without risk assessment`,
      icon: <ExclamationCircleOutlined style={{color: 'gray'}} />,
      content: `${record.key ? `${record.bi_id} ${selectedRowKeys.length > 1 ? ' bright ideas are' : ' bright idea is'}` : ''} approve?`,
      okText: 'Approve',
      cancelText: 'Cancel',
      onOk: () => {onApprove(record)},
      okButtonProps: { type: 'primary' },
      cancelButtonProps: { type: 'text' }
    });
  }   

  const changeApprover = (record) => {
    Modal.confirm({
      title: `Change Approver`,
      icon: <ExclamationCircleOutlined style={{color: 'gray'}} />,
      content: `Would you like to change the approver for ${record.key ? `${record.bi_id} ${selectedRowKeys.length > 1 ? ' bright ideas' : ' bright idea'}` : ''} ?`,
      okText: 'Yes',
      cancelText: 'Cancel',
      onOk: () => {onChangeApprover(record)},
      okButtonProps: { type: 'primary' },
      cancelButtonProps: { type: 'text' }
    });
  }   
  
  const forRiskAssessment = (record) => {
    Modal.confirm({
      title: `For Risk Assessment`,
      icon: <ExclamationCircleOutlined style={{color: 'gray'}} />,
      content: `Would you like to transfer the risk assessment for ${record.key ? `${record.bi_id} ${selectedRowKeys.length > 1 ? ' bright ideas' : ' bright idea'}` : ''} ?`,
      okText: 'Yes',
      cancelText: 'Cancel',
      onOk: () => {onRiskAssessment(record)},
      okButtonProps: { type: 'primary' },
      cancelButtonProps: { type: 'text' }
    });
  }   

  // 
  const [visibleApproveFA, setVisibleApproveFA] = useState(false)
  const [ action_owner, setAction_owner ] = useState({ employee_number: '', name: '', email: '' })

  
  const onApprove = (record) => {
    setVisibleApproveFA(true)
  }

  const onCreateApproveFA = async (values) => {
    console.log('Received values of form: ', values)
    
    setVisibleApproveFA(false)
    setLoadingApprove(true)

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let response = await fetch(`http://10.3.10.209:4541/feasible_without_RA`,{
      headers: headers,
      method: 'POST',
      body: JSON.stringify({
        uuid: approveFaRecord.uuid,
        bi_id: approveFaRecord.key,
        employee_number: user.employee_number, // fa_assessor
        employee_name: user.name,
        //
        category: values.category,
        commit_datetocheck: values.commit_date,
        impact: values.impact,
        comment: values.comment,
        action_owner: action_owner.employee_number,
        action_owner_email: action_owner.email,
        // added
        with_deniedAction: approveFaRecord.with_deniedAction
      })
    })

    if(response.status === 200){

      if(await response.json() === 'success'){

        setAction_owner({ employee_number: '', name: '', email: '' })
        setSelectedRowKeys([])
        setLoadingApprove(false)
        message.success('Successfully approved without risk assessment')
        boundFaMutate(fa, true)
        boundArMutate(ar, true)

      } else {
        
        setAction_owner({ employee_number: '', name: '', email: '' })
        setSelectedRowKeys([])
        setLoadingApprove(false)
        message.error('Error. Please try again')
        boundFaMutate(fa, true)

      }
    }

  }


  const onReject = async (record) => {

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let body_post = JSON.stringify({
      uuid: approveFaRecord.uuid,
      bi_id: approveFaRecord.key,
      employee_number: user.employee_number, // user employee number gosh
      creator: approveFaRecord.creator,
      comment: 'n/a',
      employee_name: approveFaRecord.name
    })

    console.log(body_post)

    let response = await fetch(`http://10.3.10.209:4541/notfeasible`,{
      headers: headers,
      method: 'POST',
      body: body_post
    })

    setLoadingReject(true)
    setSelectedRowKeys([])

    if(response.status === 200){
      if(await response.json() === 'success'){

        message.success('Successfully updated')
        setApproveFARecord({})
        setLoadingReject(false)
        boundFaMutate(fa, true)
      } else {

        message.error('Error. Please try again')
        setApproveFARecord({})
        setLoadingReject(false)
        boundFaMutate(fa, true)
      }
    }

  }

  // change approver
  const [visibleChangeApprover, setVisibleChangeApprover] = useState(false)
  const [ change_approver, setChange_approver ] = useState({ employee_number: '', name: '', email: '' })

  const onChangeApprover = () => {
    setVisibleChangeApprover(true)
  }

  const onCreateChangeApprover = async (values) => {
    console.log('Received values of form: ', values)

    setVisibleChangeApprover(false)
    setLoadingApprove(true)

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let response = await fetch(`http://10.3.10.209:4541/changesupervisor`,{
      headers: headers,
      method: 'POST',
      body: JSON.stringify({
        uuid: approveFaRecord.uuid,
        bi_id: approveFaRecord.key,
        employee_number: user.employee_number, // fa_assessor
        //
        supervisor: change_approver.employee_number,
        supervisor_email: change_approver.email
      })
    })

    if(response.status === 200){

      if(await response.json() === 'success'){

        setChange_approver({ employee_number: '', name: '', email: '' })
        setSelectedRowKeys([])
        setLoadingApprove(false)
        message.success('Successfully changed approver')
        boundFaMutate(fa, true)

      } else {
        
        setChange_approver({ employee_number: '', name: '', email: '' })
        setSelectedRowKeys([])
        setLoadingApprove(false)
        message.error('Error. Please try again')
        boundFaMutate(fa, true)

      }
    }

  }


  // for risk assessment
  const [visibleForRiskAssessment, setVisibleForRiskAssessment] = useState(false)
  const [ risk_assessor, setRisk_assessor ] = useState({ employee_number: '', name: '', email: '' })

  const onRiskAssessment = () => {
    setVisibleForRiskAssessment(true)
  }

  const onCreateForRiskAssessment = async (values) => {
    console.log('Received values of form: ', values)

    setVisibleForRiskAssessment(false)
    setLoadingApprove(true)

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let response = await fetch(`http://10.3.10.209:4541/forriskassessment`,{
      headers: headers,
      method: 'POST',
      body: JSON.stringify({
        uuid: approveFaRecord.uuid,
        bi_id: approveFaRecord.key,
        employee_number: user.employee_number, // fa_assessor
        creator: user.employee_number,
        //
        risk_assessor: risk_assessor.employee_number,
        risk_assessor_email: risk_assessor.email,
        comment: '',
      })
    })

    if(response.status === 200){

      if(await response.json() === 'success'){

        setChange_approver({ employee_number: '', name: '', email: '' })
        setSelectedRowKeys([])
        setLoadingApprove(false)
        message.success('Successful transer for risk assessment')
        boundFaMutate(fa, true)
        boundRaMutate(ra, true)

      } else {
        
        setChange_approver({ employee_number: '', name: '', email: '' })
        setSelectedRowKeys([])
        setLoadingApprove(false)
        message.error('Error. Please try again')
        boundFaMutate(fa, true)

      }
    }

  }



  const onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys)
    setSelectedRowKeys(selectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  }

  const hasSelected = selectedRowKeys.length > 0

  useEffect(() =>{
    if(fa){
      setUpdatedFa(fa.map(({bi_number: key, ...fa}) => ({key, ...fa})))
    }
  }, [fa])

  return (
    <div>
      <Table columns={columns} dataSource={updatedFa} size="small" style={{marginTop: 12}} pagination={{defaultPageSize: 5}}/>
      <ApproveFa 
        visible={visibleApproveFA}
        onCreate={onCreateApproveFA}
        onCancel={() => {
          setVisibleApproveFA(false);
        }}
        options={options}
        setAction_owner={setAction_owner}
      />
      <ChangeApprover 
        visible={visibleChangeApprover}
        onCreate={onCreateChangeApprover}
        onCancel={() => {
          setVisibleChangeApprover(false);
        }}
        options={options}
        setChange_approver={setChange_approver}
      />
      <ForRiskAssessment 
        visible={visibleForRiskAssessment}
        onCreate={onCreateForRiskAssessment}
        onCancel={() => {
          setVisibleForRiskAssessment(false);
        }}
        options={options}
        setRisk_assessor={setRisk_assessor}
      />
    </div>
  )
}

export default FeasibilityTable