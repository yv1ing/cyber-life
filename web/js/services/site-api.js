// 站点API - 继承BaseAPI
class SiteAPIClass extends BaseAPI {
    constructor() {
        super('sites');
    }
}

// 创建单例实例
const SiteAPI = new SiteAPIClass();
