import {
  ArrowRightOutlined,
  CheckCircleFilled,
  CheckCircleOutlined,
  CloseCircleFilled,
  MehOutlined,
  SmileOutlined,
} from '@ant-design/icons'
import { Avatar, Button, Card, Divider, List, Popover, Space } from 'antd'
import { AvatarSize } from 'antd/lib/avatar/SizeContext'
import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'

import {
  CompanyAchievementFragment,
  CompanyAchievementMiniFragment,
  isAchievementReached,
} from '../../services/lfca-backend'
import styles from './styles.module.less'

interface ActionsStatusListProps {
  items:
    | CompanyAchievementFragment['recommendedActions']
    | CompanyAchievementFragment['requiredActions']
  title: string
}

const SuccessAvatar = ({
  isSuccess,
  size,
}: {
  isSuccess: boolean
  size: AvatarSize
}) => (
  <Avatar
    className={isSuccess ? 'green-inverse' : 'blue-inverse'}
    icon={isSuccess ? <SmileOutlined /> : <MehOutlined />}
    shape="square"
    size={size}
  />
)

const ActionsStatusList = ({ items, title }: ActionsStatusListProps) => {
  const router = useRouter()

  if (items.length < 1) return null

  return (
    <div className="action-status-list">
      <div className="title">{title}</div>
      <List
        dataSource={items}
        renderItem={(item) => (
          <List.Item onClick={() => router.push(`action/${item.contentId}`)}>
            <List.Item.Meta
              avatar={
                item.completedAt ? (
                  <CheckCircleFilled className="green" />
                ) : (
                  <CloseCircleFilled className="wine" />
                )
              }
              title={
                <span>
                  {item.title} <ArrowRightOutlined />
                </span>
              }
            />
          </List.Item>
        )}
      />
    </div>
  )
}

interface AchievementCardProps {
  achievement: CompanyAchievementFragment
  onClickEdit: (achievement: CompanyAchievementFragment) => void
}

export const AchievementCard = ({
  achievement,
  onClickEdit,
}: AchievementCardProps) => {
  const achievementReached = isAchievementReached(achievement)

  return (
    <Card
      className={classNames(styles['achievement-card'], {
        'achievement-reached': achievementReached,
      })}
    >
      <header>
        <SuccessAvatar isSuccess={achievementReached} size={72} />
      </header>
      <main>
        <div className="achievement-title">
          {achievement.name}
          {achievementReached && (
            <CheckCircleOutlined className="title-icon green" />
          )}
        </div>
        <div className="achievement-description">
          {/* {achievement.description &&
            documentToReactComponents(achievement.description)} */}
        </div>
        <Divider />
        <ActionsStatusList
          items={achievement.requiredActions}
          title={'Required Actions'}
        />
        <ActionsStatusList
          items={achievement.recommendedActions}
          title={'Recommended Actions'}
        />
      </main>

      <footer>
        {achievement.micrositeUrl ? (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button
              block
              onClick={() => onClickEdit(achievement)}
              type="primary"
            >
              Edit Microsite
            </Button>
            <Button
              block
              disabled={!achievementReached}
              ghost
              onClick={() => {
                window.open(achievement.micrositeUrl ?? undefined, '_blank')
              }}
            >
              Visit Microsite
            </Button>
          </Space>
        ) : null}
      </footer>
    </Card>
  )
}

interface AchievementStatProps {
  targetCount: number
  completedCount: number
}

const AchievementStat = ({
  completedCount,
  targetCount,
}: AchievementStatProps) => (
  <div className={styles['achievement-stat']}>
    <div className="icon">
      {completedCount >= targetCount ? (
        <CheckCircleFilled className="green" />
      ) : (
        <CloseCircleFilled className="wine" />
      )}
    </div>
    <div className="label">{`${completedCount}/${targetCount}`}</div>
  </div>
)

interface AchievementCardMiniProps {
  achievement: CompanyAchievementMiniFragment
}

export const AchievementCardMini = ({
  achievement,
}: AchievementCardMiniProps) => {
  const achievementReached = isAchievementReached(achievement)
  return (
    <Link href={`/achievements`}>
      <div className={styles['achievement-card-mini']}>
        <SuccessAvatar isSuccess={achievementReached} size={58} />
        <div className="achievement-content">
          <div className="achievement-title">{achievement.name}</div>
          <div className="achievement-stats">
            <Popover
              content={
                <List
                  dataSource={achievement.requiredActions}
                  renderItem={(item) => <List.Item>{item.title}</List.Item>}
                />
              }
              overlayClassName="popover-sm"
              trigger="hover"
            >
              <div>
                <AchievementStat
                  completedCount={
                    achievement.completedRequiredCompanyActionsCount
                  }
                  targetCount={achievement.requiredActions.length}
                />
              </div>
            </Popover>

            <Popover
              content={`You have to fulfill at least ${achievement.minCompletedCompanyActionsCount} actions in total`}
              overlayClassName="popover-sm"
              trigger="hover"
            >
              <div>
                <AchievementStat
                  completedCount={achievement.completedCompanyActionsCount}
                  targetCount={achievement.minCompletedCompanyActionsCount || 0}
                />
              </div>
            </Popover>
          </div>
        </div>
      </div>
    </Link>
  )
}
