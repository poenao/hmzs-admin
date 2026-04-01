/** 企业列表项 */
export interface EnterpriseItem {
  // 企业基本信息
  id: number
  // 企业名称
  name: string
  // 企业类型
  contact: string
  // 企业地址
  contactNumber: string
  // 企业状态
  demoFlag: number // 0 或 1
}

/** 分页容器结构 */
export interface EnterprisePageData {
  total: number
  rows: EnterpriseItem[]
}

/** 查询参数 */
export interface EnterpriseQueryParams {
  name?: string // 企业名称模糊搜索
  page?: number // 页码，不传默认1
  pageSize?: number // 每页条数，不传默认10
}
/**
 *   所属行业
 */
export interface Industry {
  /**
   * 行业code
   */
  industryCode: number
  /**
   * 行业名称
   */
  industryName: string
}

/**
 * 企业详情
 */
export interface EnterpriseDetail {
  /**
   * 企业id
   */
  id: string
  /**
   * 企业名称
   */
  name: string
  /**
   * 企业法人
   */
  legalPerson: string
  /**
   * 注册地址
   */
  registeredAddress: string
  /**
   * 行业编号
   */
  industryCode: string
  /**
   * 上传文件url
   */
  businessLicenseUrl: string
  /**
   * 上传文件id
   */
  businessLicenseId: string
  /**
   * 企业联系人
   */
  contact: string
  /**
   * 企业联系方式
   */
  contactNumber: string
}

/**
 * 添加企业参数
 */
export interface EnterpriseParams {
  /**
   * 企业id（编辑时存在）
   */
  id?: string
  /**
   * 企业名称
   */
  name: string
  /**
   * 企业法人
   */
  legalPerson: string
  /**
   * 注册地址
   */
  registeredAddress: string
  /**
   * 行业编号
   */
  industryCode: string
  /**
   * 上传文件url
   */
  businessLicenseUrl: string
  /**
   * 上传文件id
   */
  businessLicenseId: string
  /**
   * 企业联系人
   */
  contact: string
  /**
   * 企业联系方式
   */
  contactNumber: string
  rentList?: Datum[]
}

export interface EnterpriseFile {
  /**
   * 主键id
   */
  id: string
  /**
   * 上传文件名称
   */
  name: string
  /**
   * 上传附件url
   */
  url: string
}

/**
 * 添加租赁合同信息
 */
export interface Rent {
  /**
   * 租赁楼宇id
   */
  buildingId: number
  /**
   * 合同附件id
   */
  contractId: number
  /**
   * 合同附件url
   */
  contractUrl: string
  /**
   * 租赁结束日期
   */
  endTime: string
  /**
   * 企业id
   */
  enterpriseId: number
  /**
   * 开始日期
   */
  startTime: string
  /**
   * 操作类型，添加合同0，续签合同1
   */
  type: number
}
/**
 * 企业合同详情列表
 */

export interface Datum {
  buildingId?: number
  buildingName?: string
  /**
   * 租赁结束时间
   */
  endTime?: string
  /**
   * 是否可以退租
   */
  exitFlag?: number
  /**
   * 租赁主键
   */
  id?: string
  /**
   * 楼宇名称
   */
  name?: string
  /**
   * 是否可以续租
   */
  renewFlag?: number
  /**
   * 租赁开始时间
   */
  startTime?: string
  /**
   * 合同的租赁状态0待生效1生效中2已到期3已退租
   * 生效中，只能续签一次，续签后，续签的合同退租后，才可以退租
   */
  status?: number
}
export interface EnterpriseDetail {
  /**
   * 上传文件id
   */
  businessLicenseId: number
  /**
   * 上传的营业执照名字
   */
  businessLicenseName: string
  /**
   * 上传文件url
   */
  businessLicenseUrl: string
  /**
   * 企业联系人
   */
  contact: string
  /**
   * 企业联系方式
   */
  contactNumber: string
  /**
   * 企业id
   */
  id: number
  /**
   * 行业编号
   */
  industryCode: number
  /**
   * 行业名称
   */
  industryName: string
  /**
   * 企业法人
   */
  legalPerson: string
  /**
   * 企业名称
   */
  name: string
  /**
   * 注册地址
   */
  registeredAddress: string
  rent: Rent[]
  [property: string]: any
}

export interface Rent {
  /**
   * 租赁合同id
   */
  contractId: number
  /**
   * 租赁合同名称
   */
  contractName: string
  /**
   * 租赁合同url
   */
  contractUrl: string
  /**
   * 信息录入时间
   */
  createTime: string
  /**
   * 租赁截止时间
   */
  endTime: string
  /**
   * 租赁主键
   */
  id: number
  /**
   * 楼宇名称
   */
  name: string
  /**
   * 租赁起始时间
   */
  startTime: string
  /**
   * 合同的租赁状态0待生效1生效中2已到期3已退租。
   * 生效中，只能续签一次，续签后，续签的合同退租后，才可以退租
   */
  status: number
  [property: string]: any
}
