// 数据管理器 - 负责数据加载和渲染
class DataManager {
    constructor() {
        this.currentPage = 'accounts';
        this.currentPageNum = 1;
        this.pageSize = 10;
        this.isLoading = false;
        this.selectedIds = new Set();
        this.currentKeyword = '';
    }

    /**
     * 设置当前页面
     * @param {string} page - 页面名称
     */
    setCurrentPage(page) {
        this.currentPage = page;
        this.currentPageNum = 1;
        this.currentKeyword = '';
        this.selectedIds.clear();
        Storage.set('current_page', page);
    }

    /**
     * 加载数据
     * @param {number} pageNum - 页码
     * @param {string} keyword - 搜索关键词
     * @returns {Promise<void>}
     */
    async loadData(pageNum = 1, keyword = '') {
        if (this.isLoading) return;

        const config = PageConfig[this.currentPage];
        if (!config) {
            Toast.error(langManager.t('toast.pageConfigNotFound'));
            return;
        }

        const contentBody = document.getElementById('content-body');

        try {
            this.isLoading = true;
            this.currentPageNum = pageNum;
            this.currentKeyword = keyword;
            this.selectedIds.clear();

            // 显示加载状态
            contentBody.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; padding: 64px;">
                    <div class="loading"></div>
                </div>
            `;

            // 调用 API
            let response;
            if (keyword) {
                response = await config.api.find(keyword, pageNum, this.pageSize);
            } else {
                response = await config.api.list(pageNum, this.pageSize);
            }

            if (!response || !response.data) {
                throw new Error('数据格式错误');
            }

            const items = response.data.items || response.data.list || [];
            const total = response.data.total || 0;

            // 渲染表格
            TableRenderer.render(
                config,
                items,
                pageNum,
                total,
                this.pageSize,
                contentBody,
                {
                    onCheckboxChange: (event) => this._handleCheckboxChange(event),
                    onPageChange: (page) => this.loadData(page, this.currentKeyword),
                    onEmpty: () => this._updateBatchDeleteButton(),
                    onEdit: (item) => window.tableCallbacks?.edit(item),
                    onDelete: (id) => window.tableCallbacks?.delete(id)
                }
            );

            this._updateBatchDeleteButton();

        } catch (error) {
            contentBody.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon icon">${Icons.error}</div>
                    <div class="empty-title">加载失败</div>
                    <div class="empty-description">${error.message || '请稍后重试'}</div>
                </div>
            `;
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * 处理复选框变化
     * @param {Object} event - 复选框事件对象
     * @private
     */
    _handleCheckboxChange(event) {
        if (event.type === 'all') {
            if (event.checked) {
                event.ids.forEach(id => this.selectedIds.add(id));
            } else {
                this.selectedIds.clear();
            }
        } else if (event.type === 'single') {
            if (event.checked) {
                this.selectedIds.add(event.id);
            } else {
                this.selectedIds.delete(event.id);
            }
        }
        this._updateBatchDeleteButton();
    }

    /**
     * 更新批量删除按钮状态
     * @private
     */
    _updateBatchDeleteButton() {
        const batchDeleteBtn = document.getElementById('batch-delete-btn');
        if (this.selectedIds.size > 0) {
            batchDeleteBtn.style.display = 'flex';
            batchDeleteBtn.querySelector('span:last-child').textContent =
                `${langManager.t('common.batchDelete')} (${this.selectedIds.size})`;
        } else {
            batchDeleteBtn.style.display = 'none';
        }
    }

    /**
     * 批量删除
     * @returns {Promise<void>}
     */
    async batchDelete() {
        if (this.selectedIds.size === 0) {
            Toast.warning(langManager.t('toast.pleaseSelectItems'));
            return;
        }

        const count = this.selectedIds.size;
        const config = PageConfig[this.currentPage];

        Modal.confirm(
            langManager.t('common.confirm'),
            langManager.t('common.batchDeleteConfirm', { count: count }),
            async () => {
                try {
                    const idsArray = Array.from(this.selectedIds);
                    // API调用会自动显示成功或错误提示
                    await config.api.delete(idsArray, { showSuccessToast: true });
                    this.selectedIds.clear();
                    this.loadData(this.currentPageNum, this.currentKeyword);
                } catch (error) {
                    // 错误已在HTTP层自动处理
                }
            }
        );
    }

    /**
     * 删除单条记录
     * @param {number} id - 记录ID
     * @returns {Promise<void>}
     */
    async deleteItem(id) {
        const config = PageConfig[this.currentPage];

        Modal.confirm(
            langManager.t('common.confirm'),
            langManager.t('accounts.deleteConfirm'),
            async () => {
                try {
                    // API调用会自动显示成功或错误提示
                    await config.api.delete(id, { showSuccessToast: true });
                    this.loadData(this.currentPageNum, this.currentKeyword);
                } catch (error) {
                    // 错误已在HTTP层自动处理
                }
            }
        );
    }
}
