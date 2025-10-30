// 管理页面逻辑
let currentPage = 'accounts';
let currentPageNum = 1;
const pageSize = 10;
let isLoading = false;
let selectedIds = new Set(); // 存储选中的ID
let currentKeyword = ''; // 当前搜索关键词

// 页面配置
const pageConfigs = {
    accounts: {
        title: 'accounts.title',
        icon: Icons.account,
        api: AccountAPI,
        fields: [
            { key: 'platform', label: 'accounts.platform', type: 'text', required: true },
            { key: 'platform_url', label: 'accounts.platformURL', type: 'url', required: true },
            { key: 'username', label: 'accounts.username', type: 'text', required: true },
            { key: 'password', label: 'accounts.password', type: 'password', required: true },
            { key: 'security_email', label: 'accounts.securityEmail', type: 'email', required: false },
            { key: 'security_phone', label: 'accounts.securityPhone', type: 'tel', required: false },
            { key: 'remark', label: 'accounts.remark', type: 'textarea', required: false }
        ],
        columns: [
            { key: 'ID', label: 'common.id', width: '80px' },
            { key: 'platform', label: 'accounts.platform', width: '120px', format: 'platformLink', urlKey: 'platform_url' },
            { key: 'username', label: 'accounts.username', width: '150px' },
            { key: 'password', label: 'accounts.password', width: '200px', format: 'password' },
            { key: 'security_email', label: 'accounts.securityEmail', width: '180px' },
            { key: 'security_phone', label: 'accounts.securityPhone', width: '130px' },
            { key: 'remark', label: 'accounts.remark' },
            { key: 'CreatedAt', label: 'accounts.createdAt', width: '160px', format: 'datetime' },
            { key: 'UpdatedAt', label: 'accounts.updatedAt', width: '160px', format: 'datetime' }
        ]
    },
    hosts: {
        title: 'hosts.title',
        icon: Icons.host,
        api: HostAPI,
        fields: [
            { key: 'provider', label: 'hosts.provider', type: 'text', required: true },
            { key: 'provider_url', label: 'hosts.providerURL', type: 'url', required: true },
            { key: 'address', label: 'hosts.address', type: 'text', required: true },
            { key: 'ports', label: 'hosts.ports', type: 'portlist', required: true },
            { key: 'username', label: 'hosts.username', type: 'text', required: true },
            { key: 'password', label: 'hosts.password', type: 'password', required: true },
            // 主机名称和操作系统放在同一行
            { key: 'hostname_os_group', type: 'group', fields: [
                { key: 'hostname', label: 'hosts.hostname', type: 'text', required: true },
                { key: 'os', label: 'hosts.os', type: 'text', required: false }
            ]},
            // CPU、内存、磁盘放在同一行
            { key: 'capacity_group', type: 'group', fields: [
                { key: 'cpu_num', label: 'hosts.cpuCapacity', type: 'capacity', unit: 'cores', placeholder: 'hosts.cpuPlaceholder', required: false },
                { key: 'ram_size', label: 'hosts.ramCapacity', type: 'capacity', unit: 'storage', placeholder: 'hosts.ramPlaceholder', required: false },
                { key: 'disk_size', label: 'hosts.diskCapacity', type: 'capacity', unit: 'storage', placeholder: 'hosts.diskPlaceholder', required: false }
            ]}
        ],
        columns: [
            { key: 'ID', label: 'common.id', width: '80px' },
            { key: 'provider', label: 'hosts.provider', width: '120px', format: 'platformLink', urlKey: 'provider_url' },
            { key: 'hostname', label: 'hosts.hostname', width: '150px' },
            { key: 'address', label: 'hosts.address', width: '150px' },
            { key: 'ports', label: 'hosts.ports', width: '150px', format: 'json' },
            { key: 'username', label: 'hosts.username', width: '120px' },
            { key: 'password', label: 'hosts.password', width: '150px', format: 'password' },
            { key: 'os', label: 'hosts.os', width: '120px' },
            { key: 'cpu_num', label: 'hosts.cpuNum', width: '80px' },
            { key: 'ram_size', label: 'hosts.ramSize', width: '100px', format: 'storage' },
            { key: 'disk_size', label: 'hosts.diskSize', width: '100px', format: 'storage' },
            { key: 'CreatedAt', label: 'hosts.createdAt', width: '160px', format: 'datetime' },
            { key: 'UpdatedAt', label: 'hosts.updatedAt', width: '160px', format: 'datetime' }
        ]
    },
    secrets: {
        title: 'secrets.title',
        icon: Icons.key,
        api: SecretAPI,
        fields: [
            { key: 'platform', label: 'secrets.platform', type: 'text', required: true },
            { key: 'key_id', label: 'secrets.keyID', type: 'text', required: true },
            { key: 'key_secret', label: 'secrets.keySecret', type: 'password', required: true },
            { key: 'remark', label: 'secrets.remark', type: 'textarea', required: false }
        ],
        columns: [
            { key: 'ID', label: 'common.id', width: '80px' },
            { key: 'platform', label: 'secrets.platform', width: '150px' },
            { key: 'key_id', label: 'secrets.keyID', width: '200px' },
            { key: 'key_secret', label: 'secrets.keySecret', width: '250px', format: 'password' },
            { key: 'remark', label: 'secrets.remark' },
            { key: 'CreatedAt', label: 'secrets.createdAt', width: '160px', format: 'datetime' },
            { key: 'UpdatedAt', label: 'secrets.updatedAt', width: '160px', format: 'datetime' }
        ]
    },
    sites: {
        title: '站点信息',
        icon: Icons.web,
        api: SiteAPI,
        fields: [
            { key: 'name', label: '站点名称', type: 'text', required: true },
            { key: 'url', label: '站点地址', type: 'url', required: true },
            { key: 'category', label: '分类', type: 'text', required: false },
            { key: 'note', label: '备注', type: 'textarea', required: false }
        ],
        columns: [
            { key: 'id', label: 'common.id', width: '80px' },
            { key: 'name', label: '站点名称' },
            { key: 'url', label: '站点地址' },
            { key: 'category', label: '分类' },
            { key: 'created_at', label: '创建时间', format: 'datetime' }
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // 权限检查
    if (!checkAuth()) {
        return;
    }

    // 初始化图标
    initIcons();

    // 初始化用户信息
    initUserInfo();

    // 初始化主题切换
    initThemeToggle();

    // 初始化语言切换
    initLanguageToggle();

    // 初始化导航
    initNavigation();

    // 初始化模态框
    initModal();

    // 初始化资料模态框
    initProfileModal();

    // 初始化移动端侧边栏
    initMobileSidebar();

    // 初始化批量删除
    initBatchDelete();

    // 初始化搜索功能
    initSearch();

    // 登出按钮
    document.getElementById('logout-btn').addEventListener('click', handleLogout);

    // 新建按钮
    document.getElementById('create-btn').addEventListener('click', () => openEditModal());

    // 导出CSV按钮
    document.getElementById('export-csv-btn').addEventListener('click', handleExportCSV);

    // 导入CSV按钮
    document.getElementById('import-csv-btn').addEventListener('click', () => {
        document.getElementById('import-csv-file-input').click();
    });

    // 文件选择处理
    document.getElementById('import-csv-file-input').addEventListener('change', handleImportCSV);

    // 恢复上次访问的页面，如果没有则加载默认页面
    const savedPage = Storage.get('current_page') || currentPage;
    if (pageConfigs[savedPage]) {
        currentPage = savedPage;
        // 更新导航激活状态
        document.querySelectorAll('.nav-item').forEach(nav => {
            if (nav.getAttribute('data-page') === savedPage) {
                nav.classList.add('active');
            } else {
                nav.classList.remove('active');
            }
        });
    }
    loadPage(currentPage);
});

// 初始化图标
function initIcons() {
    document.getElementById('header-logo-icon').innerHTML = Icons.web;
    document.getElementById('mobile-menu-icon').innerHTML = Icons.menu;
    document.getElementById('logout-icon').innerHTML = Icons.logout;
    document.getElementById('create-icon').innerHTML = Icons.add;
    document.getElementById('export-csv-icon').innerHTML = Icons.download;
    document.getElementById('import-csv-icon').innerHTML = Icons.upload;
    document.getElementById('batch-delete-icon').innerHTML = Icons.delete;
    document.getElementById('search-btn-icon').innerHTML = Icons.search;
    document.getElementById('close-icon').innerHTML = Icons.close;
    document.getElementById('save-icon').innerHTML = Icons.save;
    document.getElementById('edit-profile-icon').innerHTML = Icons.edit;
    document.getElementById('profile-close-icon').innerHTML = Icons.close;
    document.getElementById('profile-save-icon').innerHTML = Icons.save;

    // 导航图标
    document.getElementById('nav-icon-accounts').innerHTML = Icons.account;
    document.getElementById('nav-icon-secrets').innerHTML = Icons.key;
    document.getElementById('nav-icon-hosts').innerHTML = Icons.host;
    document.getElementById('nav-icon-sites').innerHTML = Icons.web;
}

// 初始化用户信息
function initUserInfo() {
    const user = getCurrentUser();
    if (user && user.username) {
        document.getElementById('user-name').textContent = user.username;
        document.getElementById('user-initial-admin').textContent = user.username.charAt(0).toUpperCase();
    }

    // 用户下拉菜单
    const userMenu = document.getElementById('user-menu');
    const userDropdown = document.getElementById('user-dropdown');

    userMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('show');
    });

    // 点击其他地方关闭下拉菜单
    document.addEventListener('click', (e) => {
        if (!userMenu.contains(e.target) && !userDropdown.contains(e.target)) {
            userDropdown.classList.remove('show');
        }
    });

    // 编辑资料按钮
    document.getElementById('edit-profile-btn').addEventListener('click', () => {
        userDropdown.classList.remove('show');
        openProfileModal();
    });
}

// 初始化主题切换
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        themeManager.toggle();
        localStorage.setItem('theme-manual', 'true');
    });
}

// 初始化语言切换
function initLanguageToggle() {
    const langToggle = document.getElementById('lang-toggle');
    langToggle.addEventListener('click', () => {
        langManager.toggle();
    });

    // 监听语言变化事件，重新加载数据
    window.addEventListener('languagechange', () => {
        // 重新渲染当前页面
        loadData(currentPage, currentPageNum);
    });
}

// 初始化导航
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const page = item.getAttribute('data-page');
            if (page && pageConfigs[page]) {
                // 更新激活状态
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');

                // 加载页面
                currentPage = page;
                currentPageNum = 1;
                currentKeyword = ''; // 清空搜索关键词

                // 保存当前页面到 localStorage
                Storage.set('current_page', page);

                // 清空搜索框
                const searchInput = document.getElementById('search-input');
                if (searchInput) {
                    searchInput.value = '';
                }

                loadPage(page);
            } else {
                Toast.warning(langManager.t('toast.featureNotImplemented'));
            }
        });
    });
}

// 加载页面
async function loadPage(page) {
    const config = pageConfigs[page];
    if (!config) {
        Toast.error('页面配置不存在');
        return;
    }

    // 控制导入导出按钮的显示（账号管理、主机管理和密钥管理页面显示）
    const exportBtn = document.getElementById('export-csv-btn');
    const importBtn = document.getElementById('import-csv-btn');

    if (page === 'accounts' || page === 'hosts' || page === 'secrets') {
        exportBtn.style.display = '';
        importBtn.style.display = '';
    } else {
        exportBtn.style.display = 'none';
        importBtn.style.display = 'none';
    }

    // 加载数据
    await loadData(page, currentPageNum);
}

// 加载数据
async function loadData(page, pageNum = 1, keyword = '') {
    if (isLoading) return;

    const config = pageConfigs[page];
    const contentBody = document.getElementById('content-body');

    try {
        isLoading = true;

        // 清空选中状态
        selectedIds.clear();
        updateBatchDeleteButton();

        // 显示加载状态
        contentBody.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; padding: 64px;">
                <div class="loading"></div>
            </div>
        `;

        // 调用 API - 如果有搜索关键词，使用 find 接口，否则使用 list 接口
        let response;
        if (keyword) {
            response = await config.api.find(keyword, pageNum, pageSize);
        } else {
            response = await config.api.list(pageNum, pageSize);
        }

        // 检查响应数据
        if (!response || !response.data) {
            throw new Error('数据格式错误');
        }

        const items = response.data.items || response.data.list || [];
        const total = response.data.total || 0;

        // 渲染表格
        renderTable(config, items, pageNum, total);

    } catch (error) {
        console.error('加载数据失败:', error);
        contentBody.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon icon">${Icons.error}</div>
                <div class="empty-title">加载失败</div>
                <div class="empty-description">${error.message || '请稍后重试'}</div>
            </div>
        `;
    } finally {
        isLoading = false;
    }
}

// 渲染表格
function renderTable(config, items, pageNum, total) {
    const contentBody = document.getElementById('content-body');

    if (items.length === 0) {
        contentBody.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon icon">${Icons.info}</div>
                <div class="empty-title">${langManager.t('empty.noData')}</div>
                <div class="empty-description">${langManager.t('empty.clickCreate')}</div>
            </div>
        `;
        updateBatchDeleteButton();
        return;
    }

    const totalPages = Math.ceil(total / pageSize);

    contentBody.innerHTML = `
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
                    ${items.map(item => {
                        const itemJson = escapeHtml(JSON.stringify(item));
                        const rowId = item.ID || item.id || generateId();
                        return `
                            <tr>
                                <td>
                                    <input type="checkbox" class="row-checkbox table-checkbox" data-id="${rowId}" />
                                </td>
                                ${config.columns.map(col => `
                                    <td>${formatCellValue(item[col.key], col.format, rowId, item, col)}</td>
                                `).join('')}
                                <td>
                                    <div class="table-actions">
                                        <button class="action-btn edit" onclick='editItem(${itemJson})' title="${langManager.t('common.edit')}">
                                            <span class="icon">${Icons.edit}</span>
                                        </button>
                                        <button class="action-btn delete" onclick="deleteItem(${rowId})" title="${langManager.t('common.delete')}">
                                            <span class="icon">${Icons.delete}</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>

            ${totalPages > 1 ? `
                <div class="pagination-wrapper">
                    <div class="pagination-info">
                        显示 ${(pageNum - 1) * pageSize + 1} - ${Math.min(pageNum * pageSize, total)} 条，共 ${total} 条
                    </div>
                    <div class="pagination">
                        <button ${pageNum === 1 ? 'disabled' : ''} onclick="goToPage(${pageNum - 1})">
                            <span class="icon">${Icons.arrowBack}</span>
                        </button>
                        ${generatePageNumbers(pageNum, totalPages)}
                        <button ${pageNum === totalPages ? 'disabled' : ''} onclick="goToPage(${pageNum + 1})">
                            <span class="icon">${Icons.arrowForward}</span>
                        </button>
                    </div>
                </div>
            ` : ''}
        </div>
    `;

    // 初始化复选框事件
    initCheckboxEvents();
}

// 格式化单元格值
function formatCellValue(value, format, rowId, item, col) {
    if (value === null || value === undefined || value === '') return '-';

    switch (format) {
        case 'datetime':
            return formatDateTime(value);
        case 'date':
            return value ? value.split('T')[0] : '-';
        case 'password':
            const uniqueId = `pwd-${rowId}`;
            const escapedValue = escapeHtml(String(value));
            return `
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span id="${uniqueId}" class="password-field" data-password="${escapedValue}">••••••••</span>
                    <button class="btn-icon" onclick="togglePassword('${uniqueId}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            `;
        case 'platformLink':
            const url = item && col && col.urlKey ? item[col.urlKey] : '';
            const platformName = escapeHtml(String(value));
            if (url && url !== '') {
                const escapedUrl = escapeHtml(String(url));
                return `<a href="${escapedUrl}" target="_blank" rel="noopener noreferrer" class="platform-link">${platformName}</a>`;
            }
            return platformName;
        case 'json':
            if (typeof value === 'object') {
                // 如果是对象，转换为易读的格式
                const entries = Object.entries(value);
                if (entries.length === 0) return '-';
                return entries.map(([k, v]) => `${k}:${v}`).join(', ');
            }
            return escapeHtml(String(value));
        case 'storage':
            // 格式化存储容量（输入单位为MB）
            return formatStorage(value);
        default:
            return escapeHtml(String(value));
    }
}

// 格式化存储容量（MB -> GB/TB/PB）
function formatStorage(mb) {
    if (!mb || mb === 0) return '-';

    const units = ['MB', 'GB', 'TB', 'PB'];
    let size = mb;
    let unitIndex = 0;

    // 自动转换到合适的单位
    while (size >= 1024 && unitIndex < units.length - 1) {
        size = size / 1024;
        unitIndex++;
    }

    // 保留两位小数，去除末尾的0
    return `${parseFloat(size.toFixed(2))} ${units[unitIndex]}`;
}

// 生成页码
function generatePageNumbers(current, total) {
    const pages = [];
    const maxShow = 5;

    let start = Math.max(1, current - Math.floor(maxShow / 2));
    let end = Math.min(total, start + maxShow - 1);

    if (end - start + 1 < maxShow) {
        start = Math.max(1, end - maxShow + 1);
    }

    for (let i = start; i <= end; i++) {
        pages.push(`
            <button class="${i === current ? 'active' : ''}" onclick="goToPage(${i})">
                ${i}
            </button>
        `);
    }

    return pages.join('');
}

// 跳转页面
function goToPage(page) {
    currentPageNum = page;
    loadData(currentPage, page, currentKeyword);
}

// 编辑项目
function editItem(item) {
    if (typeof item === 'string') {
        item = JSON.parse(item);
    }
    openEditModal(item);
}

// 删除项目
function deleteItem(id) {
    Modal.confirm(
        langManager.t('common.confirm'),
        langManager.t('accounts.deleteConfirm'),
        async () => {
            const config = pageConfigs[currentPage];

            try {
                await config.api.delete(id);
                Toast.success(langManager.t('accounts.deleteSuccess'));
                loadData(currentPage, currentPageNum, currentKeyword);
            } catch (error) {
                Toast.error(error.message || langManager.t('toast.deleteFailed'));
                console.error(error);
            }
        }
    );
}

// 初始化模态框
function initModal() {
    const modal = new Modal('edit-modal-overlay');

    document.getElementById('edit-modal-close').addEventListener('click', () => modal.close());
    document.getElementById('edit-modal-cancel').addEventListener('click', () => modal.close());
    document.getElementById('edit-modal-save').addEventListener('click', handleSave);
}

// 生成单个字段的HTML
function generateFieldHTML(field, item) {
    let value = item ? (item[field.key] || '') : '';

    // 处理端口列表类型
    if (field.type === 'portlist') {
        return `
            <div class="input-group">
                <label class="input-label">
                    ${langManager.t(field.label)}${field.required ? ' *' : ''}
                </label>
                <div id="ports-list" class="ports-list"></div>
                <button type="button" class="btn-secondary add-port-btn" onclick="addPortMapping('#ports-list', '', '')" style="margin-top: 8px;">
                    <i class="fas fa-plus"></i> ${langManager.t('hosts.addPort')}
                </button>
            </div>
        `;
    }

    // 处理容量类型（CPU、内存、磁盘）
    if (field.type === 'capacity') {
        let numValue = '';
        let unitValue = '';

        if (value) {
            if (field.unit === 'cores') {
                // CPU核心数，直接显示数字
                numValue = value;
                unitValue = 'cores';
            } else if (field.unit === 'storage') {
                // 存储容量，需要转换单位（后端存储的是MB）
                const mb = parseInt(value) || 0;
                if (mb >= 1024 * 1024) {
                    // >= 1TB
                    numValue = (mb / (1024 * 1024)).toFixed(2).replace(/\.?0+$/, '');
                    unitValue = 'TB';
                } else if (mb >= 1024) {
                    // >= 1GB
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
                        value="${escapeHtml(numValue)}"
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

    // 处理 JSON 类型字段
    if (field.type === 'json' && value && typeof value === 'object') {
        value = JSON.stringify(value, null, 2);
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
                >${escapeHtml(value)}</textarea>
            ` : `
                <input
                    type="${field.type}"
                    id="field-${field.key}"
                    class="input-field"
                    value="${escapeHtml(value)}"
                    ${field.required ? 'required' : ''}
                />
            `}
        </div>
    `;
}

// 打开编辑模态框
function openEditModal(item = null) {
    const config = pageConfigs[currentPage];
    const modal = new Modal('edit-modal-overlay');

    // 设置标题（使用翻译）
    const title = langManager.t(config.title);
    document.getElementById('edit-modal-title').textContent = item ?
        `${langManager.t('common.edit')} ${title}` :
        `${langManager.t('common.create')} ${title}`;

    // 设置 ID (GORM 返回的是大写 ID)
    document.getElementById('edit-id').value = item ? (item.ID || item.id || '') : '';

    // 生成表单字段
    const formFields = document.getElementById('form-fields');
    formFields.innerHTML = config.fields.map(field => {
        // 处理分组字段（同一行显示多个字段）
        if (field.type === 'group') {
            const groupFieldsHTML = field.fields.map(f => generateFieldHTML(f, item)).join('');
            return `<div class="form-row">${groupFieldsHTML}</div>`;
        }

        // 处理普通字段
        return generateFieldHTML(field, item);
    }).join('');

    // 如果是编辑模式且有端口数据，填充端口列表
    if (item && item.ports && typeof item.ports === 'object') {
        // 需要在 DOM 渲染后执行
        setTimeout(() => {
            Object.entries(item.ports).forEach(([port, service]) => {
                addPortMapping('#ports-list', port, service);
            });
        }, 0);
    }

    modal.show();
}

// 保存
async function handleSave() {
    const config = pageConfigs[currentPage];
    const form = document.getElementById('edit-form');

    if (!validateForm(form)) {
        return;
    }

    const id = document.getElementById('edit-id').value;
    const data = {};

    // 递归获取所有字段（包括group内的字段）
    const getAllFields = (fields) => {
        const result = [];
        fields.forEach(field => {
            if (field.type === 'group') {
                result.push(...getAllFields(field.fields));
            } else {
                result.push(field);
            }
        });
        return result;
    };

    const allFields = getAllFields(config.fields);

    allFields.forEach(field => {
        // 处理端口列表类型
        if (field.type === 'portlist') {
            const ports = getPortMappings('#ports-list');
            if (field.required && Object.keys(ports).length === 0) {
                Toast.error(`${langManager.t(field.label)} 是必填项，请至少添加一个端口映射`);
                throw new Error('Port list is required');
            }
            data[field.key] = ports;
            return;
        }

        // 处理容量类型
        if (field.type === 'capacity') {
            const valueInput = document.getElementById(`field-${field.key}-value`);
            const unitSelect = document.getElementById(`field-${field.key}-unit`);

            if (valueInput && unitSelect) {
                const numValue = parseFloat(valueInput.value) || 0;
                const unit = unitSelect.value;

                if (field.unit === 'cores') {
                    // CPU核心数，直接存储数字
                    data[field.key] = Math.floor(numValue);
                } else if (field.unit === 'storage') {
                    // 存储容量，统一转换为MB存储
                    let mbValue = numValue;
                    if (unit === 'GB') {
                        mbValue = numValue * 1024;
                    } else if (unit === 'TB') {
                        mbValue = numValue * 1024 * 1024;
                    }
                    data[field.key] = Math.floor(mbValue);
                }
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
                    Toast.error(`${langManager.t(field.label)} 格式错误，请输入有效的 JSON`);
                    throw new Error('Invalid JSON format');
                }
            } else if (field.type === 'number') {
                // 处理数字类型
                data[field.key] = value ? parseInt(value, 10) : 0;
            } else {
                data[field.key] = value;
            }
        }
    });

    const saveBtn = document.getElementById('edit-modal-save');
    saveBtn.disabled = true;
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = `<span class="loading"></span> ${langManager.t('common.loading')}`;

    try {
        if (id) {
            await config.api.update(id, data);
            Toast.success(langManager.t('accounts.saveSuccess'));
        } else {
            await config.api.create(data);
            Toast.success(langManager.t('accounts.saveSuccess'));
        }

        const modal = new Modal('edit-modal-overlay');
        modal.close();

        // 重新加载数据
        loadData(currentPage, currentPageNum, currentKeyword);

    } catch (error) {
        Toast.error(error.message || langManager.t('toast.saveFailed'));
        console.error(error);
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalText;
    }
}

// 登出
async function handleLogout() {
    try {
        await UserAPI.logout();
    } catch (error) {
        console.error('登出失败:', error);
    } finally {
        logout();
    }
}

// 切换密码显示/隐藏
function togglePassword(elementId) {
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

// 暴露全局函数供模板使用
window.editItem = editItem;
window.deleteItem = deleteItem;
window.goToPage = goToPage;
window.togglePassword = togglePassword;

// 用户资料相关变量
let currentUserData = null;

// 打开编辑资料模态框
async function openProfileModal() {
    try {
        // 获取当前用户信息
        const user = getCurrentUser();
        if (!user || !user.username) {
            Toast.error(langManager.t('profile.getFailed'));
            return;
        }

        // 通过用户名查询完整的用户信息
        const response = await UserAPI.findByUsername(user.username);
        if (response && response.data && response.data.users && response.data.users.length > 0) {
            currentUserData = response.data.users[0];

            // 填充表单
            document.getElementById('profile-user-id').value = currentUserData.ID;
            document.getElementById('profile-username').value = currentUserData.Username || '';
            document.getElementById('profile-name').value = currentUserData.Name || '';
            document.getElementById('profile-email').value = currentUserData.Email || '';
            document.getElementById('profile-phone').value = currentUserData.Phone || '';
            document.getElementById('profile-password').value = '';

            // 显示模态框
            const modal = new Modal('profile-modal-overlay');
            modal.show();
        } else {
            Toast.error(langManager.t('profile.getFailed'));
        }
    } catch (error) {
        Toast.error(error.message || langManager.t('profile.getFailed'));
        console.error(error);
    }
}

// 保存用户资料
async function handleProfileSave() {
    try {
        const userId = document.getElementById('profile-user-id').value;
        const username = document.getElementById('profile-username').value.trim();
        const name = document.getElementById('profile-name').value.trim();
        const email = document.getElementById('profile-email').value.trim();
        const phone = document.getElementById('profile-phone').value.trim();
        const password = document.getElementById('profile-password').value.trim();

        if (!username) {
            Toast.warning(langManager.t('validation.fillAccount'));
            return;
        }

        const userData = {
            username: username,
            name: name,
            email: email,
            phone: phone,
            avatar: '' // 暂不支持头像
        };

        // 如果输入了密码，则更新密码
        if (password) {
            userData.password = password;
        } else {
            userData.password = ''; // 空字符串表示不修改密码
        }

        await UserAPI.update(userId, userData);
        Toast.success(langManager.t('profile.saveSuccess'));

        // 更新本地存储的用户信息
        const user = getCurrentUser();
        user.username = username;
        Storage.set('user', user);

        // 更新页面显示
        document.getElementById('user-name').textContent = username;
        document.getElementById('user-initial-admin').textContent = username.charAt(0).toUpperCase();

        // 关闭模态框
        const modal = new Modal('profile-modal-overlay');
        modal.close();
    } catch (error) {
        Toast.error(error.message || langManager.t('toast.saveFailed'));
        console.error(error);
    }
}

// 初始化资料模态框
function initProfileModal() {
    const modal = new Modal('profile-modal-overlay');

    document.getElementById('profile-modal-close').addEventListener('click', () => modal.close());
    document.getElementById('profile-modal-cancel').addEventListener('click', () => modal.close());
    document.getElementById('profile-modal-save').addEventListener('click', handleProfileSave);
}

// 初始化移动端侧边栏
function initMobileSidebar() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('admin-sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    // 切换侧边栏显示
    function toggleSidebar() {
        sidebar.classList.toggle('show');
        overlay.classList.toggle('show');
    }

    // 关闭侧边栏
    function closeSidebar() {
        sidebar.classList.remove('show');
        overlay.classList.remove('show');
    }

    // 点击汉堡菜单按钮
    mobileMenuBtn.addEventListener('click', toggleSidebar);

    // 点击遮罩层关闭侧边栏
    overlay.addEventListener('click', closeSidebar);

    // 点击导航项后关闭侧边栏（移动端）
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeSidebar();
            }
        });
    });
}

// 初始化批量删除功能
function initBatchDelete() {
    const batchDeleteBtn = document.getElementById('batch-delete-btn');
    batchDeleteBtn.addEventListener('click', handleBatchDelete);
}

// 初始化复选框事件
function initCheckboxEvents() {
    const selectAllCheckbox = document.getElementById('select-all-checkbox');
    const rowCheckboxes = document.querySelectorAll('.row-checkbox');

    // 全选/取消全选
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            rowCheckboxes.forEach(checkbox => {
                checkbox.checked = isChecked;
                const id = parseInt(checkbox.getAttribute('data-id'));
                if (isChecked) {
                    selectedIds.add(id);
                } else {
                    selectedIds.delete(id);
                }
            });
            updateBatchDeleteButton();
        });
    }

    // 单个复选框
    rowCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            if (e.target.checked) {
                selectedIds.add(id);
            } else {
                selectedIds.delete(id);
                if (selectAllCheckbox) {
                    selectAllCheckbox.checked = false;
                }
            }

            // 检查是否全部选中
            if (selectAllCheckbox && selectedIds.size === rowCheckboxes.length) {
                selectAllCheckbox.checked = true;
            }

            updateBatchDeleteButton();
        });
    });
}

// 更新批量删除按钮状态
function updateBatchDeleteButton() {
    const batchDeleteBtn = document.getElementById('batch-delete-btn');
    if (selectedIds.size > 0) {
        batchDeleteBtn.style.display = 'flex';
        batchDeleteBtn.querySelector('span:last-child').textContent =
            `${langManager.t('common.batchDelete')} (${selectedIds.size})`;
    } else {
        batchDeleteBtn.style.display = 'none';
    }
}

// 处理批量删除
async function handleBatchDelete() {
    if (selectedIds.size === 0) {
        Toast.warning('请先选择要删除的项');
        return;
    }

    const count = selectedIds.size;
    Modal.confirm(
        langManager.t('common.confirm'),
        `确定要删除选中的 ${count} 条记录吗？此操作不可恢复。`,
        async () => {
            const config = pageConfigs[currentPage];
            const idsArray = Array.from(selectedIds);

            try {
                await config.api.delete(idsArray);
                Toast.success(`成功删除 ${count} 条记录`);

                // 清空选中状态
                selectedIds.clear();

                // 重新加载数据
                loadData(currentPage, currentPageNum, currentKeyword);
            } catch (error) {
                Toast.error(error.message || '批量删除失败');
                console.error(error);
            }
        }
    );
}

// 初始化搜索功能
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    // 执行搜索
    function performSearch() {
        const keyword = searchInput.value.trim();
        currentKeyword = keyword;
        currentPageNum = 1; // 重置为第一页
        loadData(currentPage, currentPageNum, currentKeyword);
    }

    // 点击搜索按钮
    searchBtn.addEventListener('click', performSearch);

    // 回车键搜索
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // 输入为空时自动恢复列表
    searchInput.addEventListener('input', debounce((e) => {
        if (e.target.value.trim() === '' && currentKeyword !== '') {
            currentKeyword = '';
            currentPageNum = 1;
            loadData(currentPage, currentPageNum, currentKeyword);
        }
    }, 500));
}

// 导出CSV处理函数
async function handleExportCSV() {
    try {
        Toast.info('正在导出CSV文件...');

        if (currentPage === 'accounts') {
            await AccountAPI.exportCSV();
            Toast.success('导出成功');
        } else if (currentPage === 'hosts') {
            await HostAPI.exportCSV();
            Toast.success('导出成功');
        } else if (currentPage === 'secrets') {
            await SecretAPI.exportCSV();
            Toast.success('导出成功');
        } else {
            Toast.warning('当前页面不支持CSV导出');
        }
    } catch (error) {
        Toast.error('导出失败: ' + (error.message || '未知错误'));
        console.error(error);
    }
}

// 导入CSV处理函数
async function handleImportCSV(event) {
    const file = event.target.files[0];

    // 清空input的值，以便下次可以选择同一个文件
    event.target.value = '';

    if (!file) {
        return;
    }

    // 验证文件类型
    if (!file.name.endsWith('.csv')) {
        Toast.error('请选择CSV文件');
        return;
    }

    // 验证文件大小（限制为10MB）
    if (file.size > 10 * 1024 * 1024) {
        Toast.error('文件大小不能超过10MB');
        return;
    }

    try {
        Toast.info('正在导入CSV文件...');

        let response;
        if (currentPage === 'accounts') {
            response = await AccountAPI.importCSV(file);
        } else if (currentPage === 'hosts') {
            response = await HostAPI.importCSV(file);
        } else if (currentPage === 'secrets') {
            response = await SecretAPI.importCSV(file);
        } else {
            Toast.warning('当前页面不支持CSV导入');
            return;
        }

        if (response && response.data) {
            const successCount = response.data.success_count || 0;
            const failedCount = response.data.failed_count || 0;

            if (failedCount > 0) {
                Toast.warning(`导入完成：成功 ${successCount} 条，失败 ${failedCount} 条。请检查后台日志了解失败原因。`, 5000);
            } else {
                Toast.success(`成功导入 ${successCount} 条记录`);
            }

            // 重新加载数据
            loadData(currentPage, currentPageNum, currentKeyword);
        } else {
            Toast.success('导入完成');
            loadData(currentPage, currentPageNum, currentKeyword);
        }
    } catch (error) {
        Toast.error('导入失败: ' + (error.message || '未知错误'));
        console.error(error);
    }
}

// ==================== 端口映射管理 ====================

// 添加端口映射项
function addPortMapping(containerSelector = '#ports-list', port = '', service = '') {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const portItem = document.createElement('div');
    portItem.className = 'port-item';
    portItem.innerHTML = `
        <input type="number" class="input-field port-number" placeholder="${langManager.t('hosts.portNumber')}" value="${escapeHtml(port)}" min="1" max="65535" />
        <input type="text" class="input-field port-service" placeholder="${langManager.t('hosts.portService')}" value="${escapeHtml(service)}" />
        <button type="button" class="btn-icon delete-port" onclick="removePortMapping(this)" title="${langManager.t('common.delete')}">
            <i class="fas fa-times"></i>
        </button>
    `;
    container.appendChild(portItem);
}

// 删除端口映射项
function removePortMapping(button) {
    const portItem = button.closest('.port-item');
    if (portItem) {
        portItem.remove();
    }
}

// 获取所有端口映射数据
function getPortMappings(containerSelector = '#ports-list') {
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

// 暴露全局函数
window.addPortMapping = addPortMapping;
window.removePortMapping = removePortMapping;

