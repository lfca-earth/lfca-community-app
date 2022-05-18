import { ArrowRightOutlined } from '@ant-design/icons'
import { Alert, Avatar, Button } from 'antd'

export const FeaturedProvider = () => {
  return (
    <Alert
      action={[
        <Button icon={<ArrowRightOutlined />} key="start" type="primary">
          Open now
        </Button>,
      ]}
      description="As an LFCA member, you can make use of Normative's Business Carbon Calculator free of charge. The tool is optimised for smaller businesses operating in a single market."
      icon={
        <Avatar
          shape="square"
          size="large"
          src="/img/providers/normative.png"
        />
      }
      message="Jumpstart your journey to net zero for free"
      showIcon
      type="info"
    />
  )
}
