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

                let errorMsg = input.nextElementSibling;
                if (!errorMsg || !errorMsg.classList.contains('error-msg')) {
                    errorMsg = document.createElement('span');
                    errorMsg.className = 'error-msg';
                    errorMsg.style.color = 'var(--error-color)';
                    errorMsg.style.fontSize = '12px';
                    errorMsg.style.marginTop = '4px';
                    input.parentNode.insertBefore(errorMsg, input.nextSibling);
                }
                errorMsg.textContent = '此字段为必填项';

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
