// ============================================================================
// HEALTH ASSESSMENT PDF REPORT GENERATOR
// ============================================================================

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AssessmentResult } from './types/health-assessment';
import { QUESTIONS, getQuestionById } from './questions';
import { getOverallCategory } from './recommendations';

interface PDFOptions {
  name: string;
  phone: string;
  email?: string | null;
  answers?: Record<string, any>;
}

export async function generatePDFReport(
  result: AssessmentResult,
  options: PDFOptions
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });
  
  // Set default font encoding to handle special characters properly
  doc.setLanguage('en-US');

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let yPos = margin;

  // Colors
  const primaryColor = [220, 38, 38]; // Red-600
  const darkGray = [31, 41, 55]; // Gray-800
  const lightGray = [156, 163, 175]; // Gray-400
  const textColor = [255, 255, 255]; // White

  // Helper function to add logo and return the new yPos
  const addLogo = async (): Promise<number> => {
    const logoHeight = 12; // Logo height in mm
    const logoY = yPos;
    
    try {
      // Try to load logo from public folder
      const logoUrl = '/KR%20FITNESS%20LOGO%20BLACK%20BACKGROUND.png';
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      return new Promise<number>((resolve) => {
        const timeout = setTimeout(() => {
          // Fallback: text logo if image takes too long
          doc.setFontSize(18);
          doc.setTextColor(...primaryColor);
          doc.setFont('helvetica', 'bold');
          doc.text('KR FITNESS', margin, logoY + 8);
          resolve(logoY + 10);
        }, 2000);

        img.onload = () => {
          clearTimeout(timeout);
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              const imgData = canvas.toDataURL('image/png');
              doc.addImage(imgData, 'PNG', margin, logoY, 40, logoHeight);
              resolve(logoY + logoHeight);
            } else {
              throw new Error('Canvas context not available');
            }
          } catch (e) {
            // Fallback: text logo
            doc.setFontSize(18);
            doc.setTextColor(...primaryColor);
            doc.setFont('helvetica', 'bold');
            doc.text('KR FITNESS', margin, logoY + 8);
            resolve(logoY + 10);
          }
        };
        img.onerror = () => {
          clearTimeout(timeout);
          // Fallback: text logo
          doc.setFontSize(18);
          doc.setTextColor(...primaryColor);
          doc.setFont('helvetica', 'bold');
          doc.text('KR FITNESS', margin, logoY + 8);
          resolve(logoY + 10);
        };
        img.src = logoUrl;
      });
    } catch (e) {
      // Fallback: text logo
      doc.setFontSize(18);
      doc.setTextColor(...primaryColor);
      doc.setFont('helvetica', 'bold');
      doc.text('KR FITNESS', margin, logoY + 8);
      return logoY + 10;
    }
  };

  // Add logo and update yPos
  yPos = await addLogo();
  yPos += 8; // Space after logo before header

  // Header
  doc.setFontSize(20);
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('Health & Fitness Diagnostic Report', margin, yPos);
  yPos += 10;

  doc.setFontSize(9);
  doc.setTextColor(...lightGray);
  doc.setFont('helvetica', 'normal');
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.text(`Generated on: ${date}`, margin, yPos);
  const assessmentIdText = `Assessment ID: ${result.assessmentId}`;
  const assessmentIdWidth = doc.getTextWidth(assessmentIdText);
  doc.text(assessmentIdText, pageWidth - margin - assessmentIdWidth, yPos);
  yPos += 15;

  // Personal Information Section
  doc.setFontSize(14);
  doc.setTextColor(...textColor);
  doc.setFillColor(...darkGray);
  doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 25, 3, 3, 'F');
  
  yPos += 8;
  doc.setFont('helvetica', 'bold');
  doc.text('Personal Information', margin + 3, yPos);
  yPos += 6;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textColor);
  doc.text(`Name: ${options.name}`, margin + 3, yPos);
  yPos += 5;
  doc.text(`Phone: ${options.phone}`, margin + 3, yPos);
  if (options.email) {
    yPos += 5;
    doc.text(`Email: ${options.email}`, margin + 3, yPos);
  }
  yPos += 15;

  // Overall Score Section
  const category = getOverallCategory(result.scores.overall);
  const categoryLabels = {
    excellent: 'Excellent',
    good: 'Good',
    warning: 'Needs Attention',
    high_alert: 'High Alert',
  };

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('Overall Health Score', margin, yPos);
  yPos += 10;

  // Score circle (simplified as a box)
  const scoreBoxSize = 30;
  const scoreX = pageWidth / 2 - scoreBoxSize / 2;
  doc.setFillColor(...primaryColor);
  doc.roundedRect(scoreX, yPos, scoreBoxSize, scoreBoxSize, 5, 5, 'F');
  
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textColor);
  doc.text(result.scores.overall.toString(), scoreX + scoreBoxSize / 2, yPos + scoreBoxSize / 2 + 3, {
    align: 'center',
  });
  
  doc.setFontSize(12);
  doc.text('/100', scoreX + scoreBoxSize / 2, yPos + scoreBoxSize / 2 + 8, {
    align: 'center',
  });

  yPos += scoreBoxSize + 8;
  doc.setFontSize(14);
  doc.setTextColor(...primaryColor);
  doc.text(categoryLabels[category], pageWidth / 2, yPos, { align: 'center' });
  yPos += 8;

  doc.setFontSize(9);
  doc.setTextColor(...lightGray);
  doc.setFont('helvetica', 'italic');
  doc.text(getScoreDescription(result.scores.overall, category), margin, yPos, {
    maxWidth: pageWidth - 2 * margin,
  });
  yPos += 15;

  // Category Breakdown Table
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textColor);
  doc.text('Category Breakdown', margin, yPos);
  yPos += 8;

  const categoryData = [
    ['Category', 'Score', 'Max', 'Percentage'],
    ['Physical Health', result.scores.physical.toString(), '25', `${Math.round((result.scores.physical / 25) * 100)}%`],
    ['Nutrition', result.scores.nutrition.toString(), '15', `${Math.round((result.scores.nutrition / 15) * 100)}%`],
    ['Lifestyle', result.scores.lifestyle.toString(), '15', `${Math.round((result.scores.lifestyle / 15) * 100)}%`],
    ['Mental Fitness', result.scores.mental.toString(), '20', `${Math.round((result.scores.mental / 20) * 100)}%`],
    ['Pain & Mobility', result.scores.pain_mobility.toString(), '10', `${Math.round((result.scores.pain_mobility / 10) * 100)}%`],
    ['Goal Readiness', result.scores.goal_readiness.toString(), '15', `${Math.round((result.scores.goal_readiness / 15) * 100)}%`],
  ];

  autoTable(doc, {
    head: [categoryData[0]],
    body: categoryData.slice(1),
    startY: yPos,
    theme: 'striped',
    headStyles: {
      fillColor: primaryColor,
      textColor: textColor,
      fontStyle: 'bold',
    },
    bodyStyles: {
      textColor: [0, 0, 0],
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    margin: { left: margin, right: margin },
  });

  yPos = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 10 : yPos + 40;

  // BMI Section removed - considered outdated metric

  // Check if we need a new page (leave space for footer)
  const footerSpace = 25; // Space needed for footer
  if (yPos > pageHeight - footerSpace) {
    doc.addPage();
    yPos = margin;
  }

  // Recommendations Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textColor);
  doc.text('Personalized Recommendations', margin, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...lightGray);
  result.recommendations.forEach((rec, index) => {
    if (yPos > pageHeight - footerSpace) {
      doc.addPage();
      yPos = margin;
    }
    // Remove emojis first
    let cleanRec = rec.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();
    
    // Replace common contractions to avoid apostrophe font issues
    cleanRec = cleanRec
      .replace(/\bYou're\b/gi, 'You are')
      .replace(/\byou're\b/gi, 'you are')
      .replace(/\bcan't\b/gi, 'cannot')
      .replace(/\bdon't\b/gi, 'do not')
      .replace(/\bwon't\b/gi, 'will not')
      .replace(/\bit's\b/gi, 'it is')
      .replace(/\bI'm\b/gi, 'I am')
      .replace(/\bwe're\b/gi, 'we are')
      .replace(/\bthey're\b/gi, 'they are')
      .replace(/\bLet's\b/gi, 'Let us')
      .replace(/\blet's\b/gi, 'let us');
    
    // Replace any remaining apostrophes with space
    cleanRec = cleanRec.replace(/[''`]/g, ' ');
    
    // Normalize other special characters
    cleanRec = cleanRec
      .replace(/[""]/g, '"') // Normalize quotes
      .replace(/[–—]/g, '-') // Normalize dashes
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    
    // Final cleanup - ensure only safe ASCII characters
    cleanRec = cleanRec.replace(/[^\x20-\x7E]/g, ' ').replace(/\s+/g, ' ').trim();
    
    // Split text properly to handle line breaks
    const lines = doc.splitTextToSize(`${index + 1}. ${cleanRec}`, pageWidth - 2 * margin);
    lines.forEach((line: string) => {
      if (yPos > pageHeight - footerSpace) {
        doc.addPage();
        yPos = margin;
      }
      // Render text normally (jsPDF handles UTF-8 by default)
      doc.text(line, margin, yPos);
      yPos += 5;
    });
    yPos += 2; // Extra space between recommendations
  });
  yPos += 10;

  // Check if we need a new page for calculations
  if (yPos > pageHeight - footerSpace) {
    doc.addPage();
    yPos = margin;
  }

  // Score Calculation Explanation
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textColor);
  doc.text('Score Calculation Breakdown', margin, yPos);
  yPos += 8;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...lightGray);
  
  const calculationText = getCalculationExplanation(result.scores, options.answers || {});
  const lines = doc.splitTextToSize(calculationText, pageWidth - 2 * margin);
  lines.forEach((line: string) => {
    if (yPos > pageHeight - footerSpace) {
      doc.addPage();
      yPos = margin;
    }
    doc.text(line, margin, yPos);
    yPos += 5;
  });
  yPos += 10;

  // Detailed Answers (if space)
  if (options.answers && yPos < pageHeight - footerSpace - 50) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textColor);
    doc.text('Your Answers Summary', margin, yPos);
    yPos += 8;

    const sections = [
      { name: 'Physical Health', section: 'physical' },
      { name: 'Pain & Mobility', section: 'pain' },
      { name: 'Lifestyle & Nutrition', section: 'lifestyle' },
      { name: 'Mental Fitness', section: 'mental' },
      { name: 'Goal Readiness', section: 'goal' },
    ];

    sections.forEach(({ name, section }) => {
      if (yPos > pageHeight - footerSpace) {
        doc.addPage();
        yPos = margin;
      }
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryColor);
      doc.text(name, margin, yPos);
      yPos += 5;

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...lightGray);
      
      QUESTIONS.filter(q => q.section === section).forEach(q => {
        const answer = options.answers![q.id];
        if (answer !== undefined && answer !== null && answer !== '') {
          if (yPos > pageHeight - footerSpace) {
            doc.addPage();
            yPos = margin;
          }
          const answerLabel = getAnswerLabel(q, answer);
          doc.text(`• ${q.question}`, margin + 2, yPos);
          yPos += 4;
          doc.text(`  Answer: ${answerLabel}`, margin + 4, yPos);
          yPos += 5;
        }
      });
      yPos += 3;
    });
  }

  // Footer
  const totalPages = doc.getNumberOfPages();
  const footerMargin = 15; // Space from bottom for footer
  const footerLineHeight = 4;
  
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(...lightGray);
    doc.setFont('helvetica', 'italic');
    
    // Disclaimer text
    const disclaimerText = 'This report is generated based on your self-assessment responses. For professional medical advice, please consult with a healthcare provider.';
    const disclaimerLines = doc.splitTextToSize(disclaimerText, pageWidth - 2 * margin);
    let footerY = pageHeight - footerMargin;
    
    // Draw disclaimer lines from bottom up
    for (let j = disclaimerLines.length - 1; j >= 0; j--) {
      doc.text(disclaimerLines[j], pageWidth / 2, footerY, { align: 'center' });
      footerY -= footerLineHeight;
    }
    
    // Copyright and page number
    footerY -= footerLineHeight;
    doc.text(
      `© ${new Date().getFullYear()} KR Fitness Studio. All rights reserved. | Page ${i} of ${totalPages}`,
      pageWidth / 2,
      footerY,
      { align: 'center' }
    );
  }

  // Download PDF
  doc.save(`health-assessment-report-${result.assessmentId}.pdf`);
}

function getScoreDescription(score: number, category: string): string {
  switch (category) {
    case 'excellent':
      return 'Congratulations! You have an excellent health foundation. With professional guidance, you can optimize your routine and achieve even better results.';
    case 'good':
      return 'You\'re on the right track! Your health is in good shape. With structured guidance, you can reach your full potential and maintain long-term wellness.';
    case 'warning':
      return 'Your health needs attention. Several areas require improvement. A structured fitness program and lifestyle changes can help you improve significantly.';
    case 'high_alert':
      return 'Immediate professional guidance is recommended. Your health assessment indicates areas that need urgent attention. Book a consultation to create a personalized recovery and improvement plan.';
    default:
      return '';
  }
}

// BMI category function removed - BMI is no longer displayed in reports

function getAnswerLabel(question: any, answer: any): string {
  if (question.type === 'choice') {
    const choice = question.choices.find((c: any) => c.value === answer);
    return choice ? choice.label : String(answer);
  }
  if (question.type === 'scale') {
    const labels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    const num = parseInt(answer);
    return labels[num - 1] || String(answer);
  }
  if (question.type === 'numeric') {
    return `${answer} ${question.unit || ''}`.trim();
  }
  return String(answer);
}

function getCalculationExplanation(scores: any, answers: Record<string, any>): string {
  let explanation = 'HOW YOUR SCORES WERE CALCULATED:\n\n';
  
  explanation += 'PHYSICAL HEALTH (0-25 points):\n';
  explanation += '• Energy Level (1-5 scale): ' + (parseInt(answers.physical_energy) || 1) + ' → ' + 
    ((parseInt(answers.physical_energy) || 1) - 1) * 1.25 + ' points\n';
  explanation += '• Stairs Climbing: ' + (answers.physical_stairs === 'yes' ? 'Yes → 5 points' : 'No → 0 points') + '\n';
  const flexMap: Record<string, string> = {
    'very_flexible': 'Very Flexible → 5 points',
    'moderate': 'Moderate → 3.5 points',
    'somewhat_limited': 'Somewhat Limited → 2 points',
    'very_limited': 'Very Limited → 0.5 points',
  };
  explanation += '• Flexibility: ' + (flexMap[answers.physical_flexibility] || '0 points') + '\n';
  const exerciseMap: Record<string, string> = {
    'none': 'Not at all → 0 points',
    '1-2': '1-2 times/week → 1.5 points',
    '3-4': '3-4 times/week → 3 points',
    '5-6': '5-6 times/week → 4.5 points',
    'daily': 'Daily → 5 points',
  };
  explanation += '• Exercise Frequency: ' + (exerciseMap[answers.physical_exercise_frequency] || '0 points') + '\n';
  const stepsMap: Record<string, string> = {
    'under_3000': 'Under 3,000 → 0 points',
    '3000-5000': '3,000-5,000 → 1.5 points',
    '5000-8000': '5,000-8,000 → 3 points',
    '8000-10000': '8,000-10,000 → 4.5 points',
    'over_10000': 'Over 10,000 → 5 points',
  };
  explanation += '• Daily Steps: ' + (stepsMap[answers.physical_daily_steps] || '0 points') + '\n';
  explanation += `Total Physical Health Score: ${scores.physical}/25\n\n`;

  explanation += 'NUTRITION (0-15 points):\n';
  explanation += 'Based on breakfast habits, outside food consumption, sugar intake, water consumption, fruit intake, and late-night eating patterns.\n';
  explanation += `Total Nutrition Score: ${scores.nutrition}/15\n\n`;

  explanation += 'LIFESTYLE (0-15 points):\n';
  const sleepMap: Record<string, string> = {
    'under_5': 'Under 5 hours → 1 point',
    '5-6': '5-6 hours → 3 points',
    '6-7': '6-7 hours → 5 points',
    '7-8': '7-8 hours → 7.5 points',
    'over_8': 'Over 8 hours → 6 points',
  };
  explanation += '• Sleep Duration: ' + (sleepMap[answers.lifestyle_sleep_duration] || '0 points') + '\n';
  explanation += '• Sleep Quality (1-5 scale): ' + (parseInt(answers.lifestyle_sleep_quality) || 1) + ' → ' + 
    ((parseInt(answers.lifestyle_sleep_quality) || 1) - 1) * 1.875 + ' points\n';
  explanation += `Total Lifestyle Score: ${scores.lifestyle}/15\n\n`;

  explanation += 'MENTAL FITNESS (0-20 points):\n';
  const confidenceMap: Record<string, string> = {
    'very_confident': 'Very Confident → 4 points',
    'confident': 'Confident → 3.5 points',
    'moderate': 'Moderately Confident → 2.5 points',
    'somewhat': 'Somewhat Confident → 1.5 points',
    'not_confident': 'Not Very Confident → 0.5 points',
  };
  explanation += '• Confidence: ' + (confidenceMap[answers.mental_confidence] || '0 points') + '\n';
  
  const stressMap: Record<string, string> = {
    'excellent': 'Excellent → 4 points',
    'good': 'Good → 3.5 points',
    'moderate': 'Moderate → 2.5 points',
    'poor': 'Poor → 1.5 points',
    'very_poor': 'Very Poor → 0.5 points',
  };
  explanation += '• Stress Management: ' + (stressMap[answers.mental_stress_management] || '0 points') + '\n';
  
  const consistencyMap: Record<string, string> = {
    'very_consistent': 'Very Consistent → 4 points',
    'consistent': 'Consistent → 3.5 points',
    'moderate': 'Moderately Consistent → 2.5 points',
    'inconsistent': 'Inconsistent → 1.5 points',
    'very_inconsistent': 'Very Inconsistent → 0.5 points',
  };
  explanation += '• Consistency: ' + (consistencyMap[answers.mental_consistency] || '0 points') + '\n';
  
  const emotionalMap: Record<string, string> = {
    'never': 'Never → 4 points',
    'rarely': 'Rarely → 3.5 points',
    'sometimes': 'Sometimes → 2.5 points',
    'often': 'Often → 1.5 points',
    'very_often': 'Very Often → 0.5 points',
  };
  explanation += '• Emotional Eating: ' + (emotionalMap[answers.mental_emotional_eating] || '0 points') + '\n';
  
  const stressImpactMap: Record<string, string> = {
    'not_at_all': 'Not at All → 4 points',
    'slightly': 'Slightly → 3.5 points',
    'moderately': 'Moderately → 2.5 points',
    'significantly': 'Significantly → 1.5 points',
    'very_significantly': 'Very Significantly → 0.5 points',
  };
  explanation += '• Work/Life Stress Impact: ' + (stressImpactMap[answers.mental_work_life_stress] || '0 points') + '\n';
  explanation += `Total Mental Fitness Score: ${scores.mental}/20\n\n`;

  explanation += 'PAIN & MOBILITY (0-10 points):\n';
  explanation += 'Starting from 10 points, deductions are made based on pain frequency, sitting hours, flexibility limitations, and injury history.\n';
  explanation += `Total Pain & Mobility Score: ${scores.pain_mobility}/10\n\n`;

  explanation += 'GOAL READINESS (0-15 points):\n';
  explanation += 'Based on goal timeline, weekly commitment, training preference, and motivation level.\n';
  explanation += `Total Goal Readiness Score: ${scores.goal_readiness}/15\n\n`;

  explanation += `OVERALL SCORE: ${scores.overall}/100\n`;
  explanation += 'The overall score is the sum of all category scores, providing a comprehensive view of your health and fitness status.';

  return explanation;
}

