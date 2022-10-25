import {
  BulbOutlined,
  CommentOutlined,
  InfoCircleOutlined,
  InsertRowRightOutlined,
  OrderedListOutlined,
} from '@ant-design/icons'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { Button, Divider, Spin, Tabs } from 'antd'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import _debounce from 'lodash.debounce'

import { ActionBar } from '../../components/ActionBar'
import { ActionDetails } from '../../components/ActionDetails'
import { ActionHistory } from '../../components/ActionHistory'
import { CompanyActionListItemFragmentWithRootCategory } from '../../components/ActionsCarousel'
import { AttachmentsList } from '../../components/AttachmentsList'
import { Comments } from '../../components/Comments'
import { CommentItem } from '../../components/Comments/CommentItem'
import { EmptyState } from '../../components/EmptyState'
import { Main, Section, Sider, SiderLayout } from '../../components/Layout'
import {
  scrollToId,
  SectionWrapper,
} from '../../components/Layout/SectionWrapper'
import { LogoGroup } from '../../components/LogoGroup'
import { RequirementsList } from '../../components/RequirementsList'
import { ShowMore } from '../../components/ShowMore'
import { UserAvatar } from '../../components/UserAvatar'
import categoryTreeData from '../../next-fetch-during-build/data/_category-tree-data.json'
import {
  ContentfulActionFields,
  fetchAllActions,
  RootCategoryLookUpProps,
} from '../../services/contentful'
import {
  EMPTY_ACTION,
  useActionCommentAttachmentsQuery,
  useActionCommentsQuery,
  useCompanyActionDetailsQuery,
  useCompanyActionExtendedDetailsQuery,
} from '../../services/lfca-backend'
import { ServiceProviderComparison } from '../../tools/ServiceProviderComparison'
import { DEFAULT_SUPPORT_EMAIL, isBrowser } from '../../utils'
import { options } from '../../utils/richTextOptions'
import { withAuth } from '../../utils/with-auth'
import styles from './styles.module.less'

interface ActionProps {
  action: ContentfulActionFields
}

const Action: NextPage<ActionProps> = ({ action }) => {
  const [activeComment, setActiveComment] = useState('0')
  const [blocked, setBlocked] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState('')
  const rootCategoryLookUp: RootCategoryLookUpProps =
    categoryTreeData.rootCategoryLookUp
  const router = useRouter()

  const [{ data: actionData, fetching: fetchingAction }] =
    useCompanyActionDetailsQuery({
      variables: { input: { actionContentId: action.actionId } },
    })
  const [
    {
      data: actionDataExtended,
      fetching: fetchingActionExtended,
      stale: staleActionExtended,
    },
  ] = useCompanyActionExtendedDetailsQuery({
    requestPolicy: 'cache-and-network',
    variables: { input: { actionContentId: action.actionId } },
  })
  const [{ data: attachmentsData, fetching: fetchingAttachments }] =
    useActionCommentAttachmentsQuery({
      variables: { input: { actionContentId: action.actionId } },
    })

  const [firstCategory] = actionData?.companyAction?.categories || []
  const rootCategory = rootCategoryLookUp[firstCategory?.id]
  const actionDetails = {
    ...actionData?.companyAction,
    rootCategory,
  } as CompanyActionListItemFragmentWithRootCategory

  const [{ data, fetching }] = useActionCommentsQuery({
    pause: !action.actionId,
    variables: {
      input: { actionContentId: action.actionId },
    },
  })

  const debouncedActiveComment = useRef(
    _debounce(async (value) => {
      setActiveComment(value)
    }, 500)
  ).current

  const offset = 40
  const elHeight = 78
  const tabsWindowHeight = 3 * elHeight + offset

  const sections = [
    {
      children: (
        <ShowMore
          buttonProps={{ type: 'link' }}
          maskMode="transparent"
          maxHeight={140}
          text={
            action?.aboutText &&
            documentToReactComponents(action?.aboutText, options)
          }
        />
      ),
      hideSectionTitle: true,
      key: 'about',
      label: (
        <span>
          <InfoCircleOutlined /> About
        </span>
      ),
      renderCondition: () => true,
    },
    {
      children: (
        <div style={{ margin: '30px 0 0' }}>
          {/* <LogoGroup
            data={actionData?.companyAction?.recentCompaniesDoing}
            label={`${actionData?.companyAction.companiesDoingCount} members working on this`}
            reverse
            size="large"
          /> */}
          {/* <Divider orientation="left" orientationMargin="0">
            Comments
          </Divider> */}
          <Tabs
            className={styles['comments-tabs']}
            defaultActiveKey="1"
            id="test"
            tabPosition={'left'}
            onChange={(key) => {
              setBlocked(true)
              setActiveComment(key)
            }}
            onTabScroll={() => setBlocked(false)}
            activeKey={activeComment}
            style={{ height: `${tabsWindowHeight}px` }}
            items={data?.actionComments.map((comment, i) => {
              const id = String(i)
              return {
                label: (
                  <SectionWrapper
                    intersectionOptions={{
                      root: document.querySelector('#test .ant-tabs-nav-wrap'),
                      rootMargin: `0px 0px ${
                        (tabsWindowHeight - elHeight + 10) * -1
                      }px 0px`,
                      threshold: 0,
                      // triggerOnce: true,
                    }}
                    id={id}
                    setActiveNavItem={(key) => {
                      if (key === activeComment) return
                      console.log('key', key, activeComment)
                      !blocked && debouncedActiveComment(key)
                    }}
                  >
                    <div className={styles['avatar-meta']}>
                      {' '}
                      <UserAvatar
                        avatarProps={{ shape: 'square', size: 45 }}
                        user={comment.author}
                      />{' '}
                      <div className="text">
                        <div className="name">{comment.author?.firstName}</div>
                        <div className="company">
                          {comment.author?.company?.name}
                        </div>
                      </div>
                    </div>
                  </SectionWrapper>
                ),
                key: id,
                children: (
                  <div>
                    <CommentItem
                      comment={comment}
                      isAdmin={true}
                      onDelete={() => console.log('delete')}
                      onEdit={() => console.log('edit')}
                    />
                  </div>
                ),
              }
            })}
          />

          {/* <Comments actionContentId={action.actionId} />
          <AttachmentsList
            attachments={attachmentsData?.actionCommentAttachments || []}
            fetching={fetchingAttachments}
          /> */}
        </div>
      ),
      key: 'community',
      label: (
        <span>
          <CommentOutlined /> Community
        </span>
      ),

      renderCondition: () => true,
    },
    {
      children: (
        <RequirementsList
          actionContentId={action.actionId}
          requirements={actionData?.companyAction?.requirements}
          requirementsContent={action?.requirements}
        />
      ),
      key: 'how-to',
      label: (
        <span>
          <OrderedListOutlined /> Steps
        </span>
      ),
      renderCondition: () => true,
    },
    {
      children: (
        <>
          {fetchingActionExtended || staleActionExtended ? (
            <Spin />
          ) : actionDataExtended?.companyAction.serviceProviderList ? (
            <ServiceProviderComparison
              serviceProviderList={
                actionDataExtended.companyAction.serviceProviderList
              }
              showTitle={true}
            />
          ) : (
            <EmptyState
              actions={[
                <a href={`mailto:${DEFAULT_SUPPORT_EMAIL}`} key="share">
                  <Button size="large" type="primary">
                    Share idea
                  </Button>
                </a>,
              ]}
              bordered
              icon={<BulbOutlined />}
              text={
                <div>
                  We are gradually adding more and more community powered
                  content to the platform. You can check the{' '}
                  <Link href={`/action/companyPledge`}>Measurement Action</Link>{' '}
                  as an example. If you have relevant content ideas for this
                  module, please share them with us!
                </div>
              }
              title="There is more to come..."
            />
          )}
        </>
      ),
      key: 'providers',
      label: (
        <span>
          <InsertRowRightOutlined /> Services
        </span>
      ),
      renderCondition: () =>
        !!actionDataExtended?.companyAction.serviceProviderList,
    },
    {
      children: (
        <ActionHistory contentId={actionData?.companyAction.contentId} />
      ),
      key: 'history',
      label: (
        <span>
          <OrderedListOutlined /> History
        </span>
      ),
      renderCondition: () => true,
    },
  ]

  const docHeight = isBrowser() ? document.documentElement.offsetHeight : 0
  const tabElement = isBrowser()
    ? (document?.querySelector('#tab-container') as HTMLElement)
    : null
  const tabHeight = tabElement?.offsetHeight || 0

  return (
    <SiderLayout goBack={() => router.back()}>
      <Main>
        <Section className={styles['header-section']}>
          <ActionDetails
            action={actionDetails || EMPTY_ACTION}
            fetching={fetchingAction}
          />
        </Section>
        <Section className="sticky" id="tab-container">
          <Tabs
            activeKey={activeNavItem}
            className={styles['tabs']}
            items={sections.map((s) => ({ ...s, children: null }))}
            onChange={(key) => scrollToId(key)}
            size="large"
          />
        </Section>

        <div className={styles['sections']}>
          {sections
            .filter((s) => s.renderCondition)
            .map((s, i) => (
              <SectionWrapper
                id={s.key}
                intersectionOptions={{
                  initialInView: i === 0,
                  rootMargin: `0px 0px ${
                    (docHeight - tabHeight - 40) * -1
                  }px 0px`,
                  threshold: 0,
                }}
                key={s.key}
                setActiveNavItem={setActiveNavItem}
              >
                <Section
                  title={s.hideSectionTitle ? null : s.label}
                  titleSize="small"
                >
                  {s.children}
                </Section>
              </SectionWrapper>
            ))}
        </div>
      </Main>

      <Sider>
        <Section className="sticky">
          {actionData?.companyAction && (
            <ActionBar
              action={actionData?.companyAction}
              actionDetails={action}
            />
          )}
        </Section>
      </Sider>
    </SiderLayout>
  )
}

export const getStaticProps: GetStaticProps<ActionProps> = async ({
  params,
}) => {
  const actionId = params?.actionId as string
  const actionsById = await fetchAllActions()
  const action = actionsById[actionId]

  return {
    props: {
      action,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const actionsById = await fetchAllActions()
  const paths = Object.keys(actionsById).map((actionId) => ({
    params: { actionId },
  }))
  return {
    fallback: false,
    paths: paths,
  }
}

export default withAuth(Action)
