<template>
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h4>轻叶图床</h4>
            <p>致力于提供最简单、最高效的图片管理和共享解决方案</p>
          </div>
          <div class="footer-section">
            <h4>快速链接</h4>
            <ul>
              <li><a href="/">首页</a></li>
              <li><a href="/about">关于我们</a></li>
              <li><a href="/terms">服务条款</a></li>
              <li><a href="/privacy">隐私政策</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>联系我们</h4>
            <p>Email: support@qingye.com</p>
            <p>电话: 400-123-4567</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2025 轻叶图床. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup>
  // 这里可以添加一些逻辑代码
  </script>
  
  <style scoped>
  .footer {
    background-color: #f8f9fa;
    padding: 40px 0;
    margin-top: 60px;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .footer-content {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
  }
  
  .footer-section {
    flex: 1;
    margin-right: 30px;
  }
  
  .footer-section h4 {
    margin-bottom: 15px;
    color: #333;
  }
  
  .footer-section p,
  .footer-section ul {
    color: #666;
    line-height: 1.6;
  }
  
  .footer-section ul {
    list-style: none;
    padding: 0;
  }
  
  .footer-section ul li {
    margin-bottom: 8px;
  }
  
  .footer-section a {
    color: #666;
    text-decoration: none;
  }
  
  .footer-section a:hover {
    color: #007bff;
  }
  
  .footer-bottom {
    border-top: 1px solid #e9ecef;
    padding-top: 20px;
    text-align: center;
    color: #666;
  }
  </style>