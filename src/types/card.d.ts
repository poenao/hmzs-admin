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

// 支付方式枚举
export enum PaymentMethod {
  Alipay = 'Alipay',
  Cash = 'Cash',
  WeChat = 'WeChat'
}

// 新增/编辑通用基础参数（完全对齐接口文档必填项）
export interface CardParams {
  carBrand: string
  cardEndDate: string
  cardStartDate: string
  carNumber: string
  paymentAmount: number
  paymentMethod: PaymentMethod | string
  personName: string
  phoneNumber: string
  carInfoId: number
  rechargeId: number
}

// 编辑接口专属参数：基础参数 + 必须的id字段
export interface UpdateCardParams extends CardParams {
  id: number
}

// 月卡详情返回类型
export interface CardDetail {
  carBrand: string
  cardEndDate: string
  cardStartDate: string
  carInfoId: number
  carNumber: string
  paymentAmount: number
  paymentMethod: string
  personName: string
  phoneNumber: string
  rechargeId: number
  id: number
}
