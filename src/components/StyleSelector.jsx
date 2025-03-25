import React, { useState } from 'react';
import '../styles/StyleSelector.css';

// 更丰富的样式选项
const STYLE_OPTIONS = [
  { 
    id: 'modernSimple', 
    name: '现代简约', 
    color: '#f8f9fa',
    pattern: 'none',
    description: '简洁优雅的纯色背景'
  },
  { 
    id: 'gradientPurple', 
    name: '渐变紫', 
    color: 'linear-gradient(135deg, #667eea, #764ba2)',
    pattern: 'none',
    description: '梦幻柔和的紫色渐变'
  },
  { 
    id: 'warmYellow', 
    name: '暖阳黄', 
    color: '#ffeaa7',
    pattern: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23f6ad55\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E")',
    description: '温暖舒适的黄色底纹'
  },
  { 
    id: 'oceanBlue', 
    name: '海风蓝', 
    color: '#e0f7fa',
    pattern: 'url("data:image/svg+xml,%3Csvg width=\'52\' height=\'26\' viewBox=\'0 0 52 26\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%2380deea\' fill-opacity=\'0.2\'%3E%3Cpath d=\'M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z\' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    description: '清新自然的海洋纹理'
  },
  { 
    id: 'darkNight', 
    name: '暗夜黑', 
    color: '#1e1e2e',
    pattern: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zm20.97 0l9.315 9.314-1.414 1.414L34.828 0h2.83zM22.344 0L13.03 9.314l1.414 1.414L25.172 0h-2.83zM32 0l12.142 12.142-1.414 1.414L30 .828 17.272 13.556l-1.414-1.414L28 0h4zM.284 0l28 28-1.414 1.414L0 2.544V0h.284zM0 5.373l25.456 25.455-1.414 1.415L0 8.2V5.374zm0 5.656l22.627 22.627-1.414 1.414L0 13.86v-2.83zm0 5.656l19.8 19.8-1.415 1.413L0 19.514v-2.83zm0 5.657l16.97 16.97-1.414 1.415L0 25.172v-2.83zM0 28l14.142 14.142-1.414 1.414L0 30.828V28zm0 5.657L11.314 44.97 9.9 46.386l-9.9-9.9v-2.828zm0 5.657L8.485 47.8 7.07 49.212 0 42.143v-2.83zm0 5.657l5.657 5.657-1.414 1.415L0 47.8v-2.83zm0 5.657l2.828 2.83-1.414 1.413L0 53.456v-2.83zM54.627 60L30 35.373 5.373 60H8.2L30 38.2 51.8 60h2.827zm-5.656 0L30 41.03 11.03 60h2.828L30 43.858 46.142 60h2.83zm-5.656 0L30 46.686 16.686 60h2.83L30 49.515 40.485 60h2.83zm-5.657 0L30 52.343 22.344 60h2.83L30 55.172 34.828 60h2.83zM32 60l-2-2-2 2h4zM59.716 0l-28 28 1.414 1.414L60 2.544V0h-.284zM60 5.373L34.544 30.828l1.414 1.415L60 8.2V5.374zm0 5.656L37.373 33.656l1.414 1.414L60 13.86v-2.83zm0 5.656l-19.8 19.8 1.415 1.413L60 19.514v-2.83zm0 5.657l-16.97 16.97 1.414 1.415L60 25.172v-2.83zM60 28L45.858 42.142l1.414 1.414L60 30.828V28zm0 5.657L48.686 44.97l1.415 1.415 9.9-9.9v-2.828zm0 5.657L51.515 47.8l1.414 1.414L60 42.143v-2.83zm0 5.657l-5.657 5.657 1.414 1.415L60 47.8v-2.83zm0 5.657l-2.828 2.83 1.414 1.413L60 53.456v-2.83zM39.9 16.385l1.414-1.414 1.414 1.414-1.414 1.414-1.414-1.414zm-2.83 2.83l1.415-1.414 1.414 1.415-1.414 1.414-1.414-1.415zm-2.827 2.827l1.414-1.414 1.414 1.414-1.414 1.414-1.414-1.414zm-2.83 2.83l1.415-1.415 1.414 1.415-1.414 1.414-1.414-1.415zm-2.827 2.827l1.414-1.414 1.414 1.414-1.414 1.414-1.414-1.414zm-2.83 2.83l1.415-1.415 1.414 1.415-1.414 1.414-1.414-1.415zm-2.827 2.827l1.414-1.414 1.414 1.414-1.414 1.414-1.414-1.414zM18.385 39.9l1.414-1.414 1.414 1.414-1.414 1.414-1.414-1.414zm-2.83-2.83l1.415-1.414 1.414 1.414-1.414 1.414-1.414-1.414zm-2.827-2.827l1.414-1.414 1.414 1.414-1.414 1.414-1.414-1.414zm-2.83-2.83l1.415-1.414 1.414 1.414-1.414 1.414-1.414-1.414zm-2.827-2.827l1.414-1.414 1.414 1.414-1.414 1.414-1.414-1.414zm-2.83-2.83l1.415-1.414 1.414 1.414-1.414 1.414-1.414-1.414zm-2.827-2.827l1.414-1.414 1.414 1.414-1.414 1.414-1.414-1.414z\' fill=\'%23304ffe\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
    description: '深邃神秘的星空质感'
  },
  { 
    id: 'springGreen', 
    name: '春日绿', 
    color: '#e6ffed',
    pattern: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%2334d399\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")',
    description: '清新自然的点缀纹理'
  },
  { 
    id: 'cherryBlossom', 
    name: '樱花粉', 
    color: '#FEE7F0',
    pattern: 'url("data:image/svg+xml,%3Csvg width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M12,0 C13.6568542,0 15,1.34314575 15,3 C15,4.65685425 13.6568542,6 12,6 C10.3431458,6 9,4.65685425 9,3 C9,1.34314575 10.3431458,0 12,0 Z M12,18 C13.6568542,18 15,19.3431458 15,21 C15,22.6568542 13.6568542,24 12,24 C10.3431458,24 9,22.6568542 9,21 C9,19.3431458 10.3431458,18 12,18 Z M3,9 C4.65685425,9 6,10.3431458 6,12 C6,13.6568542 4.65685425,15 3,15 C1.34314575,15 0,13.6568542 0,12 C0,10.3431458 1.34314575,9 3,9 Z M21,9 C22.6568542,9 24,10.3431458 24,12 C24,13.6568542 22.6568542,15 21,15 C19.3431458,15 18,13.6568542 18,12 C18,10.3431458 19.3431458,9 21,9 Z M7.75735931,4.24264069 C8.88684309,3.1131569 10.7158156,3.1131569 11.8452994,4.24264069 C12.9747832,5.37212447 12.9747832,7.20109701 11.8452994,8.33058079 C10.7158156,9.46006458 8.88684309,9.46006458 7.75735931,8.33058079 C6.62787553,7.20109701 6.62787553,5.37212447 7.75735931,4.24264069 Z M17.2426407,15.2426407 C18.3721245,14.1131569 20.201097,14.1131569 21.3305808,15.2426407 C22.4600646,16.3721245 22.4600646,18.201097 21.3305808,19.3305808 C20.201097,20.4600646 18.3721245,20.4600646 17.2426407,19.3305808 C16.1131569,18.201097 16.1131569,16.3721245 17.2426407,15.2426407 Z M4.24264069,17.2426407 C5.37212447,16.1131569 7.20109701,16.1131569 8.33058079,17.2426407 C9.46006458,18.3721245 9.46006458,20.201097 8.33058079,21.3305808 C7.20109701,22.4600646 5.37212447,22.4600646 4.24264069,21.3305808 C3.1131569,20.201097 3.1131569,18.3721245 4.24264069,17.2426407 Z M15.2426407,4.24264069 C16.3721245,3.1131569 18.201097,3.1131569 19.3305808,4.24264069 C20.4600646,5.37212447 20.4600646,7.20109701 19.3305808,8.33058079 C18.201097,9.46006458 16.3721245,9.46006458 15.2426407,8.33058079 C14.1131569,7.20109701 14.1131569,5.37212447 15.2426407,4.24264069 Z\' fill=\'%23FFACC7\' fill-opacity=\'0.18\'/%3E%3C/svg%3E")',
    description: '浪漫典雅的樱花元素'
  },
  { 
    id: 'marbleWhite', 
    name: '大理石', 
    color: 'linear-gradient(to right, #f5f7fa, #f0f2f5)',
    pattern: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23bdc3c7\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
    description: '高级感的大理石纹理'
  },
  { 
    id: 'goldenAutumn', 
    name: '金秋橙', 
    color: 'linear-gradient(to right, #ffefba, #ffffff)',
    pattern: 'url("data:image/svg+xml,%3Csvg width=\'52\' height=\'26\' viewBox=\'0 0 52 26\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ff9800\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z\' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    description: '温暖丰收的金秋色调'
  },
  { 
    id: 'galaxyDark', 
    name: '星空蓝', 
    color: 'linear-gradient(to bottom, #0f2027, #203a43, #2c5364)',
    pattern: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
    description: '深邃宇宙的星空质感'
  }
];

// 字体选项
const FONT_OPTIONS = [
  { id: 'default', name: '默认字体', fontFamily: 'var(--font-family)' },
  { id: 'songti', name: '宋体', fontFamily: 'SimSun, serif' },
  { id: 'kaiti', name: '楷体', fontFamily: 'KaiTi, cursive' },
  { id: 'yahei', name: '微软雅黑', fontFamily: 'Microsoft YaHei, sans-serif' },
  { id: 'fangsong', name: '仿宋', fontFamily: 'FangSong, serif' },
  { id: 'heiti', name: '黑体', fontFamily: 'SimHei, sans-serif' },
  { id: 'xingkai', name: '行楷', fontFamily: 'STXingkai, cursive' },
  { id: 'lishu', name: '隶书', fontFamily: 'LiSu, sans-serif' }
];

const StyleSelector = ({ selectedStyle, onStyleChange, selectedFont, onFontChange }) => {
  const [stylesSectionCollapsed, setStylesSectionCollapsed] = useState(false);
  const [fontsSectionCollapsed, setFontsSectionCollapsed] = useState(false);
  
  const toggleStylesSection = () => {
    setStylesSectionCollapsed(!stylesSectionCollapsed);
  };
  
  const toggleFontsSection = () => {
    setFontsSectionCollapsed(!fontsSectionCollapsed);
  };

  return (
    <div className="style-selector-container">
      <h2>个性化卡片样式</h2>
      
      <div className={`style-section ${stylesSectionCollapsed ? 'collapsed' : ''}`}>
        <div className="section-header" onClick={toggleStylesSection}>
          <h3>选择背景样式</h3>
          <button className="toggle-button">
            {stylesSectionCollapsed ? '展开' : '收起'}
            <span className={`arrow ${stylesSectionCollapsed ? 'down' : 'up'}`}></span>
          </button>
        </div>
        <p className="style-hint">精选多种精美背景，让您的文字更具视觉吸引力</p>
        
        <div className="style-options">
          {STYLE_OPTIONS.map(style => (
            <div 
              key={style.id}
              className={`style-option ${selectedStyle === style.id ? 'selected' : ''}`}
              onClick={() => onStyleChange(style.id)}
              style={{ 
                background: style.color,
                backgroundImage: style.pattern,
                color: ['darkNight', 'galaxyDark'].includes(style.id) ? '#fff' : '#333'
              }}
            >
              <div className="style-name">{style.name}</div>
              <div className="style-description">{style.description}</div>
              <div className="style-select-text">点击选择</div>
              {selectedStyle === style.id && (
                <div className="selected-mark">✓</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={`font-section ${fontsSectionCollapsed ? 'collapsed' : ''}`}>
        <div className="section-header" onClick={toggleFontsSection}>
          <h3>选择字体</h3>
          <button className="toggle-button">
            {fontsSectionCollapsed ? '展开' : '收起'}
            <span className={`arrow ${fontsSectionCollapsed ? 'down' : 'up'}`}></span>
          </button>
        </div>
        <p className="style-hint">挑选适合的字体风格展现文字魅力</p>
        
        <div className="font-options">
          {FONT_OPTIONS.map(font => (
            <div 
              key={font.id}
              className={`font-option ${selectedFont === font.id ? 'selected' : ''}`}
              onClick={() => onFontChange(font.id)}
              style={{ fontFamily: font.fontFamily }}
            >
              <span className="font-sample">字体预览</span>
              <span className="font-name">{font.name}</span>
              {selectedFont === font.id && (
                <div className="selected-mark">✓</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StyleSelector; 