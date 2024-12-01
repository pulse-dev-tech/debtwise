import React from 'react';
import { BookOpen, FileText, Video, Link as LinkIcon } from 'lucide-react';

const Education: React.FC = () => {
  const resources = [
    {
      category: 'Articles',
      icon: FileText,
      items: [
        {
          title: 'Understanding Different Types of Debt',
          description: 'Learn about various types of debt and their implications.',
          link: '#'
        },
        {
          title: 'Debt Payoff Strategies Explained',
          description: 'Detailed comparison of popular debt elimination methods.',
          link: '#'
        },
        {
          title: 'Building an Emergency Fund',
          description: 'How to create financial security while paying off debt.',
          link: '#'
        }
      ]
    },
    {
      category: 'Video Tutorials',
      icon: Video,
      items: [
        {
          title: 'Budgeting Basics',
          description: 'Step-by-step guide to creating and maintaining a budget.',
          link: '#'
        },
        {
          title: 'Credit Score Improvement',
          description: 'Tips and strategies for boosting your credit score.',
          link: '#'
        }
      ]
    },
    {
      category: 'External Resources',
      icon: LinkIcon,
      items: [
        {
          title: 'Federal Student Aid',
          description: 'Official government resources for student loan management.',
          link: 'https://studentaid.gov'
        },
        {
          title: 'Consumer Financial Protection Bureau',
          description: 'Financial education and consumer protection resources.',
          link: 'https://www.consumerfinance.gov'
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <BookOpen className="w-8 h-8 text-indigo-600" />
        <h1 className="text-3xl font-bold">Financial Education</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resources.map((category) => {
          const Icon = category.icon;
          
          return (
            <div key={category.category} className="card">
              <div className="flex items-center space-x-2 mb-4">
                <Icon className="w-6 h-6 text-indigo-600" />
                <h2 className="text-xl font-semibold">{category.category}</h2>
              </div>
              <div className="space-y-4">
                {category.items.map((item) => (
                  <a
                    key={item.title}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.description}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Financial Tips */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Quick Financial Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-semibold mb-2">Create an Emergency Fund</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Aim to save 3-6 months of living expenses for unexpected costs.
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-semibold mb-2">Track Your Spending</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Monitor your expenses to identify areas where you can cut back.
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-semibold mb-2">Prioritize High-Interest Debt</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Focus on paying off debts with the highest interest rates first.
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-semibold mb-2">Automate Your Payments</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Set up automatic payments to avoid late fees and missed payments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Education;