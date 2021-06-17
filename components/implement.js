import React, { useState } from 'react'
import { Button, Modal, Form, Input, Radio, DatePicker, AutoComplete, Select, Upload } from 'antd'
import { initialImpact_list, process_list } from '../public/itemlist'
import { UploadOutlined } from '@ant-design/icons'
import moment from 'moment'
const { Option } = Select

const Implement = ({ visible, onCreate, onCancel, options }) => {
  const [form] = Form.useForm();
  
  const new_options = options.map(option => 
    ( 
      {
        value: option.name,
        employee_number: option.employee_number,
        email: option.email,
      }
    )
  )

  const normFile = (e) => {
    //console.log('Upload event:', e);
  
    if (Array.isArray(e)) {
      return e;
    }
  
    return e && e.fileList;
  };

  // ---
  const onChange = (date, dateString) => {
    console.log(date, dateString);
  }

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
  }

  return (
    <Modal
      visible={visible}
      title="Implement Bright Idea"
      okText="Submit"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          comment: 'N/A'
        }}
      >
        <Form.Item
          name="implementor" 
          label="Implementor"
          rules={[
            {
              required: true,
              message: 'Please enter the implementor',
            },
          ]}
        >
          <AutoComplete
            placeholder="e.g. Kevin Mocorro"
            options={new_options}
            style={{
              width: 200,
            }}
            filterOption={(inputValue, option) =>
              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
            //onSelect={(inputValue, option) => {
            //  setChange_approver(option)
            //}}
          />
        </Form.Item>
        <Form.Item
          name="implementation_date"
          label="Implementation Date"
        >
          <DatePicker 
            disabledDate={disabledDate}
          />
        </Form.Item>
        <Form.Item
          name="final_impact"
          label="Maxeon Impact"
          rules={[
            {
              required: true,
              message: 'Please enter maxeon impact',
            },
          ]}
        >
          <Select>
            {
              initialImpact_list.map(value => (
                <Option key={value.id} value={value.name}>{value.name}</Option>
              ))
            }
          </Select>
        </Form.Item>
        <Form.Item
          name="after_imageArray"
          label="Upload Image"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[
            {
              required: true,
              message: 'Please upload the result image of your bright idea.',
            },
          ]}
        >
          <Upload name="logo" listType="picture" maxCount={1} accept={'image/*'}>
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default Implement