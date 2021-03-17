import { useState } from 'next'
import { Button, Modal, Form, Input, Radio, Select, Upload} from 'antd'
const { Option } = Select;
import { benefactor_list, initialImpact_list } from '../public/itemlist'
import { UploadOutlined } from '@ant-design/icons';

const normFile = (e) => {
  //console.log('Upload event:', e);

  if (Array.isArray(e)) {
    return e;
  }

  return e && e.fileList;
};

const CreateBrightIdeaForm = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  return (
    <Modal
      visible={visible}
      title="Submit a new bright idea"
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
          modifier: 'public',
        }}
      >
        <Form.Item
          name="title"
          label="Give a name to your idea!"
          rules={[
            {
              required: true,
              message: 'Please input the title of BI.',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="current_practice"
          label="Current Practice"
          rules={[
            {
              required: true,
              message: 'Please input your current practice why did you come up with an idea.',
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="proposal"
          label="Tell us more about your idea or your proposal"
          rules={[
            {
              required: true,
              message: 'Please describe your idea.',
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="benefactor"
          help="beneficiary of your idea"
          label="Tell us in which team your idea will fit"
          rules={[
            {
              required: true,
              message: 'Please select your benefactor.',
            },
          ]}
        >
          <Select>
            {
              benefactor_list.map(value => (
                <Option key={value.id} value={value.name}>{value.name}</Option>
              ))
            }
          </Select>
        </Form.Item>
        <Form.Item
          name="initial_impact"
          label="Impact"
          rules={[
            {
              required: true,
              message: 'Please select the impact of your bright idea.',
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
          name="before_imageArray"
          label="Upload Image"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[
            {
              required: true,
              message: 'Please upload the image of your bright idea.',
            },
          ]}
        >
          <Upload name="logo" listType="picture" maxCount={1} accept={'image/*'}>
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item>
        {/*
        <Form.Item name="modifier" className="collection-create-form_last-form-item">
          <Radio.Group>
            <Radio value="public">Public</Radio>
            <Radio value="private">Private</Radio>
          </Radio.Group>
        </Form.Item>
        */}
      </Form>
    </Modal>
  );
};

export default CreateBrightIdeaForm