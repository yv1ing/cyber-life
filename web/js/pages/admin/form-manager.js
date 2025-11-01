// 表单管理器 - 负责表单的打开、提交等操作
class AdminFormManager {
    constructor(dataManager) {
        this.dataManager = dataManager;
        this.editModal = null;
        this.originalData = null; // 保存原始数据，用于比较
    }

    /**
     * 初始化模态框
     */
    initModal() {
        this.editModal = new Modal('edit-modal-overlay');

        document.getElementById('edit-modal-close').addEventListener('click', () => this.editModal.close());
        document.getElementById('edit-modal-cancel').addEventListener('click', () => this.editModal.close());
        document.getElementById('edit-modal-save').addEventListener('click', () => this._handleSave());
    }

    /**
     * 打开编辑模态框
     * @param {Object|null} item - 数据项（编辑时）
     */
    openEditModal(item = null) {
        const config = PageConfig[this.dataManager.currentPage];

        // 保存原始数据（深拷贝）
        this.originalData = item ? JSON.parse(JSON.stringify(item)) : null;

        // 设置标题
        const title = langManager.t(config.title);
        document.getElementById('edit-modal-title').textContent = item ?
            `${langManager.t('common.edit')} ${title}` :
            `${langManager.t('common.create')} ${title}`;

        // 设置 ID
        document.getElementById('edit-id').value = item ? (item.ID || item.id || '') : '';

        // 生成表单字段
        const formFields = document.getElementById('form-fields');
        formFields.innerHTML = config.fields.map(field => {
            if (field.type === 'group') {
                const groupFieldsHTML = field.fields.map(f => FormGenerator.generateField(f, item)).join('');
                return `<div class="form-row">${groupFieldsHTML}</div>`;
            }
            return FormGenerator.generateField(field, item);
        }).join('');

        FormGenerator.enhancePasswordFields(formFields);

        // 如果是编辑模式且有端口数据，填充端口列表
        if (item && item.ports && typeof item.ports === 'object') {
            requestAnimationFrame(() => {
                Object.entries(item.ports).forEach(([port, service]) => {
                    PortManager.add('#ports-list', port, service);
                });
            });
        }

        // 初始化 Logo 管理器（如果有 logo 字段）
        const logoField = config.fields.find(f => f.type === 'logo');
        if (logoField) {
            requestAnimationFrame(() => {
                LogoManager.init(logoField, this.dataManager.currentPage);
            });
        }

        this.editModal.show();
    }

    /**
     * 比较数据差异，返回发生改变的字段
     * @param {Object} newData - 新数据
     * @param {Object} originalData - 原始数据
     * @returns {Object|null} 改变的字段，如果没有改变返回null
     */
    _getChangedFields(newData, originalData) {
        const changes = {};
        let hasChanges = false;

        for (const key in newData) {
            const newValue = newData[key];
            const oldValue = originalData[key];

            // 处理不同类型的比较
            if (typeof newValue === 'object' && typeof oldValue === 'object') {
                // 对象类型（如ports）
                if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
                    changes[key] = newValue;
                    hasChanges = true;
                }
            } else {
                // 基本类型
                // 将undefined和null视为空字符串
                const normalizedNew = newValue === undefined || newValue === null ? '' : String(newValue);
                const normalizedOld = oldValue === undefined || oldValue === null ? '' : String(oldValue);

                if (normalizedNew !== normalizedOld) {
                    changes[key] = newValue;
                    hasChanges = true;
                }
            }
        }

        return hasChanges ? changes : null;
    }

    /**
     * 处理保存
     * @private
     * @returns {Promise<void>}
     */
    async _handleSave() {
        const config = PageConfig[this.dataManager.currentPage];
        const form = document.getElementById('edit-form');

        if (!FormGenerator.validate(form)) {
            return;
        }

        const id = document.getElementById('edit-id').value;
        const saveBtn = document.getElementById('edit-modal-save');
        saveBtn.disabled = true;
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = `<span class="loading"></span> ${langManager.t('common.loading')}`;

        try {
            const data = FormGenerator.collectData(config.fields);

            if (id) {
                // 更新模式：只发送改变的字段
                const changedFields = this._getChangedFields(data, this.originalData);

                if (!changedFields) {
                    Toast.info(langManager.t('toast.noDataChanged'));
                    this.editModal.close();
                    return;
                }

                // API调用会自动显示成功或错误提示
                await config.api.update(id, changedFields, { showSuccessToast: true });
            } else {
                // 创建模式：发送所有字段
                // API调用会自动显示成功或错误提示
                await config.api.create(data, { showSuccessToast: true });
            }

            this.editModal.close();
            this.dataManager.loadData(this.dataManager.currentPageNum, this.dataManager.currentKeyword);

        } catch (error) {
            // 错误已在HTTP层自动处理
        } finally {
            saveBtn.disabled = false;
            saveBtn.innerHTML = originalText;
        }
    }
}
