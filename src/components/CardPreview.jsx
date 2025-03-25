import React from 'react';
import '../styles/CardPreview.css';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const CardPreview = ({ text, style = 'modernSimple', font = 'default', index, total, isMarkdown = true, maxCharsPerCard = 450 }) => {
  const fonts = {
    default: 'var(--font-family)',
    songti: 'SimSun, serif',
    kaiti: 'KaiTi, cursive',
    yahei: 'Microsoft YaHei, sans-serif',
    fangsong: 'FangSong, serif',
    heiti: 'SimHei, sans-serif',
    xingkai: 'STXingkai, cursive',
    lishu: 'LiSu, sans-serif'
  };

  const processText = (text) => {
    // 确保传入的是字符串
    let content = '';
    
    try {
      if (text === null || text === undefined) {
        return '';
      }
      
      // 如果text不是字符串，则强制转换为字符串
      content = typeof text === 'string' ? text : JSON.stringify(text);
      
      // 如果text为空，直接返回空字符串
      if (!content.trim()) {
        return '';
      }
      
      // Markdown处理
      if (isMarkdown) {
        try {
          // 最简单的方式使用marked，不添加复杂配置
          marked.setOptions({
            breaks: true,
            gfm: true
          });
          
          // 先转换为HTML
          const html = marked.parse(content);
          
          // 清理HTML
          const safeHtml = DOMPurify.sanitize(html);
          
          // 修改样式以实现垂直居中显示
          return `<div style="text-align: justify; line-height: 1.35; display: flex; flex-direction: column; justify-content: center; height: 100%;">
            ${safeHtml.replace(/<p>/g, '<p style="margin: 0.25em 0; text-indent: 2em;">')}
          </div>`;
        } catch (error) {
          console.error('Markdown转换错误:', error);
          // 如果Markdown转换失败，回退到普通文本格式
          return `<p style="text-indent: 2em; display: flex; justify-content: center; align-items: center; height: 100%;">${content}</p>`;
        }
      } else {
        // 普通文本处理：分行，而不是分段
        const lines = content
          .split('\n')
          .filter(line => line.trim())
          .map((line, index, array) => {
            // 检测是否为书名引用（如《书名》），给予特殊处理
            if (line.includes('《') && line.includes('》')) {
              return `<p style="margin: 0.4em 0; text-indent: 2em; padding-bottom: 0.3em;">${line.trim()}</p>`;
            }
            // 检测是否为章节标题（一、二、三等），增加上方间距
            if (/^(#|##|###|\*\*|一|二|三|四|五|六|七|八|九|十|结语)/.test(line.trim()) || line.trim() === "结语") {
              return `<p style="margin: 0.6em 0 0.3em 0; text-indent: 1em; font-weight: bold;">${line.trim()}</p>`;
            }
            // 为最后一个行添加额外的底部边距
            if (index === array.length - 1) {
              return `<p style="margin: 0.25em 0; text-indent: 2em;">${line.trim()}</p>`;
            }
            // 普通行 - 减小行间距
            return `<p style="margin: 0.2em 0; text-indent: 2em;">${line.trim()}</p>`;
          })
          .join('');
          
        // 添加垂直居中的样式
        return `<div style="text-align: justify; line-height: 1.35; display: flex; flex-direction: column; justify-content: center; height: 100%;">${lines}</div>`;
      }
    } catch (error) {
      console.error('文本处理错误:', error);
      // 在任何情况下都返回安全内容
      return `<p style="display: flex; justify-content: center; align-items: center; height: 100%;">${String(text).replace(/[<>]/g, '')}</p>`;
    }
  };

  return (
    <div className="card">
      <div 
        className="card-preview"
        style={{ fontFamily: fonts[font] || fonts.default }}
        data-style={style}
      >
        {/* 装饰边框 */}
        <div className="card-border">
          <span className="border-top-left"></span>
          <span className="border-top-right"></span>
          <span className="border-bottom-left"></span>
          <span className="border-bottom-right"></span>
        </div>

        {/* 内容区域 - 添加垂直居中样式 */}
        <div className="card-body">
          <div 
            className="card-content"
            dangerouslySetInnerHTML={{ __html: processText(text) }}
          />
        </div>
      </div>
    </div>
  );
};

// 导出卡片容器组件
export const CardsContainer = ({ children }) => {
  return (
    <div className="cards-container">
      {children}
    </div>
  );
};

export default CardPreview; 