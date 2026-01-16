const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const yaml = require('js-yaml');

// 配置 marked 选项
marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: true,
    mangle: false
});

// 1. 读取并解析所有 Markdown 文件
function readMarkdownFiles() {
    const postsDir = path.join(__dirname, 'posts');
    const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
    const posts = [];

    files.forEach(file => {
        const filePath = path.join(postsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // 解析 Front Matter
        const frontMatterRegex = /^---[\s\S]*?---/;
        const frontMatterMatch = content.match(frontMatterRegex);
        
        if (frontMatterMatch) {
            const frontMatter = frontMatterMatch[0];
            const metaData = yaml.load(frontMatter.replace(/^---|---$/g, ''));
            
            // 提取正文内容
            const markdownContent = content.replace(frontMatterRegex, '').trim();
            
            // 转换为 HTML
            const htmlContent = marked(markdownContent);
            
            // 添加到文章列表
            posts.push({
                ...metaData,
                slug: file.replace('.md', ''),
                content: htmlContent,
                markdown: markdownContent
            });
        }
    });

    // 按日期排序，最新的在前
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return posts;
}

// 2. 读取基础模板
function readTemplate() {
    const templatePath = path.join(__dirname, 'base-template.html');
    return fs.readFileSync(templatePath, 'utf8');
}

// 3. 生成首页
function generateHomepage(posts, template) {
    const latestPosts = posts.slice(0, 3); // 只显示最新的3篇文章
    
    // 生成文章列表 HTML
    const articlesHtml = latestPosts.map(post => `
        <div class="article-item">
            <h3 class="article-title"><a href="posts/${post.slug}.html">${post.title}</a></h3>
            <p class="article-meta">${formatDate(post.date)} | ${post.type}</p>
            <p class="article-excerpt">${post.excerpt}</p>
            <a href="posts/${post.slug}.html" class="read-more">阅读更多</a>
        </div>
    `).join('');
    
    // 创建Hero区域的HTML和CSS
    const heroSection = `
        <!-- Hero区域 -->
        <style>
            /* Hero区域样式 */
            .hero {
                position: relative;
                height: 100vh;
                width: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                color: #333;
                overflow: hidden;
                background-color: #f8f5f2;
                text-align: center;
            }

            .hero-background {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(248, 245, 242, 0.9);
                z-index: 1;
            }

            .hero-content {
                position: relative;
                z-index: 2;
                max-width: 800px;
                padding: 20px;
            }

            .hero-title {
                font-family: 'Noto Serif SC', serif;
                font-size: 4rem;
                margin-bottom: 20px;
                line-height: 1.2;
                font-weight: 700;
                letter-spacing: -1px;
                color: #333;
                animation: fadeInUp 1s ease-out;
            }

            .hero-subtitle {
                font-family: 'Noto Serif SC', serif;
                font-size: 1.5rem;
                margin-bottom: 30px;
                line-height: 1.6;
                color: #666;
                animation: fadeInUp 1s ease-out 0.3s both;
            }

            /* 淡入动画 */
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            /* 响应式设计 */
            @media (max-width: 768px) {
                .hero-title {
                    font-size: 2.5rem;
                }
                
                .hero-subtitle {
                    font-size: 1.2rem;
                }
            }
        </style>
        
        <section class="hero">
            <!-- 背景图或背景色 -->
            <div class="hero-background"></div>
            
            <!-- 主要内容区域 -->
            <div class="hero-content">
                <h1 class="hero-title">theOpenExpanse</h1>
                <p class="hero-subtitle">探索无限可能的数字世界</p>
            </div>
        </section>
    `;
    
    // 生成完整的首页内容
    const content = `
        ${heroSection}
        
        <!-- 关于部分 -->
        <section id="about" class="about-section">
            <div class="container">
                <h2 class="section-title">关于我</h2>
                <div class="about-content">
                    <p>我是一名建筑设计师，热爱旅行、摄影和记录生活中的美好瞬间。通过这个网站，我希望分享我的设计作品、旅行见闻以及对生活的感悟。</p>
                    <p>设计不仅是我的职业，更是我理解世界的方式。我相信好的设计能够改善生活，创造更美好的未来。</p>
                </div>
            </div>
        </section>

        <!-- 最新文章部分 -->
        <section id="articles" class="articles-section">
            <div class="container">
                <h2 class="section-title">最新文章</h2>
                <div class="latest-articles">
                    ${articlesHtml}
                </div>
                <div class="view-all-container">
                    <a href="articles.html" class="view-all-btn">查看所有文章</a>
                </div>
            </div>
        </section>

        <!-- 项目部分 -->
        <section id="projects" class="projects-section">
            <div class="container">
                <h2 class="section-title">我的空间</h2>
                <div class="projects-container">
                    <div class="project-item">
                        <h3>生活感悟</h3>
                        <p>记录日常里的片段与感受，留住生活的温度与细节。</p>
                    </div>
                    <div class="project-item">
                        <h3>工作思考</h3>
                        <p>分享设计与实践中的思考，梳理方法与成长路径。</p>
                    </div>
                    <div class="project-item">
                        <h3>关于石刻</h3>
                        <p>关注传统石刻的历史脉络与当代表达，探索文化之美。</p>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    // 插入内容到模板
    const html = template.replace('<!-- CONTENT -->', content);
    
    // 写入文件
    fs.writeFileSync(path.join(__dirname, 'index.html'), html);
    console.log('首页生成完成');
}

// 4. 生成文章列表页
function generateArticlesPage(posts, template) {
    // 按类型分组文章
    const articlesByType = {};
    posts.forEach(post => {
        if (!articlesByType[post.type]) {
            articlesByType[post.type] = [];
        }
        articlesByType[post.type].push(post);
    });
    
    // 添加"所有文章"分类
    articlesByType['所有文章'] = posts;
    
    // 获取所有类型，确保"所有文章"在最前面
    const types = ['所有文章', ...Object.keys(articlesByType).filter(type => type !== '所有文章')];
    
    // 生成标签页按钮 HTML
    const tabsHtml = types.map(type => `
        <button class="tab-btn ${type === '所有文章' ? 'active' : ''}" data-type="${type}">${type}</button>
    `).join('');
    
    // 生成标签页内容 HTML
    const tabContentsHtml = types.map((type, index) => {
        const articlesHtml = articlesByType[type].map(post => `
            <div class="article-item">
                <h3 class="article-title"><a href="posts/${post.slug}.html">${post.title}</a></h3>
                <p class="article-meta">${formatDate(post.date)} | ${post.type}</p>
                <p class="article-excerpt">${post.excerpt}</p>
                <a href="posts/${post.slug}.html" class="read-more">阅读更多</a>
            </div>
        `).join('');
        
        return `
            <div class="tab-content ${type === '所有文章' ? 'active' : ''}" data-type="${type}">
                ${articlesHtml}
            </div>
        `;
    }).join('');
    
    // 生成完整的文章列表页内容
    const content = `
        <section class="articles-page">
            <div class="container">
                <h2 class="section-title">所有文章</h2>
                <div class="article-tabs">
                    ${tabsHtml}
                </div>
                <div class="article-list">
                    ${tabContentsHtml}
                </div>
            </div>
        </section>
    `;
    
    // 插入内容到模板
    const html = template.replace('<!-- CONTENT -->', content);
    
    // 写入文件
    fs.writeFileSync(path.join(__dirname, 'articles.html'), html);
    console.log('文章列表页生成完成');
}

// 5. 生成文章详情页
function generatePostPages(posts, template) {
    posts.forEach(post => {
        // 生成完整的文章详情页内容
        const content = `
            <section class="post-section">
                <div class="container">
                    <div class="post-container">
                        <h1 class="post-title">${post.title}</h1>
                        <p class="post-meta">${formatDate(post.date)} | ${post.type}</p>
                        <div class="post-content">
                            ${post.content}
                        </div>
                        <a href="../articles.html" class="back-link">返回文章列表</a>
                    </div>
                </div>
            </section>
        `;
        
        // 插入内容到模板
        const html = template.replace('<!-- CONTENT -->', content);
        
        // 确保 posts 目录存在
        const postsDir = path.join(__dirname, 'posts');
        if (!fs.existsSync(postsDir)) {
            fs.mkdirSync(postsDir, { recursive: true });
        }
        
        // 写入文件
        fs.writeFileSync(path.join(postsDir, `${post.slug}.html`), html);
        console.log(`文章详情页生成完成: ${post.slug}.html`);
    });
}

// 辅助函数：格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// 主函数：生成所有页面
function generateAllPages() {
    console.log('开始生成页面...');
    
    try {
        // 读取所有 Markdown 文件
        const posts = readMarkdownFiles();
        console.log(`成功读取 ${posts.length} 篇文章`);
        
        // 读取基础模板
        const template = readTemplate();
        console.log('成功读取基础模板');
        
        // 生成首页
        generateHomepage(posts, template);
        
        // 生成文章列表页
        generateArticlesPage(posts, template);
        
        // 生成文章详情页
        generatePostPages(posts, template);
        
        console.log('所有页面生成完成！');
    } catch (error) {
        console.error('生成页面时出错:', error);
    }
}

// 运行生成函数
generateAllPages();
