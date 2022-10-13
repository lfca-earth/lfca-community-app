import { Button, Space, Tag } from 'antd'

import { withAuth } from '../../../utils/with-auth'
import { DefaultStepProps } from './..'

const InviteContent = ({ onNext }: DefaultStepProps) => {
  return (
    <div>
      <Tag className="super-text">Company Info</Tag>
      <h1>{`Get your team on board! 💪🏽`}</h1>
      <div className="description">
        {`Climate action is team work. Assemble your A team and invite them to join the platform and take action together.`}
      </div>

      <Space>
        <Button onClick={onNext} size="large" type="primary">
          Join group
        </Button>
      </Space>
    </div>
  )
}

export const Invite = withAuth(InviteContent)

export const InviteSide = () => {
  return null
}
