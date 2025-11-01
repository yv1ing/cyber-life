// 模态框管理组件
class Modal {
    constructor(id) {
        this.id = id;
        this.element = document.getElementById(id);
        this.overlay = this.element?.closest('.modal-overlay');
        this._handleEscKey = null;

        if (this.overlay) {
            // 点击遮罩关闭
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) {
                    this.close();
                }
            });
        }
    }

    show() {
        if (this.overlay) {
            this.overlay.classList.add('show');
            document.body.style.overflow = 'hidden';

            // ESC 键关闭 - 仅在模态框显示时监听
            if (!this._handleEscKey) {
                this._handleEscKey = (e) => {
                    if (e.key === 'Escape' && this.overlay.classList.contains('show')) {
                        this.close();
                    }
                };
                document.addEventListener('keydown', this._handleEscKey);
            }
        }
    }

    close() {
        if (this.overlay) {
            this.overlay.classList.remove('show');
            document.body.style.overflow = '';

            // 移除 ESC 键监听器
            if (this._handleEscKey) {
                document.removeEventListener('keydown', this._handleEscKey);
                this._handleEscKey = null;
            }
        }
    }

    static confirm(title, message, onConfirm) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal" style="width: 400px;">
                <div class="modal-header">
                    <h3 class="modal-title">${title}</h3>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" id="modal-cancel" data-i18n="common.cancel">取消</button>
                    <button class="btn btn-primary" id="modal-confirm" data-i18n="common.confirm">确认</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // 应用国际化翻译
        const cancelBtn = overlay.querySelector('#modal-cancel');
        const confirmBtn = overlay.querySelector('#modal-confirm');
        if (typeof langManager !== 'undefined') {
            cancelBtn.textContent = langManager.t('common.cancel');
            confirmBtn.textContent = langManager.t('common.confirm');
        }

        setTimeout(() => overlay.classList.add('show'), 10);

        const close = () => {
            overlay.classList.remove('show');
            setTimeout(() => overlay.remove(), 300);
        };

        cancelBtn.addEventListener('click', close);
        confirmBtn.addEventListener('click', () => {
            onConfirm();
            close();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });
    }
}
