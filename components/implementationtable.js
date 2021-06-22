import { useEffect, useState } from 'react'
import { Table, Tag, Space, Button, message, Modal, Checkbox, Typography, Tooltip, Menu, Dropdown, Image } from 'antd'
import { CheckOutlined, CloseOutlined, ExclamationCircleOutlined, DownOutlined   } from '@ant-design/icons';
import ApproveFa from './approvefa'
import ChangeApprover from './changeapprover';
import ForRiskAssessment from './forriskassessment'
import RejectAR from './rejectar'
import ImplementationPage from '../pages/implementation';
import Implement from './implement'

const { Text } = Typography

const ActionRequestImplementationTable = ({implementation, boundImplementationMutate, user, post, boundPostMutate}) => {

  // control state for modal
  const [ visibleImplement, setVisibleImplement ] = useState(false)

  // record means data of the selected row of the table.
  const [ approveImplementationRecord, setApproveImplementationRecord ] = useState({})

  // updateRA means changing property of the object from the array before using it as dataSource of the Table component.
  const [ updatedImplementation, setUpdatedImplementation ] = useState([])
  
  // as you've guessed it. for Approve loading
  const [ loadingApproveImplementation, setLoadingApproveImplementation ] = useState(false)

  // state for selecting row.
  const [ selectedRowKeys, setSelectedRowKeys ] = useState([])

  // state for status_date_fa
  const [ status_date_fa, setStatus_date_fa ] = useState('')

  useEffect(() =>{
    if(implementation){
      setUpdatedImplementation(implementation.map(({bi_number: key, ...implementation}) => ({key, ...implementation})))
    }
  }, [implementation])

  // table actions
  const menu = (record) => (
    <Menu>
      <Menu.Item 
        onClick={() => {
          approveImplementation(record)
          setApproveImplementationRecord(record)
        }}
      >
        Implement
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
      title: 'Image',
      key: 'before_imgPath',
      render: (text, img) => (
        <Image src={`http://10.3.10.209:4541/images/${img.before_imgPath}`} />
      ),
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

  const approveImplementation = (record) => {
    
    Modal.confirm({
      title: `Implement action request`,
      icon: <ExclamationCircleOutlined style={{color: 'gray'}} />,
      content: `${record.key ? `${record.bi_id} ${selectedRowKeys.length > 1 ? ' bright ideas are' : ' bright idea is'}` : ''} implemented?`,
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk: () => {onApproveImplement(record)},
      okButtonProps: { type: 'primary' },
      cancelButtonProps: { type: 'text' }
    });
  } 

  const onApproveImplement = (record) => {
    setVisibleImplement(true)
    setStatus_date_fa(record.status_date_fa)
  }
  
  const onCreateImplement = async (values) => {
     // for POST
    console.log(values)
    setVisibleImplement(false)

    let image2upload = [{
      blob: (values.after_imageArray[0].thumbUrl).replace(/^data:image\/.*;base64,/, ""),
      path: (values.after_imageArray[0].name)
    }]


    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let body_fields =  JSON.stringify({
      //
      employee_number: user.employee_number, 
      fa_assessor_email: user.email,
      //  
      uuid: approveImplementationRecord.uuid,
      bi_id: approveImplementationRecord.bi_id,
      creator: approveImplementationRecord.creator,
      creator_email: approveImplementationRecord.email,
      fa_assessor: approveImplementationRecord.fa_assessor,

      //
      implementor: values.implementor,
      implementation_date: values.implementation_date,
      final_impact: values.final_impact,
      after_imageArray: image2upload
      
    })
 
    let response = await fetch(`http://10.3.10.209:4541/implemented`,{
      headers: headers,
      method: 'POST',
      body: body_fields
    })
    
    setSelectedRowKeys([])
    setLoadingApproveImplementation(true)

    if(response.status === 200){
 
      if(await response.json() === 'success'){
       
        message.success('Bright idea successfully implemented')
        setLoadingApproveImplementation(false)
        boundImplementationMutate(implementation, true)
        boundPostMutate(post, true)
 
      } else {
 
        message.error('Error. Please try again')
        setLoadingApproveImplementation(false)
        boundImplementationMutate(implementation, true)
      }
    }
  }

  // options for autocomplete naming.
  const [ options, setOptions ] = useState([]);
  useEffect(() => {
    getAutoFillSearch();
    async function getAutoFillSearch(){
      //let response = await fetch('http://10.3.10.209:4546/autofillsearch');
      let response = await fetch('http://10.3.10.209:4541/autofillsearch');
      if(response.status === 200){
        setOptions(await response.json());
      }
    }
  }, [])


  return (
    <div>
    <Table columns={columns} dataSource={updatedImplementation} size="small" style={{marginTop: 12}} pagination={{defaultPageSize: 5}} scroll={{ x: 1800 }} />
    <Implement 
      visible={visibleImplement}
      onCreate={onCreateImplement}
      onCancel={() => {
        setVisibleImplement(false);
      }}
      options={options}
      status_date_fa={status_date_fa}
    />
    </div>
  )

}

export default ActionRequestImplementationTable