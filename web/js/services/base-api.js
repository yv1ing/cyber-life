// API基类 - 提供通用的CRUD操作和CSV导入导出
const API_BASE_URL = '/api';

class BaseAPI {
    constructor(resource) {
        this.resource = resource; // 例如: 'accounts', 'hosts', 'secrets'
        this.baseUrl = `${API_BASE_URL}/${resource}`;
    }

    /**
     * 创建记录
     * @param {Object} data - 记录数据
     * @returns {Promise<Object>}
     */
    create(data) {
        return HTTP.post(`${this.baseUrl}/create`, data);
    }

    /**
     * 删除记录
     * @param {number|Array<number>} ids - 单个ID或ID数组
     * @returns {Promise<Object>}
     */
    delete(ids) {
        const idArray = Array.isArray(ids) ? ids : [ids];
        const idField = `${this.resource.slice(0, -1)}_ids`; // accounts -> account_ids
        return HTTP.request(`${this.baseUrl}/delete`, {
            method: 'DELETE',
            body: JSON.stringify({ [idField]: idArray })
        });
    }

    /**
     * 更新记录
     * @param {number} id - 记录ID
     * @param {Object} data - 更新数据
     * @returns {Promise<Object>}
     */
    update(id, data) {
        const idField = `${this.resource.slice(0, -1)}_id`; // accounts -> account_id
        return HTTP.put(`${this.baseUrl}/update`, {
            [idField]: parseInt(id),
            ...data
        });
    }

    /**
     * 查找记录
     * @param {string} keyword - 搜索关键词
     * @param {number} page - 页码
     * @param {number} pageSize - 每页大小
     * @returns {Promise<Object>}
     */
    find(keyword = '', page = 1, pageSize = 10) {
        return HTTP.get(`${this.baseUrl}/find`, { keyword, page, size: pageSize });
    }

    /**
     * 列表查询
     * @param {number} page - 页码
     * @param {number} pageSize - 每页大小
     * @returns {Promise<Object>}
     */
    list(page = 1, pageSize = 10) {
        return HTTP.get(`${this.baseUrl}/list`, { page, size: pageSize });
    }

    /**
     * 导出CSV
     * @returns {Promise<void>}
     */
    async exportCSV() {
        const date = new Date().toISOString().slice(0, 10);
        const filename = `${this.resource}_${date}.csv`;
        return CSVHandler.exportCSV(`${this.baseUrl}/export`, filename);
    }

    /**
     * 导入CSV
     * @param {File} file - CSV文件
     * @returns {Promise<Object>}
     */
    async importCSV(file) {
        return CSVHandler.importCSV(`${this.baseUrl}/import`, file);
    }
}
