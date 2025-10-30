// 密钥API - 继承BaseAPI
class SecretAPIClass extends BaseAPI {
    constructor() {
        super('secrets');
    }
}

// 创建单例实例
const SecretAPI = new SecretAPIClass();
