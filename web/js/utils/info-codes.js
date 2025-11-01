// 信息码常量定义（对应后端 internal/constant/info_code.go）
const InfoCodes = {
    // 系统内部错误
    INTERNAL_ERROR: 110001,
    FAILED_TO_IMPORT: 110002,
    SUCCESSFUL_IMPORT: 100002,
    FAILED_TO_EXPORT: 110003,
    SUCCESSFUL_EXPORT: 100003,

    // 请求参数相关
    INVALID_REQUEST_HEADER: 110011,
    INVALID_REQUEST_PARAMS: 110012,

    // 权限认证相关
    EXPIRED_TOKEN: 110023,
    INVALID_TOKEN: 110024,
    FAILED_TO_LOGIN: 110025,
    SUCCESSFUL_LOGIN: 100025,
    FAILED_TO_LOGOUT: 110026,
    SUCCESSFUL_LOGOUT: 100026,

    // 数据操作相关
    FAILED_TO_CREATE: 110031,
    SUCCESSFUL_CREATE: 100031,
    FAILED_TO_DELETE: 110032,
    SUCCESSFUL_DELETE: 100032,
    FAILED_TO_UPDATE: 110033,
    SUCCESSFUL_UPDATE: 100033,
    FAILED_TO_FIND: 110034,
    SUCCESSFUL_FIND: 100034,
    FAILED_TO_UPLOAD: 110035,
    SUCCESSFUL_UPLOAD: 100035,

    // 其它附加提示
    RECORD_NOT_FOUND: 210001,
    USERNAME_ALREADY_EXISTS: 210002,
};

// 信息码到国际化键的映射
const InfoCodeMessages = {
    // 系统内部错误
    [InfoCodes.INTERNAL_ERROR]: 'api.error.internalError',
    [InfoCodes.FAILED_TO_IMPORT]: 'api.error.failedToImport',
    [InfoCodes.SUCCESSFUL_IMPORT]: 'api.success.successfulImport',
    [InfoCodes.FAILED_TO_EXPORT]: 'api.error.failedToExport',
    [InfoCodes.SUCCESSFUL_EXPORT]: 'api.success.successfulExport',

    // 请求参数相关
    [InfoCodes.INVALID_REQUEST_HEADER]: 'api.error.invalidRequestHeader',
    [InfoCodes.INVALID_REQUEST_PARAMS]: 'api.error.invalidRequestParams',

    // 权限认证相关
    [InfoCodes.EXPIRED_TOKEN]: 'api.error.expiredToken',
    [InfoCodes.INVALID_TOKEN]: 'api.error.invalidToken',
    [InfoCodes.FAILED_TO_LOGIN]: 'api.error.failedToLogin',
    [InfoCodes.SUCCESSFUL_LOGIN]: 'api.success.successfulLogin',
    [InfoCodes.FAILED_TO_LOGOUT]: 'api.error.failedToLogout',
    [InfoCodes.SUCCESSFUL_LOGOUT]: 'api.success.successfulLogout',

    // 数据操作相关
    [InfoCodes.FAILED_TO_CREATE]: 'api.error.failedToCreate',
    [InfoCodes.SUCCESSFUL_CREATE]: 'api.success.successfulCreate',
    [InfoCodes.FAILED_TO_DELETE]: 'api.error.failedToDelete',
    [InfoCodes.SUCCESSFUL_DELETE]: 'api.success.successfulDelete',
    [InfoCodes.FAILED_TO_UPDATE]: 'api.error.failedToUpdate',
    [InfoCodes.SUCCESSFUL_UPDATE]: 'api.success.successfulUpdate',
    [InfoCodes.FAILED_TO_FIND]: 'api.error.failedToFind',
    [InfoCodes.SUCCESSFUL_FIND]: 'api.success.successfulFind',
    [InfoCodes.FAILED_TO_UPLOAD]: 'api.error.failedToUpload',
    [InfoCodes.SUCCESSFUL_UPLOAD]: 'api.success.successfulUpload',

    // 其它附加提示
    [InfoCodes.RECORD_NOT_FOUND]: 'api.error.recordNotFound',
    [InfoCodes.USERNAME_ALREADY_EXISTS]: 'api.error.usernameAlreadyExists',
};

/**
 * 根据信息码获取对应的国际化消息
 * @param {number} code - 信息码
 * @returns {string} 国际化消息键
 */
function getMessageKeyByCode(code) {
    return InfoCodeMessages[code] || null;
}

/**
 * 判断信息码是否表示成功
 * @param {number} code - 信息码
 * @returns {boolean}
 */
function isSuccessCode(code) {
    // 成功的信息码一般以 100 开头
    return code >= 100000 && code < 110000;
}

/**
 * 判断信息码是否表示错误
 * @param {number} code - 信息码
 * @returns {boolean}
 */
function isErrorCode(code) {
    // 错误的信息码一般以 110 或 210 开头
    return code >= 110000 || (code >= 210000 && code < 220000);
}
