import { UpdateResolver } from '@urql/exchange-graphcache'

import {
  CompanyActionsListDocument,
  CompanyActionsListQuery,
  CompleteCompanyActionMutation,
  CompleteCompanyActionMutationVariables,
} from '../generated'

export const completeCompanyAction: UpdateResolver<
  CompleteCompanyActionMutation,
  CompleteCompanyActionMutationVariables
> = (result, args, cache) => {
  cache.updateQuery<CompanyActionsListQuery>(
    {
      query: CompanyActionsListDocument,
      variables: { input: { filter: { completed: true } } },
    },
    (data) => {
      if (!data?.companyActions) return data

      if (args.input.isCompleted) {
        // Add the completed action to the list of completedActions
        data.companyActions = [
          ...data.companyActions,
          result.completeCompanyAction,
        ]
      } else {
        // Find and remove the incompleted action from the list of completedActions
        data.companyActions = data.companyActions.filter(
          (item) => item?.id !== result.completeCompanyAction.id
        )
      }
      return data
    }
  )
}
