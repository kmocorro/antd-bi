import React, { useState } from 'react'
import { Button, Modal, Form, Input, Radio, DatePicker, AutoComplete, Select } from 'antd'
const { Option } = Select

const ChangeApprover = ({ visible, onCreate, onCancel, options, setChange_approver }) => {
  const [form] = Form.useForm();
  
  // ---
  const onChange = (date, dateString) => {
    console.log(date, dateString);
  }

  const new_options = options.map(option => 
    ( 
      {
        value: option.name,
        employee_number: option.employee_number,
        email: option.email,
      }
    )
  )


  return (
    <Modal
      visible={visible}
      title="Submit to change BI Owner"
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
        }}
      >
        <Form.Item
          name="new_approver" 
          label="New BI Owner"
          rules={[
            {
              required: true,
              message: 'Please enter new supervisor/bi owner',
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
            onSelect={(inputValue, option) => {
              setChange_approver(option)
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ChangeApprover