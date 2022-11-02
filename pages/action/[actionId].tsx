import {
  AppstoreOutlined,
  BulbOutlined,
  HistoryOutlined,
  InfoCircleOutlined,
  MessageOutlined,
  OrderedListOutlined,
} from '@ant-design/icons'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { Button, Tabs } from 'antd'
import classNames from 'classnames'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { ActionBar } from '../../components/ActionBar'
import { getActionStatus } from '../../components/ActionBar/StatusButton'
import { ActionDetails } from '../../components/ActionDetails'
import { ActionHistory } from '../../components/ActionHistory'
import { CompanyActionListItemFragmentWithRootCategory } from '../../components/ActionsCarousel'
import { Comments } from '../../components/Comments'
import { EmptyState } from '../../components/EmptyState'
import { Main, Section, Sider, SiderLayout } from '../../components/Layout'
import {
  scrollToId,
  SectionWrapper,
} from '../../components/Layout/SectionWrapper'
import { RequirementsListTabs } from '../../components/RequirementsListTabs'
import { ShowMore } from '../../components/ShowMore'
import categoryTreeData from '../../next-fetch-during-build/data/_category-tree-data.json'
import {
  ContentfulActionFields,
  fetchAllActions,
  RootCategoryLookUpProps,
} from '../../services/contentful'
import {
  EMPTY_ACTION,
  useCompanyActionDetailsQuery,
  useCompanyActionExtendedDetailsQuery,
} from '../../services/lfca-backend'
import { ServiceProviderComparison } from '../../tools/ServiceProviderComparison'
import {
  DEFAULT_FONT_SIZE,
  DEFAULT_LINE_HEIGHT,
  DEFAULT_SUPPORT_EMAIL,
  isBrowser,
} from '../../utils'
import { options } from '../../utils/rich-text-options'
import { withAuth } from '../../utils/with-auth'
import styles from './styles.module.less'

interface ActionProps {
  action: ContentfulActionFields
}

const Action: NextPage<ActionProps> = ({ action }) => {
  const router = useRouter()
  /**
   * Local State
   */
  const [activeStatusTab, setActiveStatusTab] = useState<string | undefined>()
  const [activeNavItem, setActiveNavItem] = useState('')

  /**
   * Data fetching
   */
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

  /**
   * Local variables
   */
  const rootCategoryLookUp: RootCategoryLookUpProps =
    categoryTreeData.rootCategoryLookUp
  const actionStatus = getActionStatus(actionData?.companyAction)
  const [firstCategory] = actionData?.companyAction?.categories || []
  const rootCategory = rootCategoryLookUp[firstCategory?.id]
  const actionDetails = {
    ...actionData?.companyAction,
    rootCategory,
  } as CompanyActionListItemFragmentWithRootCategory
  const docHeight = isBrowser() ? document.documentElement.offsetHeight : 0
  const tabElement = isBrowser()
    ? (document?.querySelector('#tab-container') as HTMLElement)
    : null
  const tabHeight = tabElement?.offsetHeight || 0

  /**
   * Definition of all scrollable sections
   */
  const sections = [
    {
      children: () => (
        <ShowMore
          buttonProps={{ type: 'link' }}
          maskMode="transparent"
          maxHeight={DEFAULT_FONT_SIZE * DEFAULT_LINE_HEIGHT * 4}
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
      children: () => (
        <RequirementsListTabs
          action={actionData?.companyAction}
          actionContent={action}
          activeStatusTab={activeStatusTab}
          setActiveStatusTab={setActiveStatusTab}
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
      children: ({ label }: { label: React.ReactNode }) => (
        <div style={{ margin: '40px 0 0' }}>
          <Comments actionContentId={action.actionId} title={label} />
        </div>
      ),
      hideSectionTitle: true,
      key: 'community',
      label: (
        <span>
          <MessageOutlined /> Community
        </span>
      ),
      renderCondition: () => true,
    },

    {
      children: () => (
        <>
          {actionDataExtended?.companyAction.serviceProviderList ? (
            <ServiceProviderComparison
              loading={fetchingActionExtended || staleActionExtended}
              serviceProviderList={
                actionDataExtended.companyAction.serviceProviderList
              }
              showTitle={false}
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
          <AppstoreOutlined /> Services
        </span>
      ),
      renderCondition: () =>
        !!actionDataExtended?.companyAction.serviceProviderList,
    },
  ]

  // update the steps tab according to the action status
  useEffect(() => {
    if (action.requirements.find((s) => s.stage === actionStatus.statusLabel)) {
      setActiveStatusTab(`${actionStatus.key}`)
    }
  }, [actionStatus, action])

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
            size="middle"
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
                  {s.children({ label: s.label })}
                </Section>
              </SectionWrapper>
            ))}

          {/* History section is hidden in tabs menu */}
          <SectionWrapper id="history" key="history">
            <Section
              title={
                <div>
                  <HistoryOutlined /> History
                </div>
              }
              titleSize="small"
            >
              <ActionHistory contentId={actionData?.companyAction.contentId} />
            </Section>
          </SectionWrapper>
        </div>
      </Main>

      <Sider>
        <Section className={classNames(styles['sticky-sider'], 'sticky')}>
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
