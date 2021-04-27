import { useState } from 'next'
import { Button, Modal, Form, Input, Radio, Select, Upload} from 'antd'
const { Option } = Select;
import { benefactor_list, initialImpact_list } from '../public/itemlist'
import { UploadOutlined } from '@ant-design/icons';
import { spsteam_list, shift_list } from '../public/itemlist'

const normFile = (e) => {
  //console.log('Upload event:', e);

  if (Array.isArray(e)) {
    return e;
  }

  return e && e.fileList;
};

const ProfileForm = ({ visible, onCreate, onCancel, user }) => {
  const [form] = Form.useForm();

  form.setFieldsValue({
    sps_team: user.sps_team,
    shift: user.shift,
  })

  return (
    <Modal
      visible={visible}
      title={"Edit Profile"}
      okText="Save Changes"
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
      >
        <Form.Item
          name="sps_team"
          label="SPS team"
          rules={[
            {
              required: true,
              message: 'Please input the title of BI. (max 80)',
            },
          ]}
        >
          <Select>
            {
              spsteam_list.map(data => (
                <Option key={data.id} value={data.name}>{data.name}</Option>
              ))
            }
          </Select>
        </Form.Item>
        <Form.Item
          name="shift"
          label="Shift"
          rules={[
            {
              required: true,
              message: 'Please input your current practice why did you come up with an idea. (max 330)',
            },
          ]}
        >
        <Select>
          {
            shift_list.map(data => (
              <Option key={data.id} value={data.name}>{data.name}</Option>
            ))
          }
        </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProfileForm