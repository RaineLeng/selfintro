// 导航栏汉堡菜单
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// 滚动到指定区域
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }

        if (navLinks) {
            navLinks.classList.remove('active');
        }
    });
});

// 模态框功能
const modals = {
    'wechat-link': 'wechat-modal',
    'xiaohongshu-link': 'xiaohongshu-modal'
};

// 打开模态框
Object.keys(modals).forEach(linkId => {
    const link = document.getElementById(linkId);
    const modalId = modals[linkId];
    const modal = document.getElementById(modalId);

    if (!link || !modal) {
        return;
    }

    link.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // 防止背景滚动
    });
});

// 关闭模态框
document.querySelectorAll('.modal-close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        const modal = closeBtn.closest('.modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // 恢复背景滚动
        }
    });
});

// 点击模态框外部关闭
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // 恢复背景滚动
        }
    });
});

// 文章标签页切换功能
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-type');

        // 更新按钮状态
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // 更新内容显示
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
            if (content.getAttribute('data-type') === type) {
                content.classList.add('active');
            }
        });
    });
});
