/**
 * 文本处理工具函数
 */

/**
 * 估算一段文本在指定字体和大小下的显示行数
 * @param {string} text - 需要估算的文本
 * @param {number} fontSize - 字体大小(px)
 * @param {number} lineHeight - 行高倍数
 * @param {number} maxWidth - 容器最大宽度(px)
 * @returns {number} - 估算的行数
 */
export const estimateLines = (text, fontSize = 16, lineHeight = 1.8, maxWidth = 290) => {
  // 平均每个字符的宽度（根据中文字符和标点符号的平均宽度估算）
  const avgCharWidth = fontSize * 1.1;
  
  // 一行能容纳的平均字符数
  const charsPerLine = Math.floor(maxWidth / avgCharWidth);
  
  // 分割段落
  const paragraphs = text.split('\n');
  
  // 计算总行数
  let totalLines = 0;
  
  paragraphs.forEach(para => {
    if (para.trim() === '') {
      // 空行算一行
      totalLines += 1;
      return;
    }
    
    // 计算段落需要的行数并向上取整
    const paraLines = Math.ceil(para.length / charsPerLine);
    totalLines += paraLines;
  });
  
  // 段落之间的额外空行
  totalLines += paragraphs.length - 1;
  
  return totalLines;
};

/**
 * 计算文本容纳在一张卡片中所需的大约字符数
 * @param {number} maxLines - 卡片最大行数
 * @param {number} fontSize - 字体大小(px)
 * @param {number} lineHeight - 行高倍数
 * @param {number} maxWidth - 容器最大宽度(px)
 * @returns {number} - 大约可容纳的字符数
 */
export const calculateCharsPerCard = (maxLines = 26, fontSize = 14, lineHeight = 1.35, maxWidth = 290) => {
  // 平均每个字符的宽度
  const avgCharWidth = fontSize * 1.1;
  
  // 一行能容纳的平均字符数
  const charsPerLine = Math.floor(maxWidth / avgCharWidth);
  
  // 减去段落间的空行影响
  const effectiveLines = Math.max(maxLines - 3, 1); // 假设平均有3个段落空行
  
  return effectiveLines * charsPerLine;
};

/**
 * 智能分割文本到多个卡片
 * @param {string} text - 需要分割的完整文本
 * @param {number} fontSize - 字体大小(px)
 * @param {number} lineHeight - 行高倍数
 * @param {number} cardHeight - 卡片的高度(px)
 * @returns {string[]} - 分割后的文本数组，每项对应一个卡片
 */
export const splitTextIntoCards = (text, fontSize = 14, lineHeight = 1.35, cardHeight = 600) => {
  if (!text) return [];
  
  // 确保文本是字符串类型
  const safeText = typeof text === 'string' ? text : String(text || '');
  if (!safeText.trim()) return [];
  
  // 按行分割文本（更细粒度的分割单位）
  const lines = safeText.split(/\n/).filter(line => line.trim() !== '');
  
  // 估算总字符数
  const totalChars = lines.reduce((sum, line) => sum + line.length, 0);
  
  // 计算每张卡片的理想字符数 - 增加每张卡片容纳的文字量
  const charsPerCard = 550; // 增加每张卡片的文字量
  const estimatedCardCount = Math.max(1, Math.ceil(totalChars / charsPerCard));
  
  // 计算每张卡片的平均字符数，降低余量比例以容纳更多文字
  const idealCharsPerCard = Math.ceil(totalChars / estimatedCardCount) * 0.92;
  
  // 将行分组到卡片中
  const cards = [];
  let currentCard = '';
  let currentChars = 0;
  
  // 特殊标记，用于标识当前处理的是否是标题行
  let processingTitle = false;
  
  // 函数：检查是否为标题行
  const isTitleLine = (line) => {
    return /^(#|##|###|\*\*|一|二|三|四|五|六|七|八|九|十|结语)/.test(line.trim());
  };
  
  // 处理文本，将其分割到多个卡片中
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // 检测是否为标题或特殊内容
    const isTitle = isTitleLine(line);
    const isBookReference = line.includes('《') && line.includes('》');
    
    // 如果是标题或书名引用，标记为正在处理标题
    if (isTitle || isBookReference) {
      processingTitle = true;
      
      // 如果当前卡片已经有内容且添加标题会超出限制，先保存当前卡片
      if (currentChars > 0 && currentChars + line.length > idealCharsPerCard * 0.95) {
        cards.push(currentCard);
        currentCard = line;
        currentChars = line.length;
      } else {
        // 将标题添加到当前卡片
        currentCard = currentCard ? `${currentCard}\n${line}` : line;
        currentChars += line.length + (currentCard ? 1 : 0);
      }
    } else {
      // 非标题行
      processingTitle = false;
      
      // 如果这行会导致当前卡片超出字符限制，且当前卡片已有内容
      // 提高阈值，允许更多文字在同一卡片中
      if (currentChars > 0 && currentChars + line.length > idealCharsPerCard * 0.95) {
        // 保存当前卡片并开始新卡片
        cards.push(currentCard);
        currentCard = line;
        currentChars = line.length;
      } else {
        // 添加到当前卡片
        currentCard = currentCard ? `${currentCard}\n${line}` : line;
        currentChars += line.length + (currentCard ? 1 : 0);
      }
    }
  }
  
  // 保存最后一张卡片
  if (currentCard) {
    cards.push(currentCard);
  }
  
  // 平衡卡片长度
  return balanceCardLengths(cards);
};

/**
 * 平衡卡片长度，确保每张卡片内容大小相近
 * @param {string[]} cards - 分割后的卡片数组
 * @returns {string[]} - 平衡后的卡片数组
 */
const balanceCardLengths = (cards) => {
  if (cards.length <= 1) return cards;
  
  // 计算平均长度
  const totalLength = cards.reduce((sum, card) => sum + card.length, 0);
  const averageLength = totalLength / cards.length;
  
  // 如果最短卡片少于平均长度的60%，或最长卡片超过平均长度的140%，需要重新平衡
  let minLength = Infinity;
  let maxLength = 0;
  let minIndex = 0;
  let maxIndex = 0;
  
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].length < minLength) {
      minLength = cards[i].length;
      minIndex = i;
    }
    if (cards[i].length > maxLength) {
      maxLength = cards[i].length;
      maxIndex = i;
    }
  }
  
  // 如果分布已经相对均匀，不需要再平衡
  if (minLength >= averageLength * 0.6 && maxLength <= averageLength * 1.4) {
    return cards;
  }
  
  // 从最长的卡片转移内容到最短的卡片
  const result = [...cards];
  
  // 只有当最长和最短卡片相邻时才尝试平衡
  if (Math.abs(maxIndex - minIndex) === 1) {
    const longCard = result[maxIndex];
    const shortCard = result[minIndex];
    
    // 如果最长卡片在最短卡片之前
    if (maxIndex < minIndex) {
      // 拆分最长卡片
      const longCardLines = longCard.split('\n');
      const transferPoint = Math.floor(longCardLines.length * 0.8); // 转移20%的内容
      
      const newLongCard = longCardLines.slice(0, transferPoint).join('\n');
      const transferContent = longCardLines.slice(transferPoint).join('\n');
      
      // 更新卡片
      result[maxIndex] = newLongCard;
      result[minIndex] = transferContent + (shortCard ? '\n' + shortCard : '');
    } else {
      // 最长卡片在最短卡片之后
      const longCardLines = longCard.split('\n');
      const transferPoint = Math.floor(longCardLines.length * 0.2); // 转移20%的内容
      
      const transferContent = longCardLines.slice(0, transferPoint).join('\n');
      const newLongCard = longCardLines.slice(transferPoint).join('\n');
      
      // 更新卡片
      result[maxIndex] = newLongCard;
      result[minIndex] = (shortCard ? shortCard + '\n' : '') + transferContent;
    }
  }
  
  return result;
};

/**
 * 基于字符数量的简单文本分割（备用方案）
 * @param {string} text - 需要分割的完整文本
 * @param {number} maxCharsPerCard - 每张卡片的最大字符数
 * @returns {string[]} - 分割后的文本数组，每项对应一个卡片
 */
export const simpleSplitTextByChars = (text, maxCharsPerCard = 300) => {
  if (!text) return [];
  
  // 确保文本是字符串类型
  const safeText = typeof text === 'string' ? text : String(text || '');
  if (!safeText.trim()) return [];
  
  // 降低字符限制以避免截断，但提高比例
  const safeMaxChars = Math.floor(maxCharsPerCard * 0.85);
  
  // 按行分割文本
  const lines = safeText.split('\n').filter(line => line.trim() !== '');
  
  // 估算总字符数和目标卡片数量
  const totalChars = lines.reduce((sum, line) => sum + line.length, 0);
  // 生成适量的卡片，每张卡片字符更多
  const estimatedCardCount = Math.max(1, Math.ceil(totalChars / (safeMaxChars * 0.92)));
  
  // 每张卡片的理想字符数 - 增加到原来的92%
  const idealCharsPerCard = Math.ceil(totalChars / estimatedCardCount) * 0.92;
  
  const cards = [];
  let currentCard = '';
  let currentChars = 0;
  
  for (const line of lines) {
    // 如果添加这行会使当前卡片超出理想字符数的95%，且当前卡片已有内容
    if (currentChars > 0 && currentChars + line.length > idealCharsPerCard * 0.95) {
      // 保存当前卡片并开始新卡片
      cards.push(currentCard);
      currentCard = line;
      currentChars = line.length;
    } else {
      // 添加到当前卡片
      currentCard = currentCard ? `${currentCard}\n${line}` : line;
      currentChars += line.length + (currentCard ? 1 : 0);
    }
  }
  
  // 保存最后一张卡片
  if (currentCard) {
    cards.push(currentCard);
  }
  
  return cards;
}; 