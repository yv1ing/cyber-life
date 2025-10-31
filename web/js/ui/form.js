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
                        value="${this._escapeHtml(numValue)}"
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
                    >${this._escapeHtml(value)}</textarea>
                ` : `
                    <input
                        type="${field.type}"
                        id="field-${field.key}"
                        class="input-field"
                        value="${this._escapeHtml(value)}"
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
                        value="${this._escapeHtml(value)}"
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
                }
                return;
            }

            const fieldElement = document.getElementById(`field-${field.key}`);
            if (!fieldElement) return;

            const value = fieldElement.value.trim();

            // 必填字段必须有值，可选字段只在有值时添加
            if (field.required || value) {
                // 处理 JSON 类型字段
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

    static _escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
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
            <input type="number" class="input-field port-number" placeholder="${langManager.t('hosts.portNumber')}" value="${this._escapeHtml(port)}" min="1" max="65535" />
            <input type="text" class="input-field port-service" placeholder="${langManager.t('hosts.portService')}" value="${this._escapeHtml(service)}" />
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
    },

    _escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};
