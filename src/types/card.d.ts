/**
 * ApifoxModel
 * @description 请求信息列表
 */
export interface ApifoxModel {
  /**
   * 状态 '0':可用，'1':已过期
   */
  cardStatus?: string
  /**
   * 车牌号
   */
  carNumber?: string
  /**
   * 页数
   */
  page: string
  /**
   * 条数
   */
  pageSize: string
  /**
   * 车主姓名
   */
  personName?: string
}
/**
 * 数据
 */
export interface CardListData {
  rows: Card[]
  /**
   * 数据条数
   */
  total: number
}

export interface Card {
  /**
   * 车辆品牌
   */
  carBrand: string
  /**
   * 月卡状态 0可用，1已过期
   */
  cardStatus: string
  /**
   * 车牌号
   */
  carNumber: string
  /**
   * 月卡车辆id
   */
  id: number
  /**
   * 车主姓名
   */
  personName: string
  /**
   * 联系方式
   */
  phoneNumber: string
  /**
   * 剩余有效天数
   */
  totalEffectiveDate: number
}

/**
 * empty object
 */
/**
 * 数据
 */
export interface CardListData {
  rows: Card[]
  total: number
}

export interface Card {
  carBrand: string
  cardStatus: string
  carNumber: string
  id: number
  personName: string
  phoneNumber: string // 改为 string
  totalEffectiveDate: number
}

export interface CardParams {
  carBrand: string
  cardEndDate: string
  cardStartDate: string
  carNumber: string
  paymentAmount: string | number // 金额可能是数字
  paymentMethod: PaymentMethod
  personName: string
  phoneNumber: string // 修复：改为 string，不要用枚举限制死
}

export enum PaymentMethod {
  Alipay = 'Alipay',
  Cash = 'Cash',
  WeChat = 'WeChat'
}
