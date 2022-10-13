import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'

import {
  CompanyInfo,
  CompanyInfoSide,
  Groups,
  GroupsSide,
  Invite,
  InviteSide,
  Membership,
  MembershipSide,
  PersonalInfo,
  PersonalInfoSide,
  Personalize,
  PersonalizeSide,
} from '../components/Flows/Onboarding'
import CommunityFacesImage from '../components/Flows/Onboarding/community-faces.png'
import CoursePreviewImage from '../components/Flows/Onboarding/course-preview.png'
import PlatformPreviewImage from '../components/Flows/Onboarding/platform-preview.png'
import { StepsLayout } from '../components/Layout'
import { useSteps } from '../hooks/useSteps'

const Onboarding: NextPage = () => {
  const router = useRouter()

  const OnboardingSteps = [
    {
      component: Personalize,
      sideComponent: PersonalizeSide,
      title: 'Personalize',
    },
    {
      component: CompanyInfo,
      sideComponent: CompanyInfoSide,
      sideComponentBackgroundImage: PlatformPreviewImage,
      title: 'Company Info',
    },
    {
      component: PersonalInfo,
      sideComponent: PersonalInfoSide,
      sideComponentBackgroundImage: CommunityFacesImage,
      title: 'Personal Info',
    },
    {
      component: Groups,
      sideComponent: GroupsSide,
      sideComponentBackgroundImage: CoursePreviewImage,
      title: 'Groups',
    },

    {
      component: Invite,
      sideComponent: InviteSide,
      title: 'Invite',
    },
    {
      component: Membership,
      sideComponent: MembershipSide,
      title: 'Membership',
    },
  ]

  const { currentStepIndex, next, prev } = useSteps(
    OnboardingSteps.length,
    () => router.push('/')
  )

  const Step = OnboardingSteps[currentStepIndex]?.component
  const SideComponent = OnboardingSteps[currentStepIndex]?.sideComponent
  const BackgroundImage =
    OnboardingSteps[currentStepIndex]?.sideComponentBackgroundImage

  return (
    <StepsLayout
      asideChildren={SideComponent ? <SideComponent /> : null}
      backgroundImage={BackgroundImage}
      canClose
      currentStepIndex={currentStepIndex}
      onClose={() => router.push('/')}
      steps={OnboardingSteps.map((s) => ({ title: s.title }))}
    >
      {Step ? <Step onNext={next} onPrev={prev} /> : null}
    </StepsLayout>
  )
}

export default Onboarding
