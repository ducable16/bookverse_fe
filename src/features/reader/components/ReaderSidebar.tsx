import { X, Type, Palette, AlignJustify, Bookmark, Highlighter, Sun, BookOpen, Moon, BookMarked, List } from 'lucide-react';

interface ReaderSettings {
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  pagesPerView: 1 | 2;
  theme: 'light' | 'sepia' | 'dark';
}

interface ReaderSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ReaderSettings;
  onSettingsChange: (settings: Partial<ReaderSettings>) => void;
  fonts: Array<{ name: string; value: string; category: string }>;
  activeTab: 'settings' | 'bookmarks' | 'highlights' | 'chapters';
  onTabChange: (tab: 'settings' | 'bookmarks' | 'highlights' | 'chapters') => void;
  children?: React.ReactNode;
}

const LINE_HEIGHTS = [
  { label: '1.4', value: 1.4 },
  { label: '1.6', value: 1.6 },
  { label: '1.8', value: 1.8 },
  { label: '2.0', value: 2.0 },
  { label: '2.2', value: 2.2 },
];

const PAGES_PER_VIEW = [
  { label: '1 Trang', value: 1 as const },
  { label: '2 Trang', value: 2 as const },
];

const THEMES = [
  { label: 'Sáng', value: 'light' as const, icon: Sun },
  { label: 'Sepia', value: 'sepia' as const, icon: BookOpen },
  { label: 'Tối', value: 'dark' as const, icon: Moon },
];

export const ReaderSidebar = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
  fonts,
  activeTab,
  onTabChange,
  children,
}: ReaderSidebarProps) => {
  const isDark = settings.theme === 'dark';
  const isSepia = settings.theme === 'sepia';

  const getBgClass = () => {
    if (isDark) return 'bg-gray-800 text-gray-100';
    if (isSepia) return 'bg-amber-50 text-amber-900';
    return 'bg-cream-100 text-gray-900';
  };

  const getHoverClass = () => {
    if (isDark) return 'hover:bg-gray-700';
    if (isSepia) return 'hover:bg-amber-100';
    return 'hover:bg-cream-200';
  };

  const getActiveClass = () => {
    if (isDark) return 'bg-gray-700';
    if (isSepia) return 'bg-amber-100';
    return 'bg-cream-200';
  };

  const getControlBgClass = () => {
    if (isDark) return 'bg-gray-700';
    if (isSepia) return 'bg-amber-100';
    return 'bg-white';
  };

  const getTextSecondaryClass = () => {
    if (isDark) return 'text-gray-400';
    if (isSepia) return 'text-amber-700';
    return 'text-gray-600';
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-80 md:w-96 z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
          } ${getBgClass()} shadow-2xl`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-gray-700' : isSepia ? 'border-amber-200' : 'border-gray-200'
          }`}>
          <h2 className="text-xl font-bold">Cài đặt đọc sách</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${getHoverClass()}`}
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className={`grid grid-cols-4 border-b ${isDark ? 'border-gray-700' : isSepia ? 'border-amber-200' : 'border-gray-200'
          }`}>
          <button
            onClick={() => onTabChange('chapters')}
            className={`flex items-center justify-center space-x-1 py-3 px-2 transition-colors ${activeTab === 'chapters'
              ? `border-b-2 border-accent-teal ${getActiveClass()}`
              : getHoverClass()
              }`}
          >
            <List className="w-4 h-4" />
            <span className="text-sm font-medium">Mục lục</span>
          </button>
          <button
            onClick={() => onTabChange('settings')}
            className={`flex items-center justify-center space-x-1 py-3 px-2 transition-colors ${activeTab === 'settings'
              ? `border-b-2 border-accent-teal ${getActiveClass()}`
              : getHoverClass()
              }`}
          >
            <Type className="w-4 h-4" />
            <span className="text-sm font-medium">Hiển thị</span>
          </button>
          <button
            onClick={() => onTabChange('bookmarks')}
            className={`flex items-center justify-center space-x-1 py-3 px-2 transition-colors ${activeTab === 'bookmarks'
              ? `border-b-2 border-accent-teal ${getActiveClass()}`
              : getHoverClass()
              }`}
          >
            <Bookmark className="w-4 h-4" />
            <span className="text-sm font-medium">Bookmark</span>
          </button>
          <button
            onClick={() => onTabChange('highlights')}
            className={`flex items-center justify-center space-x-1 py-3 px-2 transition-colors ${activeTab === 'highlights'
              ? `border-b-2 border-accent-teal ${getActiveClass()}`
              : getHoverClass()
              }`}
          >
            <Highlighter className="w-4 h-4" />
            <span className="text-sm font-medium">Highlight</span>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100vh-120px)] p-4">
          {activeTab === 'settings' ? (
            <div className="space-y-6">
              {/* Theme Selection */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${getTextSecondaryClass()}`}>
                  <Palette className="w-4 h-4 inline mr-2" />
                  Giao diện
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {THEMES.map((theme) => {
                    const IconComponent = theme.icon;
                    return (
                      <button
                        key={theme.value}
                        onClick={() => onSettingsChange({ theme: theme.value })}
                        className={`p-3 rounded-lg text-center transition-all ${settings.theme === theme.value
                          ? 'bg-accent-teal text-white ring-2 ring-accent-teal'
                          : getControlBgClass()
                          }`}
                      >
                        <IconComponent className="w-6 h-6 mb-1 mx-auto" />
                        <div className="text-xs font-medium">{theme.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Font Size */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${getTextSecondaryClass()}`}>
                  <Type className="w-4 h-4 inline mr-2" />
                  Cỡ chữ
                </label>
                <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${getControlBgClass()}`}>
                  <button
                    onClick={() => onSettingsChange({ fontSize: Math.max(12, settings.fontSize - 2) })}
                    className={`px-3 py-1 rounded transition-colors ${getHoverClass()}`}
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-medium">{settings.fontSize}px</span>
                  <button
                    onClick={() => onSettingsChange({ fontSize: Math.min(28, settings.fontSize + 2) })}
                    className={`px-3 py-1 rounded transition-colors ${getHoverClass()}`}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Font Family */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${getTextSecondaryClass()}`}>
                  <Type className="w-4 h-4 inline mr-2" />
                  Phông chữ
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(e) => onSettingsChange({ fontFamily: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-teal ${getControlBgClass()}`}
                >
                  {fonts.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.name} ({font.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Line Height */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${getTextSecondaryClass()}`}>
                  <AlignJustify className="w-4 h-4 inline mr-2" />
                  Khoảng cách dòng
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {LINE_HEIGHTS.map((lh) => (
                    <button
                      key={lh.value}
                      onClick={() => onSettingsChange({ lineHeight: lh.value })}
                      className={`py-2 rounded-lg text-center text-sm font-medium transition-all ${settings.lineHeight === lh.value
                        ? 'bg-accent-teal text-white'
                        : getControlBgClass()
                        }`}
                    >
                      {lh.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pages Per View */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${getTextSecondaryClass()}`}>
                  <BookMarked className="w-4 h-4 inline mr-2" />
                  Số trang hiển thị
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PAGES_PER_VIEW.map((ppv) => (
                    <button
                      key={ppv.value}
                      onClick={() => onSettingsChange({ pagesPerView: ppv.value })}
                      className={`py-2 rounded-lg text-center text-sm font-medium transition-all ${settings.pagesPerView === ppv.value
                        ? 'bg-accent-teal text-white'
                        : getControlBgClass()
                        }`}
                    >
                      {ppv.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            children
          )}
        </div>
      </aside>
    </>
  );
};
