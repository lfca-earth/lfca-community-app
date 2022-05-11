import { Button, Tag, Drawer, Checkbox, Space } from 'antd'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { Pledge } from '../../Pledge'
import { CarbonCalculator } from '../../../tools/PersonalCarbonCalculator'
import { InviteTeam } from '../../InviteTeam'

const Commit = (props: any) => {
    return (
        <div>
            <Tag className='super-text'>Pledge</Tag>
            <h1>Welcome Timo, let's get you started!</h1>
            <p>We started LFCA with the goal to accelerate the transition towards a sustainable economy. To make this happen, we need to leverage our influence on a personal, business and political level. Please start by signing our Green Pledge as a leader of LFCA.</p>
            <Pledge onFinish={() => props.setStep(1)} />
        </div>
    )
}

const Invite = (props: any) => {
    const [hasMinimumInvited, setHasMinimumInvited] = useState(false)
    const [isLeaderOfficer, setIsLeaderOfficer] = useState(false)
    console.log('isLeaderOfficer', isLeaderOfficer)
    return (
        <div>
            <Tag className='super-text'>Intro</Tag>
            <h1>Invite at least one team member as a Climate Officer</h1>
            <p>Calculating the carbon footprint of an entire company and doing reduction and goal setting workshops takes quite a bit of time. We therefore ask you to appoint at least one motivated team member that helps to coordinate these efforts.</p>
            <ul>
                <li>
                    If you already have a person or team that takes care of sustainabality, the choice is obvious
                </li>
                <li>
                    If you don't, pick someone who is genuinely passionate about the topicWe recommend to invite that colleague with a personal message
                </li>
            </ul>
            <InviteTeam onMinimumInvited={() => setHasMinimumInvited(true)} />
            <Space direction='vertical'>
                <Checkbox checked={isLeaderOfficer} onChange={e => setIsLeaderOfficer(e.target.checked)} >I will take over the role of Climate Officer for my company (not-recommended)</Checkbox>
                <Button disabled={!isLeaderOfficer && !hasMinimumInvited} type='primary' size='large' onClick={() => props.setStep(2)}>Continue</Button>
            </Space>
        </div>
    )
}

const Footprint = (props: any) => {
    const [drawerVisible, setDrawerVisible] = useState(false)

    const saveAndContinue = (val: any) => {
        // @TODO: save to database
        // show loading spinner
        setDrawerVisible(false)
        props.setStep(3)
    }

    return (
        <div>
            <Tag className='super-text'>Intro</Tag>
            <h1>Welcome Timo, let's get you started!</h1>
            <p>The lfca platform is the place where we collect and share our community's knowledge. It's the place where we inspire you to realize the full climate action potential of your organization.</p>
            <Button type='primary' size='large' onClick={() => setDrawerVisible(true)}>Start</Button>

            <Drawer className='fullscreen-drawer-bottom' height={'100%'} placement='bottom' visible={drawerVisible} onClose={() => setDrawerVisible(false)}>
                <CarbonCalculator
                    questionnaire={props.questionnaire}
                    saveResult={saveAndContinue}
                />
            </Drawer>
        </div>
    )
}

const Share = (props: any) => {
    const router = useRouter()
    return (
        <div>
            <Tag className='super-text'>Intro</Tag>
            <h1>Welcome Timo, let's get you started!</h1>
            <p>The lfca platform is the place where we collect and share our community's knowledge. It's the place where we inspire you to realize the full climate action potential of your organization.</p>
            <Button type='primary' size='large' onClick={() => props.setStep(1)}>Continue</Button>
        </div>
    )
}

export const OnboardingLeaderSteps = (props: any) => [
    { title: 'Pledge', description: 'Commit to action', component: <Commit {...props} /> },
    { title: 'Invite', description: 'Get to know the platform', component: <Invite {...props} /> },
    { title: 'Footprint', description: 'Understand your emissions', component: <Footprint {...props} /> },
    { title: 'Share the news', description: 'Use your influence', component: <Share {...props} /> }
]