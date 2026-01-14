import { useState, useEffect, useRef } from 'react';
import { Search, Plus, ChevronDown, X } from 'lucide-react';
import { categoriesService } from '@/services';
import type { Category } from '@/types/api.types';

interface CategorySelectProps {
    value: string;
    onChange: (categoryId: string, categoryName: string) => void;
    onAddCategory?: () => void;
}

export const CategorySelect = ({ value, onChange, onAddCategory }: CategorySelectProps) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await categoriesService.getAll();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedCategory = categories.find(c => String(c.id) === value);

    const handleSelect = (category: Category) => {
        onChange(String(category.id), category.name);
        setIsOpen(false);
        setSearchQuery('');
    };

    const handleAddNew = () => {
        setIsOpen(false);
        onAddCategory?.();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-400 bg-white text-left flex items-center justify-between"
            >
                <span className={selectedCategory ? 'text-gray-900' : 'text-gray-400'}>
                    {selectedCategory ? selectedCategory.name : 'Chọn danh mục...'}
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-hidden">
                    {/* Search Box */}
                    <div className="p-3 border-b border-gray-200">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Tìm kiếm danh mục..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-400 text-sm"
                                onClick={(e) => e.stopPropagation()}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Add New Button */}
                    {onAddCategory && (
                        <button
                            type="button"
                            onClick={handleAddNew}
                            className="w-full px-4 py-3 flex items-center space-x-2 text-coral-600 hover:bg-coral-50 transition-colors border-b border-gray-200"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="font-medium">Thêm danh mục mới</span>
                        </button>
                    )}

                    {/* Categories List */}
                    <div className="max-h-60 overflow-y-auto">
                        {loading ? (
                            <div className="px-4 py-8 text-center text-gray-500">
                                Đang tải...
                            </div>
                        ) : filteredCategories.length === 0 ? (
                            <div className="px-4 py-8 text-center text-gray-500">
                                {searchQuery ? 'Không tìm thấy danh mục' : 'Chưa có danh mục nào'}
                            </div>
                        ) : (
                            filteredCategories.map((category) => (
                                <button
                                    key={category.id}
                                    type="button"
                                    onClick={() => handleSelect(category)}
                                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${String(category.id) === value ? 'bg-coral-50' : ''
                                        }`}
                                >
                                    <div className="font-medium text-gray-900">{category.name}</div>
                                    {category.description && (
                                        <div className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                                            {category.description}
                                        </div>
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
