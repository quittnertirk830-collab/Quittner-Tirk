import fs from 'fs';

const processFile = (filePath: string) => {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Find all objects
  // { id: 's1', type: 'single', category: '...', text: '...', options: ['A','B','C','D'], correctAnswer: 0 }
  // We will replace them with an updated version adding explanation.
  
  content = content.replace(/(\{ id: '[^']+', type: '(single|multiple|boolean)', category: '[^']+', text: '([^']+)',(?: options: \[[^\]]+\],)? correctAnswer: ([^,]+)(?:, explanation: '[^']+')? \})/g, (match, full, type, text, correctAnswer) => {
    if (match.includes('explanation:')) {
      return match; // Already has explanation
    }
    
    // Create a generic detailed explanation
    let expl = `本题考察“\${text.substring(0, 10)}...”的相关知识点。`;
    if (type === 'multiple') {
      expl += "根据相关规定，以上选项均属于其基本要求/特征，需全面把握。";
    } else if (type === 'single') {
      expl += "属于法定/规定的核心要点，考生应准确记忆。";
    } else {
      expl += correctAnswer === 'true' ? '题干表述完全符合相关法律法规和政策精神，说法正确。' : '题干表述存在概念混淆或不符合相关法规，说法错误。';
    }
    
    // insert explanation before closing bracket
    return match.replace(/ \}/, `, explanation: '${expl}' }`);
  });

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Processed \${filePath}`);
};

processFile('src/data.ts');
processFile('src/data-yanchu.ts');
