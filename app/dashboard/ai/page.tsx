import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { Dumbbell, FileText, MessageSquare, Instagram } from 'lucide-react';

export default async function AIToolsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  const aiTools = [
    {
      name: 'Workout Plan Generator',
      description: 'Generate personalized 4-week workout plans based on goals, experience, and equipment.',
      icon: Dumbbell,
      href: '/dashboard/ai/workout',
    },
    {
      name: 'Lead Notes Summarizer',
      description: 'Summarize free-text notes about leads and extract key insights.',
      icon: FileText,
      href: '/dashboard/leads', // Will be integrated into lead detail page
    },
    {
      name: 'Reply Helper',
      description: 'Generate WhatsApp/email reply templates based on lead context.',
      icon: MessageSquare,
      href: '/dashboard/leads', // Will be integrated into lead detail page
    },
    {
      name: 'IG Caption Helper',
      description: 'Generate Instagram caption suggestions for transformations and events.',
      icon: Instagram,
      href: '/dashboard/ai/captions',
    },
  ];

  return (
    <div className="p-4 lg:p-8">
      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8">AI Tools</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {aiTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className="premium-card rounded-2xl p-6 hover:border-red-500/30 transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <Icon className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">{tool.name}</h3>
                  <p className="text-gray-400">{tool.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
