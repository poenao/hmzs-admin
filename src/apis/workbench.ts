import { request } from '@/utils/reuqest'

export const getWorkbenchAPI = () => {
  return request('/park/statistics/info', 'GET')
}
