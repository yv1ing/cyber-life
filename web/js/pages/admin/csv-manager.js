// CSV导入导出管理器
class CSVManager {
    constructor(dataManager) {
        this.dataManager = dataManager;
    }

    /**
     * 初始化CSV功能
     */
    init() {
        // 导出按钮
        document.getElementById('export-csv-btn').addEventListener('click', () => this._handleExport());

        // 导入按钮
        document.getElementById('import-csv-btn').addEventListener('click', () => {
            document.getElementById('import-csv-file-input').click();
        });

        // 文件选择
        document.getElementById('import-csv-file-input').addEventListener('change', (e) => this._handleImport(e));
    }

    /**
     * 处理导出
     * @private
     * @returns {Promise<void>}
     */
    async _handleExport() {
        try {
            Toast.info('正在导出CSV文件...');
            const config = PageConfig[this.dataManager.currentPage];
            await config.api.exportCSV();
            Toast.success('导出成功');
        } catch (error) {
            Toast.error('导出失败: ' + (error.message || '未知错误'));
            console.error(error);
        }
    }

    /**
     * 处理导入
     * @private
     * @param {Event} event - 文件选择事件
     * @returns {Promise<void>}
     */
    async _handleImport(event) {
        const file = event.target.files[0];
        event.target.value = ''; // 清空，允许重复选择同一文件

        if (!file) return;

        // 验证文件类型
        if (!file.name.endsWith('.csv')) {
            Toast.error('请选择CSV文件');
            return;
        }

        // 验证文件大小
        if (file.size > 10 * 1024 * 1024) {
            Toast.error('文件大小不能超过10MB');
            return;
        }

        try {
            Toast.info('正在导入CSV文件...');
            const config = PageConfig[this.dataManager.currentPage];
            const response = await config.api.importCSV(file);

            if (response && response.data) {
                const successCount = response.data.success_count || 0;
                const failedCount = response.data.failed_count || 0;

                if (failedCount > 0) {
                    Toast.warning(`导入完成：成功 ${successCount} 条，失败 ${failedCount} 条`, 5000);
                } else {
                    Toast.success(`成功导入 ${successCount} 条记录`);
                }
            } else {
                Toast.success('导入完成');
            }

            this.dataManager.loadData(this.dataManager.currentPageNum, this.dataManager.currentKeyword);

        } catch (error) {
            Toast.error('导入失败: ' + (error.message || '未知错误'));
            console.error(error);
        }
    }

    /**
     * 控制按钮显示
     * @param {boolean} show - 是否显示
     */
    toggleButtons(show) {
        const exportBtn = document.getElementById('export-csv-btn');
        const importBtn = document.getElementById('import-csv-btn');

        exportBtn.style.display = show ? '' : 'none';
        importBtn.style.display = show ? '' : 'none';
    }
}
