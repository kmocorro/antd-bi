import React, { useState } from 'react'
import { Button, Modal, Form, Input, Radio, DatePicker, AutoComplete, Select } from 'antd'
import { initialImpact_list, process_list } from '../public/itemlist'
const { Option } = Select

const RejectAR = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  
  // ---
  const onChange = (date, dateString) => {
    console.log(date, dateString);
  }

  return (
    <Modal
      visible={visible}
      title="Reject Action Request"
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
          name="comment"
          label="Remarks"
          rules={[
            {
              required: true,
              message: 'Please enter remarks',
            },
          ]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default RejectAR