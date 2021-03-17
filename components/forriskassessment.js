import React, { useState } from 'react'
import { Button, Modal, Form, Input, Radio, DatePicker, AutoComplete, Select } from 'antd'
const { Option } = Select

const ForRiskAssessment = ({ visible, onCreate, onCancel, options, setRisk_assessor }) => {
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
      title="Submit BI for evaluation"
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
          name="risk_assessor" 
          label="Risk Assessor"
          rules={[
            {
              required: true,
              message: 'Please enter risk assessor name',
            },
          ]}
        >
          <AutoComplete
            options={new_options}
            style={{
              width: 200,
            }}
            filterOption={(inputValue, option) =>
              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
            onSelect={(inputValue, option) => {
              setRisk_assessor(option)
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ForRiskAssessment