import React, { useState, useEffect } from 'react';
import '../styles/TextInput.css';

const TextInput = ({ text, onTextChange }) => {
  // 确保初始text是字符串
  const safeInitialText = typeof text === 'string' ? text : '';
  const [localText, setLocalText] = useState(safeInitialText);
  const [charCount, setCharCount] = useState(0);
  
  useEffect(() => {
    // 确保传入的text是字符串
    const safeText = typeof text === 'string' ? text : String(text || '');
    setLocalText(safeText);
  }, [text]);
  
  useEffect(() => {
    // 防止localText为null或undefined
    const safeLocalText = localText || '';
    setCharCount(safeLocalText.length);
  }, [localText]);
  
  const handleTextChange = (e) => {
    // 直接从事件对象获取值，确保是字符串
    const newText = e.target.value;
    setLocalText(newText);
    onTextChange(newText);
  };
  
  return (
    <div className="text-input-container">
      <h2>文本输入</h2>
      <textarea
        className="text-input"
        value={localText || ''}
        onChange={handleTextChange}
        placeholder="在此输入您要转换的文字内容..."
        rows={6}
      />
      <div className="text-input-info">
        <span>支持自动分段，建议每段文字不超过500字</span>
        <span className="char-count">{charCount} 字</span>
      </div>
    </div>
  );
};

export default TextInput; 