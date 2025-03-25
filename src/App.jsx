import React, { useState, useEffect } from 'react';
import TextInput from './components/TextInput';
import StyleSelector from './components/StyleSelector';
import CardPreview from './components/CardPreview';
import { splitTextIntoCards, simpleSplitTextByChars } from './utils/textUtils';
import './styles/App.css';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const App = () => {
  const [text, setText] = useState('');
  const [style, setStyle] = useState('gradientPurple');
  const [font, setFont] = useState('default');
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [maxCharsPerCard, setMaxCharsPerCard] = useState(450);
  // 添加Markdown开关状态，默认开启
  const [isMarkdown, setIsMarkdown] = useState(true);
  const [contentFormat, setContentFormat] = useState('markdown');

  // 处理文本输入
  const handleTextChange = (newText) => {
    // 确保文本是字符串类型
    const safeText = typeof newText === 'string' ? newText : String(newText);
    setText(safeText);
  };

  // 处理样式选择
  const handleStyleChange = (newStyle) => {
    setStyle(newStyle);
  };
  
  // 处理字体选择
  const handleFontChange = (newFont) => {
    setFont(newFont);
  };

  // 处理Markdown开关切换
  const handleMarkdownToggle = () => {
    setIsMarkdown(!isMarkdown);
  };

  // 在useEffect中处理文本内容
  useEffect(() => {
    if (!text || typeof text !== 'string' || !text.trim()) {
      setCards([]); // 如果文本为空，则不显示卡片
      return;
    }
    
    try {
      let cardsResult = [];
      
      // 首先尝试使用更保守的字符限制进行分割
      const isMarkdownText = isMarkdown;
      const charLimit = isMarkdownText 
        ? Math.floor(calculateCharsPerCard() * 0.7) // Markdown格式需要更保守的字符限制
        : Math.floor(calculateCharsPerCard() * 0.8); // 普通文本可以多一些字符
      
      try {
        // 使用智能分割，无需指定卡片数量
        cardsResult = splitTextIntoCards(text, 14, 1.4, 580);
      } catch (error) {
        console.error('智能分割错误:', error);
        // 如果智能分割失败，使用更简单的方法
        cardsResult = simpleSplitTextByChars(text, charLimit);
      }
      
      // 确保至少有一张卡片
      if (!cardsResult || cardsResult.length === 0) {
        // 如果所有分割方法都失败，则整个文本放入一张卡片
        cardsResult = [text];
      }
      
      // 确保每个卡片文本都是字符串类型
      const safeCards = cardsResult.map(cardText => 
        typeof cardText === 'string' ? cardText : String(cardText || '')
      );
      
      setCards(safeCards);
    } catch (error) {
      console.error('处理文本错误:', error);
      // 在处理失败时仍然尝试显示原始文本
      setCards([text]);
    }
  }, [text, isMarkdown]);

  // 计算每张卡片可容纳的字符数
  const calculateCharsPerCard = () => {
    // 根据卡片尺寸、字体大小估算
    const fontSize = 14; // 假设字体大小为14px
    const charsPerLine = Math.floor(290 / (fontSize * 0.6)); // 假设每个字符宽度为字体大小的0.6倍
    const linesPerCard = Math.floor(550 / (fontSize * 1.35)); // 假设每行高度为字体大小的1.35倍
    
    return charsPerLine * linesPerCard * 0.8; // 留出20%的余量防止溢出
  };

  // 导出单张图片
  const exportSingleImage = async (cardElement, index) => {
    try {
      const canvas = await html2canvas(cardElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        allowTaint: true,
        logging: false
      });
      
      return {
        index,
        dataUrl: canvas.toDataURL('image/png')
      };
    } catch (error) {
      console.error('导出图片失败:', error);
      return null;
    }
  };

  // 批量导出图片
  const handleExportImages = async () => {
    if (cards.length === 0) return;
    
    setIsLoading(true);
    
    try {
      const cardElements = document.querySelectorAll('.card-preview');
      const exportPromises = Array.from(cardElements).map((el, index) => 
        exportSingleImage(el, index)
      );
      
      const results = await Promise.all(exportPromises);
      const validResults = results.filter(Boolean);
      
      // 如果只有一张卡片，直接下载
      if (validResults.length === 1) {
        const link = document.createElement('a');
        link.href = validResults[0].dataUrl;
        link.download = `卡片_1.png`;
        link.click();
      } 
      // 多张卡片打包下载
      else if (validResults.length > 1) {
        const zip = new JSZip();
        
        validResults.forEach((result, i) => {
          // 去掉base64头部信息
          const base64Data = result.dataUrl.replace(/^data:image\/png;base64,/, '');
          zip.file(`卡片_${i + 1}.png`, base64Data, { base64: true });
        });
        
        const zipContent = await zip.generateAsync({ type: 'blob' });
        saveAs(zipContent, '卡片图片集.zip');
      }
      
      // 显示成功提示
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
      
    } catch (error) {
      console.error('批量导出图片失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>长文转图片工具</h1>
        <p>将长文章转换为精美的图片卡片，支持自定义样式和批量导出</p>
      </header>
      
      <main className="main-content">
        <TextInput text={text} onTextChange={handleTextChange} />
        
        <div className="mode-selector">
          <label className="markdown-toggle">
            <input 
              type="checkbox" 
              checked={isMarkdown}
              onChange={handleMarkdownToggle}
            />
            <span className="toggle-label">启用Markdown格式</span>
          </label>
        </div>
        
        <StyleSelector 
          selectedStyle={style} 
          onStyleChange={handleStyleChange}
          selectedFont={font}
          onFontChange={handleFontChange}
        />
        
        <div className="preview-section">
          <h2>预览效果</h2>
          <p className="card-count">
            {cards.length > 0 ? (
              <>
                根据文本内容生成了 <span className="card-count-number">{cards.length}</span> 张卡片
                <span className="card-export-hint">
                  （点击导出图片按钮即可保存全部卡片）
                </span>
              </>
            ) : (
              <span className="card-hint">请输入文本内容生成卡片</span>
            )}
          </p>
          
          <div className="previews-container">
            {cards.length > 0 ? (
              cards.map((cardText, index) => {
                // 确保传递给CardPreview的文本是字符串
                const safeCardText = typeof cardText === 'string' ? cardText : String(cardText || '');
                
                return (
                  <CardPreview 
                    key={index} 
                    text={safeCardText} 
                    style={style}
                    font={font}
                    index={index}
                    total={cards.length}
                    maxCharsPerCard={maxCharsPerCard}
                    isMarkdown={isMarkdown}
                  />
                );
              })
            ) : (
              <div className="no-content-message">
                请在文本框中输入内容，系统将自动根据内容长度生成合适数量的卡片
              </div>
            )}
          </div>
          
          {cards.length > 0 && (
            <div className="export-actions">
              <button 
                className="export-button" 
                onClick={handleExportImages}
                disabled={isLoading}
              >
                {isLoading ? '处理中...' : '导出图片'} 
                <svg className="download-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 16L12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M9 13L12 16L15 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M20 16V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              
              {showSuccessMessage && (
                <div className="success-message">
                  <svg className="success-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 11.0857V12.0057C21.9988 14.1621 21.3005 16.2604 20.0093 17.9875C18.7182 19.7147 16.9033 20.9782 14.8354 21.5896C12.7674 22.201 10.5573 22.1276 8.53447 21.3803C6.51168 20.633 4.78465 19.2518 3.61096 17.4428C2.43727 15.6338 1.87979 13.4938 2.02168 11.342C2.16356 9.19029 2.99721 7.14205 4.39828 5.5028C5.79935 3.86354 7.69279 2.72111 9.79619 2.24587C11.8996 1.77063 14.1003 1.98806 16.07 2.86572" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 4L12 14.01L9 11.01" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  图片导出成功!
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <footer className="footer">
        <div className="footer-content">
          <p>© {new Date().getFullYear()} 长文转图片工具 | 支持自定义样式和批量导出</p>
          <p className="footer-tips">支持10种精美样式和8种字体, 让您的文字更具吸引力</p>
        </div>
      </footer>
    </div>
  );
};

export default App; 