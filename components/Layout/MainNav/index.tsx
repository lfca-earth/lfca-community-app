import {
  AppstoreAddOutlined,
  AppstoreOutlined,
  BankOutlined,
  CalculatorOutlined,
  CalendarOutlined,
  CarryOutOutlined,
  CheckCircleOutlined,
  InsertRowLeftOutlined,
  LockOutlined,
  MessageOutlined,
  ProfileOutlined,
  QuestionCircleOutlined,
  RocketOutlined,
  ShareAltOutlined,
  StarOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons'
import { Menu, MenuProps, Modal } from 'antd'
import { useRouter } from 'next/router'
import React, { useMemo, useState } from 'react'

import { useUser } from '../../../hooks/user'
import { PRODUCT_VIDEO_URL, SUPPORT_EMAIL_LINK } from '../../../utils'
import {
  ACHIEVEMENTS,
  ACTIONS,
  ACTIONS_COMPLETED,
  ACTIONS_PLANNED,
  ADMIN,
  ADMIN_ACTIONS,
  ADMIN_COMMENTS,
  ADMIN_COMPANIES,
  ADMIN_GROUPS,
  ADMIN_REVIEWS,
  ADMIN_USERS,
  COMMUNITY,
  COMMUNITY_GROUPS,
  PERSONAL_FOOTPRINT_CALCULATOR,
  REFERRAL_PROGRAM,
  SERVICE_PROVIDERS,
  TOOLS,
  USEFUL_LINKS,
} from '../../../utils/routes'
import { PaywallPopover } from '../../PayWall/PaywallPopover'
import { VideoWrapper } from '../../VideoWrapper'

const OPEN_HELP_MODAL = 'open-help-modal'

const NAV_ITEMS_BEHIND_PAYWALL = [ACHIEVEMENTS, TOOLS, COMMUNITY]

const NAV_ITEMS_DEFAULT: MenuProps['items'] = [
  {
    children: [
      {
        icon: <ProfileOutlined />,
        key: ACTIONS,
        label: 'Overview',
      },
      {
        icon: <CalendarOutlined />,
        key: ACTIONS_PLANNED,
        label: 'Actions planned',
      },
      {
        icon: <CheckCircleOutlined />,
        key: ACTIONS_COMPLETED,
        label: 'Actions completed',
      },
    ],
    icon: <CarryOutOutlined />,
    key: 'dashboard',
    label: 'Dashboard',
  },
  {
    icon: <TeamOutlined />,
    key: COMMUNITY_GROUPS,
    label: 'Mastermind Groups',
  },
  {
    icon: <RocketOutlined />,
    key: ACHIEVEMENTS,
    label: 'Achievements',
  },
  {
    children: [
      {
        icon: <AppstoreAddOutlined />,
        key: SERVICE_PROVIDERS,
        label: 'Service Providers',
      },
      {
        icon: <CalculatorOutlined />,
        key: PERSONAL_FOOTPRINT_CALCULATOR,
        label: 'Personal Footprint Estimator',
      },
      {
        icon: <ShareAltOutlined />,
        key: REFERRAL_PROGRAM,
        label: 'Referral Program',
      },
      {
        icon: <ProfileOutlined />,
        key: USEFUL_LINKS,
        label: 'Useful Links',
      },
      {
        icon: <QuestionCircleOutlined />,
        key: OPEN_HELP_MODAL,
        label: 'Help',
      },
    ],
    icon: <InsertRowLeftOutlined />,
    key: TOOLS,
    label: 'Tools',
  },
]

const NAV_ITEMS_ADMIN: MenuProps['items'] = [
  {
    children: [
      {
        icon: <UsergroupAddOutlined />,
        key: ADMIN_USERS,
        label: 'Users',
      },
      {
        icon: <BankOutlined />,
        key: ADMIN_COMPANIES,
        label: 'Companies',
      },
      {
        icon: <TeamOutlined />,
        key: ADMIN_GROUPS,
        label: 'Groups',
      },
      {
        icon: <StarOutlined />,
        key: ADMIN_REVIEWS,
        label: 'Reviews',
      },
      {
        icon: <MessageOutlined />,
        key: ADMIN_COMMENTS,
        label: 'Comments',
      },
      {
        icon: <AppstoreOutlined />,
        key: ADMIN_ACTIONS,
        label: 'Actions',
      },
    ],
    icon: <LockOutlined />,
    key: ADMIN,
    label: 'Admin',
  },
]

export const MainNav = () => {
  const [visible, setVisible] = useState(false)
  const { isAdmin, isPaying } = useUser()

  const router = useRouter()

  const addPaywall = (item: any) => {
    if (NAV_ITEMS_BEHIND_PAYWALL.indexOf(item.key) > -1) {
      return {
        ...item,
        disabled: true,
        icon: <PaywallPopover>{item.icon}</PaywallPopover>,
      }
    } else return item
  }

  const items = useMemo(() => {
    let menuItems = NAV_ITEMS_DEFAULT
    if (isAdmin) {
      menuItems = [...NAV_ITEMS_DEFAULT, ...NAV_ITEMS_ADMIN]
    }
    if (!isPaying) {
      menuItems = menuItems.map(addPaywall)
    }
    return menuItems
  }, [isAdmin, isPaying]) as MenuProps['items']

  const handleSelect = ({ key }: { key: string }) => {
    if (key === OPEN_HELP_MODAL) {
      setVisible(true)
    } else {
      router.push(key)
    }
  }

  return (
    <>
      <Menu
        items={items}
        mode="inline"
        onSelect={handleSelect}
        selectedKeys={[router.pathname]}
        theme="light"
      />

      <Modal
        destroyOnClose
        onCancel={() => setVisible(false)}
        visible={visible}
        wrapClassName="modal-md"
      >
        <h3>Need help?</h3>
        <p>
          Check out the video below to get a better understanding of our
          Community App. If this does not help, shoot us an email{' '}
          {SUPPORT_EMAIL_LINK}
        </p>
        <VideoWrapper
          sources={[{ src: PRODUCT_VIDEO_URL, type: 'video/mp4' }]}
        />
      </Modal>
    </>
  )
}
