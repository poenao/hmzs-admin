/**
 * empty object
 */
export interface EmptyObject {
  /**
   * 报文code:正常返回1000其他返回错误码
   */
  code: number
  data: Data
  /**
   * 报文信息
   */
  msg: string
}

export interface Data {
  /**
   * 概况
   */
  base: Base
  /**
   * 企业名称
   */
  parkIncome: ParkIncome
  /**
   * 园区行业统计
   */
  parkIndustry: ParkIndustry[]
}

/**
 * 概况
 */
export interface Base {
  /**
   * 楼宇总数
   */
  buildingTotal: number
  /**
   * 一体杆总数
   */
  chargePoleTotal: number
  /**
   * 企业总数
   */
  enterpriseTotal: number
  /**
   * 停车位总数
   */
  parkingTotal: number
}

/**
 * 企业名称
 */
export interface ParkIncome {
  /**
   * x轴月份信息
   */
  xMonth: string[]
  /**
   * y轴收入信息
   */
  yIncome: number[]
}

export interface ParkIndustry {
  /**
   * 行业名称
   */
  name: string
  /**
   * 该行业的总数
   */
  value: number
}
