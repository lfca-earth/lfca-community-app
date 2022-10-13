import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Tag,
} from 'antd'

import { DefaultStepProps } from './..'

const JOB_OPTIONS = [
  {
    key: 'ceo',
    label: 'CEO, Managing Director',
  },
  {
    key: 'sust',
    label: 'Head of Sustainability',
  },
  {
    key: 'marketing',
    label: 'Marketing',
  },
  {
    key: 'product',
    label: 'Product',
  },
]

export const PersonalInfo = ({ onNext, onPrev }: DefaultStepProps) => {
  return (
    <div>
      <Tag className="super-text">Personal Info</Tag>
      <h1>{`Who are you? 👩🏽‍💻`}</h1>
      <div className="description">
        {`This information will be used to create your personal account on our platform. Tip: You can invite more colleagues later on.`}
      </div>

      <Form layout="vertical">
        <Form.Item label="What's your role at Netflix?">
          <Select placeholder="Please select">
            {JOB_OPTIONS.map((option) => (
              <Select.Option key={option.key}>{option.label}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Row gutter={16}>
          <Col md={12} xs={24}>
            <Form.Item label="First name">
              <Input placeholder="Greta" />
            </Form.Item>
          </Col>
          <Col md={12} xs={24}>
            <Form.Item label="Last name">
              <Input placeholder="Thunberg" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col md={12} xs={24}>
            <Form.Item label="Email">
              <Input placeholder="greta@thunberg.earth" type="email" />
            </Form.Item>
          </Col>
          <Col md={12} xs={24}>
            <Form.Item label="Password">
              <Input placeholder="*********" type="password" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item className="flat">
          <Checkbox>
            I hereby confirm that I am entitled to take action for my
            organization
          </Checkbox>
        </Form.Item>

        <Form.Item className="flat">
          <Checkbox>
            I have read the Terms and Conditions and Privacy Policy
          </Checkbox>
        </Form.Item>
      </Form>

      <Space>
        <Button onClick={onNext} size="large" type="primary">
          Continue
        </Button>
        <Button onClick={onPrev} size="large" type="link">
          Back
        </Button>
      </Space>
    </div>
  )
}

export const PersonalInfoSide = () => {
  return null
}
