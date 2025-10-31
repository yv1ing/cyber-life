// 表单生成和验证器
class FormGenerator {
    /**
     * 生成表单字段HTML
     * @param {Object} field - 字段配置
     * @param {Object} item - 数据项（编辑时）
     * @returns {string} 字段HTML
     */
    static generateField(field, item = null) {
        let value = item ? (item[field.key] || '') : '';

        // 处理端口列表类型
        if (field.type === 'portlist') {
            return this._generatePortListField(field);
        }

        // 处理容量类型
        if (field.type === 'capacity') {
            return this._generateCapacityField(field, value);
        }

        // 处理 Logo 类型
        if (field.type === 'logo') {
            return this._generateLogoField(field, value);
        }

        // 处理 JSON 类型字段
        if (field.type === 'json' && value && typeof value === 'object') {
            value = JSON.stringify(value, null, 2);
        }

        return this._generateRegularField(field, value);
    }

    static _generatePortListField(field) {
        return `
            <div class="input-group">
                <label class="input-label">
                    ${langManager.t(field.label)}${field.required ? ' *' : ''}
                </label>
                <div id="ports-list" class="ports-list"></div>
                <button type="button" class="btn-secondary add-port-btn" onclick="PortManager.add('#ports-list', '', '')" style="margin-top: 8px;">
                    <i class="fas fa-plus"></i> ${langManager.t('hosts.addPort')}
                </button>
            </div>
        `;
    }

    static _generateCapacityField(field, value) {
        let numValue = '';
        let unitValue = '';

        if (value) {
            if (field.unit === 'cores') {
                numValue = value;
                unitValue = 'cores';
            } else if (field.unit === 'storage') {
                const mb = parseInt(value) || 0;
                if (mb >= 1024 * 1024) {
                    numValue = (mb / (1024 * 1024)).toFixed(2).replace(/\.?0+$/, '');
                    unitValue = 'TB';
                } else if (mb >= 1024) {
                    numValue = (mb / 1024).toFixed(2).replace(/\.?0+$/, '');
                    unitValue = 'GB';
                } else {
                    numValue = mb;
                    unitValue = 'MB';
                }
            }
        }

        const placeholderText = field.placeholder ? langManager.t(field.placeholder) : '';

        return `
            <div class="input-group">
                <label class="input-label">
                    ${langManager.t(field.label)}${field.required ? ' *' : ''}
                </label>
                <div class="capacity-input-group">
                    <input
                        type="number"
                        id="field-${field.key}-value"
                        class="input-field capacity-value"
                        value="${Helpers.escapeHtml(numValue)}"
                        min="0"
                        step="${field.unit === 'cores' ? '1' : '0.01'}"
                        placeholder="${placeholderText}"
                    />
                    <select id="field-${field.key}-unit" class="input-field capacity-unit">
                        ${field.unit === 'cores' ? `
                            <option value="cores" ${unitValue === 'cores' ? 'selected' : ''}>核心</option>
                        ` : `
                            <option value="MB" ${unitValue === 'MB' ? 'selected' : ''}>MB</option>
                            <option value="GB" ${unitValue === 'GB' ? 'selected' : ''}>GB</option>
                            <option value="TB" ${unitValue === 'TB' ? 'selected' : ''}>TB</option>
                        `}
                    </select>
                </div>
            </div>
        `;
    }

    static _generateLogoField(field, value) {
        // 使用 data-value 属性存储图标文件名，在 Logo.init() 中动态设置正确的路径
        // 避免在初始渲染时加载错误的路径（如主机记录加载 /platform-icons/ 下的图标）
        return `
            <div class="input-group">
                <label class="input-label">
                    ${langManager.t(field.label)}${field.required ? ' *' : ''}
                </label>
                <div class="logo-input-group">
                    <div class="logo-preview-wrapper">
                        <img id="logo-preview" src="" alt="Logo" class="logo-preview" data-value="${Helpers.escapeHtml(value)}" style="display:none;"/>
                    </div>
                    <div class="logo-controls">
                        <div class="logo-grid-wrapper">
                            <div id="logo-grid" class="logo-grid"></div>
                        </div>
                    </div>
                    <div class="logo-right-section">
                        <input type="file" id="logo-file-input" accept=".jpg,.jpeg,.png" style="display:none" ${field.dependsOn ? 'disabled' : ''}/>
                        <button type="button" class="btn-secondary logo-upload-btn" ${field.dependsOn ? 'disabled' : ''} title="${field.dependsOn ? langManager.t('title.enterNameFirst', { name: '' }) : langManager.t('title.uploadNewLogo')}">
                            <i class="fas fa-upload"></i> 上传
                        </button>
                    </div>
                </div>
                <input type="hidden" id="field-${field.key}-value" value="${Helpers.escapeHtml(value)}"/>
            </div>
        `;
    }

    static _generateRegularField(field, value) {
        if (field.type === 'password') {
            return this._generatePasswordField(field, value);
        }

        return `
            <div class="input-group">
                <label class="input-label" for="field-${field.key}">
                    ${langManager.t(field.label)}${field.required ? ' *' : ''}
                </label>
                ${field.type === 'textarea' || field.type === 'json' ? `
                    <textarea
                        id="field-${field.key}"
                        class="input-field"
                        rows="${field.type === 'json' ? '5' : '3'}"
                        ${field.required ? 'required' : ''}
                        ${field.type === 'json' ? 'placeholder=\'{"22": "ssh", "80": "http"}\'' : ''}
                    >${Helpers.escapeHtml(value)}</textarea>
                ` : `
                    <input
                        type="${field.type}"
                        id="field-${field.key}"
                        class="input-field"
                        value="${Helpers.escapeHtml(value)}"
                        ${field.required ? 'required' : ''}
                    />
                `}
            </div>
        `;
    }

    static _generatePasswordField(field, value) {
        return `
            <div class="input-group">
                <label class="input-label" for="field-${field.key}">
                    ${langManager.t(field.label)}${field.required ? ' *' : ''}
                </label>
                <div class="password-input-wrapper">
                    <input
                        type="password"
                        id="field-${field.key}"
                        class="input-field"
                        value="${Helpers.escapeHtml(value)}"
                        ${field.required ? 'required' : ''}
                    />
                    <button
                        type="button"
                        class="input-action-btn password-generate"
                        data-target="field-${field.key}"
                        data-length="16"
                        data-i18n-title="common.generatePassword"
                        title="${langManager.t('common.generatePassword')}"
                    >
                        <i class="fas fa-random"></i>
                    </button>
                    <button
                        type="button"
                        class="input-action-btn password-toggle"
                        data-target="field-${field.key}"
                        data-i18n-title="common.showPassword"
                        title="${langManager.t('common.showPassword')}"
                    >
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * 收集表单数据
     * @param {Array} fields - 字段配置数组
     * @returns {Object} 表单数据
     */
    static collectData(fields) {
        const data = {};

        // 递归获取所有字段（包括group内的字段）
        const allFields = this._flattenFields(fields);

        allFields.forEach(field => {
            // 处理端口列表类型
            if (field.type === 'portlist') {
                const ports = PortManager.getAll('#ports-list');
                if (field.required && Object.keys(ports).length === 0) {
                    throw new Error(`${langManager.t(field.label)} 是必填项`);
                }
                data[field.key] = ports;
                return;
            }

            // 处理容量类型
            if (field.type === 'capacity') {
                const capacityData = this._collectCapacityData(field);
                if (capacityData !== null) {
                    data[field.key] = capacityData;
                } else {
                    data[field.key] = 0;
                }
                return;
            }

            // 处理 Logo 类型
            if (field.type === 'logo') {
                const logoValue = document.getElementById(`field-${field.key}-value`)?.value.trim() || '';
                // 始终包含logo字段，即使为空字符串
                data[field.key] = logoValue;
                return;
            }

            const fieldElement = document.getElementById(`field-${field.key}`);
            if (!fieldElement) return;

            const value = fieldElement.value.trim();

            // 验证必填字段
            if (field.required && !value) {
                throw new Error(`${langManager.t(field.label)} 是必填项`);
            }

            // 处理不同类型的字段，始终包含所有字段（即使为空）
            if (field.type === 'json') {
                try {
                    data[field.key] = value ? JSON.parse(value) : {};
                } catch (e) {
                    throw new Error(`${langManager.t(field.label)} 格式错误`);
                }
            } else if (field.type === 'number') {
                data[field.key] = value ? parseInt(value, 10) : 0;
            } else {
                data[field.key] = value;
            }
        });

        return data;
    }

    static _collectCapacityData(field) {
        const valueInput = document.getElementById(`field-${field.key}-value`);
        const unitSelect = document.getElementById(`field-${field.key}-unit`);

        if (!valueInput || !unitSelect) return null;

        const numValue = parseFloat(valueInput.value) || 0;
        const unit = unitSelect.value;

        if (field.unit === 'cores') {
            return Math.floor(numValue);
        } else if (field.unit === 'storage') {
            let mbValue = numValue;
            if (unit === 'GB') {
                mbValue = numValue * 1024;
            } else if (unit === 'TB') {
                mbValue = numValue * 1024 * 1024;
            }
            return Math.floor(mbValue);
        }

        return null;
    }

    static _flattenFields(fields) {
        const result = [];
        fields.forEach(field => {
            if (field.type === 'group') {
                result.push(...this._flattenFields(field.fields));
            } else {
                result.push(field);
            }
        });
        return result;
    }

    static enhancePasswordFields(container) {
        if (!container) return;

        container.querySelectorAll('.password-input-wrapper').forEach(wrapper => {
            const input = wrapper.querySelector('input.input-field');
            if (!input) return;

            const generateBtn = wrapper.querySelector('.password-generate');
            if (generateBtn && !generateBtn.dataset.bound) {
                generateBtn.dataset.bound = 'true';
                generateBtn.addEventListener('click', () => {
                    const length = parseInt(generateBtn.dataset.length, 10) || 16;
                    const password = FormGenerator.generateRandomPassword(length);
                    input.value = password;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                });
            }

            const toggleBtn = wrapper.querySelector('.password-toggle');
            if (toggleBtn && !toggleBtn.dataset.bound) {
                toggleBtn.dataset.bound = 'true';
                toggleBtn.addEventListener('click', () => {
                    const icon = toggleBtn.querySelector('i');
                    const isVisible = input.type === 'text';
                    input.type = isVisible ? 'password' : 'text';
                    const titleKey = isVisible ? 'common.showPassword' : 'common.hidePassword';
                    toggleBtn.setAttribute('data-i18n-title', titleKey);
                    toggleBtn.setAttribute('title', langManager.t(titleKey));
                    if (icon) {
                        icon.classList.toggle('fa-eye');
                        icon.classList.toggle('fa-eye-slash');
                    }
                });
            }
        });
    }

    static generateRandomPassword(length = 16) {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
        const result = [];

        if (window.crypto && window.crypto.getRandomValues) {
            const randomValues = new Uint32Array(length);
            window.crypto.getRandomValues(randomValues);
            for (let i = 0; i < length; i++) {
                result.push(charset[randomValues[i] % charset.length]);
            }
        } else {
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * charset.length);
                result.push(charset[randomIndex]);
            }
        }

        return result.join('');
    }

    /**
     * 验证表单
     * @param {HTMLFormElement} formElement - 表单元素
     * @returns {boolean} 是否有效
     */
    static validate(formElement) {
        const inputs = formElement.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = 'var(--error-color)';

                const group = input.closest('.input-group') || input.parentNode;
                if (!group) return;

                let errorMsg = group.querySelector('.error-msg');
                if (!errorMsg) {
                    errorMsg = document.createElement('span');
                    errorMsg.className = 'error-msg';
                    errorMsg.style.color = 'var(--error-color)';
                    errorMsg.style.fontSize = '12px';
                    errorMsg.style.marginTop = '4px';
                    group.appendChild(errorMsg);
                }
                errorMsg.textContent = langManager.t('validation.required');

                input.addEventListener('focus', function clearError() {
                    input.style.borderColor = '';
                    if (errorMsg) errorMsg.textContent = '';
                    input.removeEventListener('focus', clearError);
                });
            }
        });

        return isValid;
    }
}

// 端口映射管理器
const PortManager = {
    add(containerSelector = '#ports-list', port = '', service = '') {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        const portItem = document.createElement('div');
        portItem.className = 'port-item';
        portItem.innerHTML = `
            <input type="number" class="input-field port-number" placeholder="${langManager.t('hosts.portNumber')}" value="${Helpers.escapeHtml(port)}" min="1" max="65535" />
            <input type="text" class="input-field port-service" placeholder="${langManager.t('hosts.portService')}" value="${Helpers.escapeHtml(service)}" />
            <button type="button" class="btn-icon delete-port" onclick="PortManager.remove(this)" title="${langManager.t('common.delete')}">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(portItem);
    },

    remove(button) {
        const portItem = button.closest('.port-item');
        if (portItem) {
            portItem.remove();
        }
    },

    getAll(containerSelector = '#ports-list') {
        const container = document.querySelector(containerSelector);
        if (!container) return {};

        const portItems = container.querySelectorAll('.port-item');
        const ports = {};

        portItems.forEach(item => {
            const portNumber = item.querySelector('.port-number').value.trim();
            const portService = item.querySelector('.port-service').value.trim();

            if (portNumber && portService) {
                ports[parseInt(portNumber)] = portService;
            }
        });

        return ports;
    }
};

// Logo 管理器
const LogoManager = {
    currentIcons: [],
    moduleConfig: null,

    // 模块配置映射
    moduleConfigs: {
        accounts: {
            apiBase: '/api/accounts',
            staticPath: '/platform-icons',
            paramName: 'platform',
            displayName: '平台',
            uploadApi: '/api/icons/upload-platform-icon',
            listApi: '/api/icons/platform-icons'
        },
        hosts: {
            apiBase: '/api/hosts',
            staticPath: '/os-icons',
            paramName: 'os',
            displayName: '操作系统',
            uploadApi: '/api/icons/upload-os-icon',
            listApi: '/api/icons/os-icons'
        },
        secrets: {
            apiBase: '/api/secrets',
            staticPath: '/platform-icons',
            paramName: 'platform',
            displayName: '平台',
            uploadApi: '/api/icons/upload-platform-icon',
            listApi: '/api/icons/platform-icons'
        },
        sites: {
            apiBase: '/api/sites',
            staticPath: '/site-icons',
            paramName: 'site',
            displayName: '站点',
            uploadApi: '/api/icons/upload-site-icon',
            listApi: '/api/icons/site-icons'
        }
    },

    async init(fieldConfig, module = 'accounts') {
        // 设置当前模块配置
        this.moduleConfig = this.moduleConfigs[module] || this.moduleConfigs.accounts;

        // 立即更新预览图片的路径（从 data-value 属性读取值）
        const preview = document.getElementById('logo-preview');
        const valueInput = document.getElementById('field-logo-value');
        if (preview) {
            // 从 data-value 属性或 valueInput 获取当前值
            const currentValue = preview.dataset.value || (valueInput ? valueInput.value : '');

            if (currentValue) {
                preview.src = `${this.moduleConfig.staticPath}/${currentValue}`;
            } else {
                preview.src = `${this.moduleConfig.staticPath}/default.png`;
            }

            // 显示图片
            preview.style.display = '';

            // 更新错误回退路径
            preview.onerror = function() {
                this.src = `${LogoManager.moduleConfig.staticPath}/default.png`;
            };
        }

        // 加载已有图标列表
        await this.loadIcons();

        // 绑定事件
        this.bindEvents(fieldConfig);
    },

    async loadIcons() {
        // 获取 JWT token
        const jwt_token = Storage.get('jwt_token');

        try {
            // 使用配置中的 API 路径
            const apiPath = this.moduleConfig.listApi;

            const response = await fetch(apiPath, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(jwt_token ? { 'Authorization': `Bearer ${jwt_token}` } : {})
                }
            });

            const data = await response.json();

            // 处理未授权
            if (response.status === 401) {
                Toast.error('登录已过期，请重新登录');
                Auth.logout();
                throw new Error('Unauthorized');
            }

            if (data.code === 200) {
                // 统一使用 data.icons
                this.currentIcons = data.data.icons || [];
                this.updateIconSelect();
            }
        } catch (error) {
            console.error('加载图标列表失败:', error);
        }
    },

    updateIconSelect() {
        const grid = document.getElementById('logo-grid');
        if (!grid) return;

        const currentValue = document.getElementById('field-logo-value')?.value || '';

        // 清空网格
        grid.innerHTML = '';

        // 添加默认图标
        const defaultItem = document.createElement('div');
        defaultItem.className = 'logo-grid-item';
        if (!currentValue || currentValue === 'default.png') {
            defaultItem.classList.add('selected');
        }
        defaultItem.innerHTML = `
            <img src="${this.moduleConfig.staticPath}/default.png" alt="默认图标" />
            <span class="logo-name">默认</span>
        `;
        defaultItem.addEventListener('click', () => {
            this.selectIcon('', grid);
        });
        grid.appendChild(defaultItem);

        // 添加其他图标（过滤掉 default.png）
        this.currentIcons.forEach(icon => {
            // 跳过 default.png，避免重复显示
            if (icon.toLowerCase() === 'default.png') {
                return;
            }

            const item = document.createElement('div');
            item.className = 'logo-grid-item';
            if (icon === currentValue) {
                item.classList.add('selected');
            }

            // 提取文件名（不含扩展名）作为显示名称
            const iconName = icon.replace(/\.(png|jpg|jpeg)$/i, '');

            item.innerHTML = `
                <img src="${this.moduleConfig.staticPath}/${icon}" alt="${iconName}" onerror="this.src='${this.moduleConfig.staticPath}/default.png'" />
                <span class="logo-name">${iconName}</span>
            `;
            item.addEventListener('click', () => {
                this.selectIcon(icon, grid);
            });
            grid.appendChild(item);
        });
    },

    selectIcon(iconFilename, grid) {
        const preview = document.getElementById('logo-preview');
        const valueInput = document.getElementById('field-logo-value');

        // 更新预览
        if (preview) {
            preview.src = iconFilename ? `${this.moduleConfig.staticPath}/${iconFilename}` : `${this.moduleConfig.staticPath}/default.png`;
        }

        // 更新隐藏值
        if (valueInput) {
            valueInput.value = iconFilename;
        }

        // 更新选中状态
        if (grid) {
            grid.querySelectorAll('.logo-grid-item').forEach(item => {
                item.classList.remove('selected');
            });
            event.currentTarget.classList.add('selected');
        }
    },

    bindEvents(fieldConfig) {
        const grid = document.getElementById('logo-grid');
        const uploadBtn = document.querySelector('.logo-upload-btn');
        const fileInput = document.getElementById('logo-file-input');
        const preview = document.getElementById('logo-preview');
        const valueInput = document.getElementById('field-logo-value');
        const rightSection = document.querySelector('.logo-right-section');

        // 上传按钮点击
        if (uploadBtn && fileInput) {
            uploadBtn.addEventListener('click', () => {
                if (fieldConfig.dependsOn) {
                    const platformInput = document.getElementById(`field-${fieldConfig.dependsOn}`);
                    if (!platformInput || !platformInput.value.trim()) {
                        alert(`请先输入${this.moduleConfig.displayName}名称`);
                        return;
                    }
                }
                fileInput.click();
            });
        }

        // 文件选择后上传
        if (fileInput) {
            fileInput.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const platformInput = document.getElementById(`field-${fieldConfig.dependsOn}`);
                const platform = platformInput ? platformInput.value.trim() : '';

                if (fieldConfig.dependsOn && !platform) {
                    alert(`请先输入${this.moduleConfig.displayName}名称`);
                    fileInput.value = '';
                    return;
                }

                await this.uploadLogo(file, platform);
                fileInput.value = '';
            });
        }

        // 监听平台名称变化，启用/禁用上传功能
        if (fieldConfig.dependsOn) {
            const platformInput = document.getElementById(`field-${fieldConfig.dependsOn}`);

            // 创建更新上传按钮标题的函数
            const updateUploadButtonTitle = () => {
                if (!uploadBtn || !platformInput) return;
                const hasValue = platformInput.value.trim() !== '';
                uploadBtn.title = hasValue
                    ? langManager.t('title.uploadNewLogo')
                    : langManager.t('title.enterNameFirst', { name: this.moduleConfig.displayName });
            };

            if (platformInput) {
                platformInput.addEventListener('input', (e) => {
                    const hasValue = e.target.value.trim() !== '';
                    if (rightSection) rightSection.style.opacity = hasValue ? '1' : '0.5';
                    if (uploadBtn) uploadBtn.disabled = !hasValue;
                    if (fileInput) fileInput.disabled = !hasValue;
                    updateUploadButtonTitle();
                });

                // 监听语言切换事件，更新按钮标题
                window.addEventListener('languagechange', updateUploadButtonTitle);

                // 初始化按钮标题
                updateUploadButtonTitle();
            }
        }
    },

    async uploadLogo(file, platform) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append(this.moduleConfig.paramName, platform);

        // 获取 JWT token
        const jwt_token = Storage.get('jwt_token');

        try {
            // 使用配置中的上传 API 路径
            const uploadPath = this.moduleConfig.uploadApi;

            const response = await fetch(uploadPath, {
                method: 'POST',
                headers: {
                    ...(jwt_token ? { 'Authorization': `Bearer ${jwt_token}` } : {})
                    // 不设置 Content-Type，让浏览器自动设置 multipart/form-data
                },
                body: formData
            });

            const data = await response.json();

            // 处理未授权
            if (response.status === 401) {
                Toast.error('登录已过期，请重新登录');
                Auth.logout();
                throw new Error('Unauthorized');
            }

            if (!response.ok) {
                throw new Error(data.info || '上传失败');
            }

            if (data.code === 200 && data.data.icon) {
                const iconFilename = data.data.icon;

                // 更新预览
                const preview = document.getElementById('logo-preview');
                if (preview) {
                    preview.src = `${this.moduleConfig.staticPath}/${iconFilename}`;
                }

                // 更新隐藏值
                const valueInput = document.getElementById('field-logo-value');
                if (valueInput) {
                    valueInput.value = iconFilename;
                }

                // 重新加载图标列表
                await this.loadIcons();

                alert('图标上传成功');
            } else {
                alert(data.info || '上传失败');
            }
        } catch (error) {
            console.error('上传图标失败:', error);
            alert(error.message || '上传失败');
        }
    }
};
