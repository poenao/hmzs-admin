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
 * empty object
 */
export interface EnterpriseParams {
    /**
     * 上传文件id
     */
    businessLicenseId: string;
    /**
     * 上传文件rl
     */
    businessLicenseUrl: string;
    /**
     * 企业联系人
     */
    contact: string;
    /**
     * 企业联系方式
     */
    contactNumber: string;
    /**
     * 行业编号
     */
    industryCode: string;
    /**
     * 企业法人
     */
    legalPerson: string;
    /**
     * 企业名称
     */
    name: string;
    /**
     * 注册地址
     */
    registeredAddress: string;
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