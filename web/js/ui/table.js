// 表格渲染器
class TableRenderer {
    /**
     * 渲染表格
     * @param {Object} config - 页面配置
     * @param {Array} items - 数据项
     * @param {number} pageNum - 当前页码
     * @param {number} total - 总数据量
     * @param {number} pageSize - 每页大小
     * @param {HTMLElement} container - 容器元素
     * @param {Object} callbacks - 回调函数集合
     */
    static render(config, items, pageNum, total, pageSize, container, callbacks = {}) {
        if (items.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon icon">${Icons.info}</div>
                    <div class="empty-title">${langManager.t('empty.noData')}</div>
                    <div class="empty-description">${langManager.t('empty.clickCreate')}</div>
                </div>
            `;
            if (callbacks.onEmpty) callbacks.onEmpty();
            return;
        }

        const totalPages = Math.ceil(total / pageSize);

        container.innerHTML = `
            <div class="data-table-wrapper">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th style="width: 50px">
                                <input type="checkbox" id="select-all-checkbox" class="table-checkbox" />
                            </th>
                            ${config.columns.map(col => `
                                <th${col.width ? ` style="width: ${col.width}"` : ''}>${langManager.t(col.label)}</th>
                            `).join('')}
                            <th style="width: 100px">${langManager.t('common.operation')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${items.map(item => this._renderRow(item, config)).join('')}
                    </tbody>
                </table>

                ${totalPages > 1 ? this._renderPagination(pageNum, totalPages, total, pageSize, callbacks.onPageChange) : ''}
            </div>
        `;

        // 初始化复选框事件
        if (callbacks.onCheckboxChange) {
            this._initCheckboxEvents(callbacks.onCheckboxChange);
        }
    }

    static _renderRow(item, config) {
        const itemJson = this._escapeHtml(JSON.stringify(item));
        const rowId = item.ID || item.id || this._generateId();

        return `
            <tr>
                <td>
                    <input type="checkbox" class="row-checkbox table-checkbox" data-id="${rowId}" />
                </td>
                ${config.columns.map(col => `
                    <td>${this._formatCellValue(item[col.key], col.format, rowId, item, col)}</td>
                `).join('')}
                <td>
                    <div class="table-actions">
                        <button class="action-btn edit" onclick='window.tableCallbacks.edit(${itemJson})' title="${langManager.t('common.edit')}">
                            <span class="icon">${Icons.edit}</span>
                        </button>
                        <button class="action-btn delete" onclick="window.tableCallbacks.delete(${rowId})" title="${langManager.t('common.delete')}">
                            <span class="icon">${Icons.delete}</span>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    static _formatCellValue(value, format, rowId, item, col) {
        if (value === null || value === undefined || value === '') return '-';

        switch (format) {
            case 'datetime':
                return DateUtils.formatDateTime(value);
            case 'date':
                return value ? value.split('T')[0] : '-';
            case 'password':
                return this._formatPassword(value, rowId);
            case 'platformLink':
                return this._formatPlatformLink(value, item, col);
            case 'json':
                return this._formatJson(value);
            case 'storage':
                return Formatters.formatStorage(value);
            default:
                return this._escapeHtml(String(value));
        }
    }

    static _formatPassword(value, rowId) {
        const uniqueId = `pwd-${rowId}`;
        const escapedValue = this._escapeHtml(String(value));
        return `
            <div style="display: flex; align-items: center; gap: 8px;">
                <span id="${uniqueId}" class="password-field" data-password="${escapedValue}">••••••••</span>
                <button class="btn-icon" onclick="TableRenderer.togglePassword('${uniqueId}')">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        `;
    }

    static _formatPlatformLink(value, item, col) {
        const url = item && col && col.urlKey ? item[col.urlKey] : '';
        const platformName = this._escapeHtml(String(value));
        if (url && url !== '') {
            const escapedUrl = this._escapeHtml(String(url));
            return `<a href="${escapedUrl}" target="_blank" rel="noopener noreferrer" class="platform-link">${platformName}</a>`;
        }
        return platformName;
    }

    static _formatJson(value) {
        if (typeof value === 'object') {
            const entries = Object.entries(value);
            if (entries.length === 0) return '-';
            return entries.map(([k, v]) => `${k}:${v}`).join(', ');
        }
        return this._escapeHtml(String(value));
    }

    static _renderPagination(currentPage, totalPages, total, pageSize, onPageChange) {
        const pages = this._generatePageNumbers(currentPage, totalPages);

        return `
            <div class="pagination-wrapper">
                <div class="pagination-info">
                    显示 ${(currentPage - 1) * pageSize + 1} - ${Math.min(currentPage * pageSize, total)} 条，共 ${total} 条
                </div>
                <div class="pagination">
                    <button ${currentPage === 1 ? 'disabled' : ''} onclick="window.tableCallbacks.goToPage(${currentPage - 1})">
                        <span class="icon">${Icons.arrowBack}</span>
                    </button>
                    ${pages.join('')}
                    <button ${currentPage === totalPages ? 'disabled' : ''} onclick="window.tableCallbacks.goToPage(${currentPage + 1})">
                        <span class="icon">${Icons.arrowForward}</span>
                    </button>
                </div>
            </div>
        `;
    }

    static _generatePageNumbers(current, total) {
        const pages = [];
        const maxShow = 5;

        let start = Math.max(1, current - Math.floor(maxShow / 2));
        let end = Math.min(total, start + maxShow - 1);

        if (end - start + 1 < maxShow) {
            start = Math.max(1, end - maxShow + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(`
                <button class="${i === current ? 'active' : ''}" onclick="window.tableCallbacks.goToPage(${i})">
                    ${i}
                </button>
            `);
        }

        return pages;
    }

    static _initCheckboxEvents(onChange) {
        const selectAllCheckbox = document.getElementById('select-all-checkbox');
        const rowCheckboxes = document.querySelectorAll('.row-checkbox');

        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', (e) => {
                const isChecked = e.target.checked;
                const ids = [];
                rowCheckboxes.forEach(checkbox => {
                    checkbox.checked = isChecked;
                    if (isChecked) {
                        ids.push(parseInt(checkbox.getAttribute('data-id')));
                    }
                });
                onChange({ type: 'all', checked: isChecked, ids });
            });
        }

        rowCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                const isChecked = e.target.checked;

                if (!isChecked && selectAllCheckbox) {
                    selectAllCheckbox.checked = false;
                }

                const allChecked = Array.from(rowCheckboxes).every(cb => cb.checked);
                if (allChecked && selectAllCheckbox) {
                    selectAllCheckbox.checked = true;
                }

                onChange({ type: 'single', checked: isChecked, id });
            });
        });
    }

    static togglePassword(elementId) {
        const element = document.getElementById(elementId);
        const button = element.nextElementSibling;
        const icon = button.querySelector('i');
        const password = element.getAttribute('data-password');

        if (element.textContent === '••••••••') {
            element.textContent = password;
            icon.className = 'fas fa-eye-slash';
        } else {
            element.textContent = '••••••••';
            icon.className = 'fas fa-eye';
        }
    }

    static _escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    static _generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }
}
