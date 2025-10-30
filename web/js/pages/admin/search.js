// 搜索管理器
class SearchManager {
    constructor(dataManager) {
        this.dataManager = dataManager;
    }

    /**
     * 初始化搜索功能
     */
    init() {
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');

        // 点击搜索按钮
        searchBtn.addEventListener('click', () => this._performSearch());

        // 回车键搜索
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this._performSearch();
            }
        });

        // 输入为空时自动恢复列表
        searchInput.addEventListener('input', Helpers.debounce((e) => {
            if (e.target.value.trim() === '' && this.dataManager.currentKeyword !== '') {
                this.dataManager.currentKeyword = '';
                this.dataManager.currentPageNum = 1;
                this.dataManager.loadData(1, '');
            }
        }, 500));
    }

    /**
     * 执行搜索
     * @private
     */
    _performSearch() {
        const searchInput = document.getElementById('search-input');
        const keyword = searchInput.value.trim();
        this.dataManager.loadData(1, keyword);
    }
}
