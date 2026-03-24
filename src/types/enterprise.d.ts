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
}

export interface EnterpriseFile {
    /**
     * 主键id
     */
    id: string;
    /**
     * 上传文件名称
     */
    name: string;
    /**
     * 上传附件url
     */
    url: string;
}

/**
 * 添加租赁合同信息
 */
export interface Rent {
    /**
     * 租赁楼宇id
     */
    buildingId: number;
    /**
     * 合同附件id
     */
    contractId: number;
    /**
     * 合同附件url
     */
    contractUrl: string;
    /**
     * 租赁结束日期
     */
    endTime: string;
    /**
     * 企业id
     */
    enterpriseId: number;
    /**
     * 开始日期
     */
    startTime: string;
    /**
     * 操作类型，添加合同0，续签合同1
     */
    type: number;

}
