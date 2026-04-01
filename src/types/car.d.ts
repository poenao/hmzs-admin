/**
 * 请求参数
 * @param cardStatus 状态 '0':可用，'1':已过期
 * @param carNumber 车牌号
 * @param page 页数
 * @param pageSize 条数
 * @param personName 车主姓名
 * @return CarListParams
 * 
 */
export interface CarListParams {
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
  page: number
  /**
   * 条数
   */
  pageSize: number
  /**
   * 车主姓名
   */
  personName?: string
}

/**
 * 响应数据
 * @param rows 车辆列表
 * @param total 数据条数
 * @return CarListData
 * 
 */
export interface CarListData {
  rows: Car[]
  /**
   * 数据条数
   */
  total: number
}
/**
 * 车辆信息
 * @param carBrand 车辆品牌
 * @param cardStatus 月卡状态 0可用，1已过期
 * @param carNumber 车牌号
 * @param id 月卡车辆id
 * @param personName 车主姓名
 * @param phoneNumber 联系方式
 * @param totalEffectiveDate 剩余有效天数
 * @return Car
 */
export interface Car {
  /**
   * 车辆品牌
   */
  carBrand: string
  /**
   * 月卡状态 0可用，1已过期
   */
  cardStatus: number
  /**
   * 车牌号
   */
  carNumber: string
  /**
   * 月卡车辆id
   */
  id: string
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
