// ============================================================================
// HEALTH ASSESSMENT REPORT GENERATOR
// ============================================================================

import { AssessmentResult } from './types/health-assessment';
import { QUESTIONS, getQuestionById } from './questions';
import { getOverallCategory } from './recommendations';

export function generateReport(
  result: AssessmentResult,
  name: string,
  phone: string,
  email?: string,
  answers?: Record<string, any>
): string {
  const category = getOverallCategory(result.scores.overall);
  const categoryLabels = {
    excellent: 'Excellent',
    good: 'Good',
    warning: 'Needs Attention',
    high_alert: 'High Alert',
  };
  
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  let report = `╔═══════════════════════════════════════════════════════════════╗
║          HEALTH & FITNESS DIAGNOSTIC REPORT                ║
║                    KR Fitness Studio                       ║
╚═══════════════════════════════════════════════════════════════╝

Generated on: ${date}
Assessment ID: ${result.assessmentId}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PERSONAL INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${name}
Phone: ${phone}
${email ? `Email: ${email}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OVERALL HEALTH SCORE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Score: ${result.scores.overall}/100
Category: ${categoryLabels[category]}

${getScoreDescription(result.scores.overall, category)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CATEGORY BREAKDOWN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Physical Health:     ${result.scores.physical}/25  ${getPercentageBar(result.scores.physical, 25)}
Nutrition:           ${result.scores.nutrition}/15  ${getPercentageBar(result.scores.nutrition, 15)}
Lifestyle:           ${result.scores.lifestyle}/15  ${getPercentageBar(result.scores.lifestyle, 15)}
Mental Fitness:      ${result.scores.mental}/20     ${getPercentageBar(result.scores.mental, 20)}
Pain & Mobility:     ${result.scores.pain_mobility}/10   ${getPercentageBar(result.scores.pain_mobility, 10)}
Goal Readiness:      ${result.scores.goal_readiness}/15   ${getPercentageBar(result.scores.goal_readiness, 15)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PERSONALIZED RECOMMENDATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

  result.recommendations.forEach((rec, index) => {
    report += `${index + 1}. ${rec}\n`;
  });

  if (answers) {
    report += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DETAILED ANSWERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

    const sections = [
      { name: 'Physical Health', section: 'physical' },
      { name: 'Pain & Mobility', section: 'pain' },
      { name: 'Lifestyle & Nutrition', section: 'lifestyle' },
      { name: 'Mental Fitness', section: 'mental' },
      { name: 'Goal Readiness', section: 'goal' },
    ];

    sections.forEach(({ name, section }) => {
      report += `\n${name}:\n`;
      QUESTIONS.filter(q => q.section === section).forEach(q => {
        const answer = answers[q.id];
        if (answer !== undefined && answer !== null && answer !== '') {
          const answerLabel = getAnswerLabel(q, answer);
          report += `  • ${q.question}\n    Answer: ${answerLabel}\n`;
        }
      });
    });
  }

  report += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NEXT STEPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Book a free consultation at KR Fitness Studio to get personalized
guidance from our expert trainers and create a customized fitness
plan tailored to your goals and current health status.

Contact us:
📞 Phone: [Your Studio Phone]
📧 Email: [Your Studio Email]
🌐 Website: [Your Website]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This report is generated based on your self-assessment responses.
For professional medical advice, please consult with a healthcare
provider. This assessment is not a substitute for professional
medical evaluation.

© ${new Date().getFullYear()} KR Fitness Studio. All rights reserved.
`;

  return report;
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

function getPercentageBar(score: number, max: number): string {
  const percentage = Math.round((score / max) * 100);
  const filled = Math.round(percentage / 5);
  const empty = 20 - filled;
  return '[' + '█'.repeat(filled) + '░'.repeat(empty) + `] ${percentage}%`;
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


