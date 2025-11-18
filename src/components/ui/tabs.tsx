import { useState } from 'react';

interface Tab {
  label: string;
  content: React.ReactNode;
  onClick?: () => void; // Added for custom click handling
}

interface TabsProps {
  tabs: Tab[];
  activeTab?: number; // Optional prop to control active tab from parent
  onTabClick?: (index: number) => void; // Optional callback for tab clicks
}

export function Tabs({ tabs, activeTab: controlledActiveTab, onTabClick }: TabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(0);

  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;

  const handleTabClick = (index: number, onClick?: () => void) => {
    if (onTabClick) {
      onTabClick(index);
    } else {
      setInternalActiveTab(index);
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <div>
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-2" aria-label="Tabs">
          {tabs.map((tab, index) => (
            <button
              key={tab.label}
              onClick={() => handleTabClick(index, tab.onClick)}
              className={`${
                index === activeTab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              } whitespace-nowrap py-2 px-3 border-b-2 font-medium text-lg focus:outline-none transition-colors duration-200 sm:text-xl`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="pt-6">
        {tabs[activeTab].content}
      </div>
    </div>
  );
}
