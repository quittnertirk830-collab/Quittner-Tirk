import fs from 'fs';

const fixExplanations = (filePath: string) => {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  content = content.replace(/explanation: '本题考查关于“\$\{questionText\.substring\(0, 15\)\}\.\.\.”的相关知识点。请结合演出经纪人资格证相关法规与基础知识点进行准确记忆。'/g, (match, offset, string) => {
    // Let's find the text of the question. We'll search backward from this match.
    const textMatch = string.substring(0, offset).match(/text: '([^']+)'/g);
    if (!textMatch) return `'本题为基础知识考查。'`;
    
    const lastText = textMatch[textMatch.length - 1];
    const questionText = lastText.replace("text: '", "").replace("'", "");
    
    return `explanation: '本题考查关于“${questionText.substring(0, 15)}...”的相关知识点。请结合演出经纪人资格证相关法规与基础知识点进行准确记忆。'`;
  });

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Fixed ${filePath}`);
};

fixExplanations('src/data.ts');
fixExplanations('src/data-yanchu.ts');
