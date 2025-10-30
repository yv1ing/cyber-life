// 主机API - 继承BaseAPI
class HostAPIClass extends BaseAPI {
    constructor() {
        super('hosts');
    }
}

// 创建单例实例
const HostAPI = new HostAPIClass();
