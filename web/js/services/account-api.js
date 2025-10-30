// 账号API - 继承BaseAPI
class AccountAPIClass extends BaseAPI {
    constructor() {
        super('accounts');
    }
}

// 创建单例实例
const AccountAPI = new AccountAPIClass();
