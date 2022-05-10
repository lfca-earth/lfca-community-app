const safeJsonStringify = require('safe-json-stringify');
import { getEntries } from './api'

export const fetchAllQuestionnaires = async () => {

    const res = await getEntries({
        content_type: 'questionnaire',
        include: 3,
        locale: 'en-US',
    })

    const stringifiedData = safeJsonStringify(res);
    const questionnaires = JSON.parse(stringifiedData);

    const byCountryCode = questionnaires.reduce((acc: any, q: any) => {
        acc[q.countryCode] = q
        return acc
    }, {})

    return byCountryCode
}
