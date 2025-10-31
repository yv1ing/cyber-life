// 表单管理器 - 负责表单的打开、提交等操作
class AdminFormManager {
    constructor(dataManager) {
        this.dataManager = dataManager;
        this.editModal = null;
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
            setTimeout(() => {
                Object.entries(item.ports).forEach(([port, service]) => {
                    PortManager.add('#ports-list', port, service);
                });
            }, 0);
        }

        this.editModal.show();
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
                await config.api.update(id, data);
            } else {
                await config.api.create(data);
            }

            Toast.success(langManager.t('accounts.saveSuccess'));
            this.editModal.close();
            this.dataManager.loadData(this.dataManager.currentPageNum, this.dataManager.currentKeyword);

        } catch (error) {
            Toast.error(error.message || langManager.t('toast.saveFailed'));
            console.error(error);
        } finally {
            saveBtn.disabled = false;
            saveBtn.innerHTML = originalText;
        }
    }
}
