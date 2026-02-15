import { useState, useEffect, useMemo } from 'react';
import { useGetProductsQuery, type Product } from '../store/api/productsApi';
import { useCatalogParams } from '../hooks/useCatalogParams';
import { useDebounce } from '../hooks/useDebounce';
import Search from '../assets/search.svg?react';
import Update from '../assets/update.svg?react';
import Plus from '../assets/plus.svg?react';
import OutlinePlus from '../assets/outlineplus.svg?react';
import ThreeDots from '../assets/threedots.svg?react';
import CaretLeft from '../assets/caretleft.svg?react';
import CaretRight from '../assets/caretright.svg?react';

type SortOrder = 'asc' | 'desc' | undefined;

interface SortState {
  field: string | undefined;
  order: SortOrder;
}

const LIMIT = 20;

const Checkbox = ({ checked, onChange }: { checked?: boolean; onChange?: () => void }) => (
  <input
    type='checkbox'
    checked={checked}
    onChange={onChange}
    className='appearance-none relative w-[20px] h-[20px] border-[2px] border-solid border-[#ededed] rounded-[4px] cursor-pointer
    after:absolute after:bg-[#7076dd] after:bg-check after:bg-no-repeat after:bg-center after:bg-size-[16px_16px] 
    after:top-0 after:left-0 after:w-0 after:h-0 after:rounded-[2px] after:overflow-hidden 
    checked:after:w-[16px] checked:after:h-[16px] checked:border-[#7076dd]'
  />
);

const PriceDisplay = ({ price }: { price: number }) => {
  const formatted = price.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const [integer, fraction] = formatted.split(',');
  
  return (
    <span className="font-inter font-normal text-[16px]/[110%] text-[#222]">
      {integer}<span className="text-[#999]">,{fraction}</span>
    </span>
  );
};

const Toast = ({ message, onClose }: { message: string; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div 
      className="fixed top-5 right-5 z-50 animate-[slideIn_0.5s_ease-out_forwards]"
    >
      <div className="bg-[#232323] text-white px-6 py-4 rounded-[12px] shadow-lg flex items-center gap-3 min-w-[300px]">
        <div className="w-6 h-6 rounded-full bg-[#4caf50] flex items-center justify-center text-xs">✓</div>
        <div className="flex flex-col">
          <span className="font-inter font-semibold text-[14px]">Успешно</span>
          <span className="font-inter text-[13px] text-[#bcbcbc]">{message}</span>
        </div>
      </div>
    </div>
  );
};

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: Omit<Product, 'id' | 'rating' | 'image' | 'category'>) => void;
}

const AddProductModal = ({ isOpen, onClose, onAdd }: AddProductModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    vendor: '',
    article: '',
    price: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    onAdd({
      name: formData.name,
      vendor: formData.vendor || 'Unknown',
      article: formData.article || 'N/A',
      price: Number(formData.price),
    });
    
    setFormData({ name: '', vendor: '', article: '', price: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white w-[540px] rounded-[20px] p-[32px] shadow-2xl animate-[fadeIn_0.3s_ease-out]">
        <h3 className="font-inter font-bold text-[24px] text-[#232323] mb-[24px]">Добавить товар</h3>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
          <label className="flex flex-col gap-[6px] font-inter font-medium text-[14px] text-[#232323]">
            Наименование
            <input 
              required
              type="text" 
              className="border border-[#ededed] rounded-[12px] p-[12px] outline-none focus:border-[#7076dd] transition-colors"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </label>

          <div className="flex gap-[16px]">
            <label className="flex-1 flex flex-col gap-[6px] font-inter font-medium text-[14px] text-[#232323]">
              Вендор
              <input 
                type="text" 
                className="border border-[#ededed] rounded-[12px] p-[12px] outline-none focus:border-[#7076dd] transition-colors"
                value={formData.vendor}
                onChange={e => setFormData({...formData, vendor: e.target.value})}
              />
            </label>
            <label className="flex-1 flex flex-col gap-[6px] font-inter font-medium text-[14px] text-[#232323]">
              Артикул
              <input 
                type="text" 
                className="border border-[#ededed] rounded-[12px] p-[12px] outline-none focus:border-[#7076dd] transition-colors"
                value={formData.article}
                onChange={e => setFormData({...formData, article: e.target.value})}
              />
            </label>
          </div>

          <label className="flex flex-col gap-[6px] font-inter font-medium text-[14px] text-[#232323]">
            Цена (₽)
            <input 
              required
              type="number" 
              className="border border-[#ededed] rounded-[12px] p-[12px] outline-none focus:border-[#7076dd] transition-colors"
              value={formData.price}
              onChange={e => setFormData({...formData, price: e.target.value})}
            />
          </label>

          <div className="flex gap-[12px] mt-[16px]">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 h-[48px] rounded-[12px] border border-[#ededed] font-inter font-medium text-[#232323] hover:bg-[#f5f5f5] transition-colors"
            >
              Отмена
            </button>
            <button 
              type="submit" 
              className="flex-1 h-[48px] rounded-[12px] bg-[#242edb] font-inter font-medium text-white hover:bg-[#1e26b8] transition-colors"
            >
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TableRowSkeleton = ({ gridTemplate }: { gridTemplate: string }) => (
  <div className={`${gridTemplate} h-[71px] border-b-[1px] border-t-[1px] border-solid border-[#e2e2e2] animate-pulse`}>
    <div className="w-[20px] h-[20px] bg-[#ececeb] rounded-[4px]" />
    <div className="w-[48px] h-[48px] rounded-[8px] bg-[#ececeb]" />
    <div className="flex flex-col gap-2">
      <div className="h-[16px] w-[150px] bg-[#ececeb] rounded" />
      <div className="h-[14px] w-[100px] bg-[#ececeb] rounded" />
    </div>
    <div className="h-[16px] w-[80px] bg-[#ececeb] rounded" />
    <div className="h-[16px] w-[80px] bg-[#ececeb] rounded" />
    <div className="h-[16px] w-[40px] bg-[#ececeb] rounded" />
    <div className="h-[16px] w-[80px] bg-[#ececeb] rounded" />
    <div className="flex justify-end gap-[12px]">
       <div className="w-[52px] h-[27px] bg-[#ececeb] rounded-[23px]" />
       <div className="w-[32px] h-[32px] bg-[#ececeb] rounded-[50%]" />
    </div>
  </div>
);

export const Catalog = () => {
  const { page, search, setPage, setSearch } = useCatalogParams();
  
  const [localSearchValue, setLocalSearchValue] = useState(search || '');
  const debouncedSearch = useDebounce(localSearchValue, 500);

  useEffect(() => {
    if (debouncedSearch !== search) {
      setSearch(debouncedSearch);
    }
  }, [debouncedSearch, search, setSearch]);

  const [sortState, setSortState] = useState<SortState>(() => {
    const saved = localStorage.getItem('catalogSort');
    return saved ? JSON.parse(saved) : { field: undefined, order: undefined };
  });

  useEffect(() => {
    localStorage.setItem('catalogSort', JSON.stringify(sortState));
  }, [sortState]);

  const skip = (page - 1) * LIMIT;
  const { data, isLoading, isFetching } = useGetProductsQuery({
    limit: LIMIT,
    skip,
    q: search, 
    sortBy: sortState.field,
    order: sortState.order,
  });

  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const displayProducts = useMemo(() => {
    const apiProducts = data?.products || [];
    return [...localProducts, ...apiProducts];
  }, [data, localProducts]);

  const handleAddProduct = (newProductData: Omit<Product, 'id' | 'rating' | 'image' | 'category'>) => {
    const newProduct: Product = {
      id: `local-${Date.now()}`,
      ...newProductData,
      rating: 0,
      category: 'Новое',
      image: '',
    };

    setLocalProducts(prev => [newProduct, ...prev]);
    setShowToast(true);
  };

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const currentIds = displayProducts.map(p => p.id);
  const isAllSelected = currentIds.length > 0 && currentIds.every(id => selectedIds.has(id));

  const handleSelectAll = () => {
    const newSet = new Set(selectedIds);
    if (isAllSelected) {
      currentIds.forEach(id => newSet.delete(id));
    } else {
      currentIds.forEach(id => newSet.add(id));
    }
    setSelectedIds(newSet);
  };

  const handleSort = (field: string) => {
    setSortState(prev => {
      if (prev.field !== field) return { field, order: 'asc' };
      if (prev.order === 'asc') return { field, order: 'desc' };
      if (prev.order === 'desc') return { field: undefined, order: undefined };
      return { field, order: 'asc' };
    });
  };

  const getSortIndicator = (field: string) => {
    if (sortState.field !== field) return null;
    return sortState.order === 'asc' ? ' ↑' : ' ↓';
  };

  const gridTemplate = "grid grid-cols-[40px_60px_2fr_1fr_1fr_1fr_1fr_100px] gap-4 items-center px-[24px]";

  const totalItems = (data?.total || 0) + localProducts.length;
  const totalPages = Math.ceil(totalItems / LIMIT);
  const startItem = totalItems === 0 ? 0 : skip + 1;
  const endItem = Math.min(skip + LIMIT, totalItems);

  const renderPaginationButtons = () => {
    const buttons = [];
    let startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      if (i < 1) continue;
      const isActive = i === page;
      buttons.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`cursor-pointer font-inter w-[32px] h-[32px] flex items-center justify-center rounded-[8px] text-[14px] transition-colors
            ${isActive 
              ? 'bg-[#7076dd] text-white font-medium' 
              : 'border border-[#ececeb] text-[#b2b3b9] font-normal hover:bg-[#f5f5f5]'
            }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className="w-full overflow-auto min-h-screen bg-[#f6f6f6]">
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {showToast && (
        <Toast 
          key={Date.now()}
          message="Товар успешно добавлен в список" 
          onClose={() => setShowToast(false)} 
        />
      )}

      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddProduct} 
      />

      <header className="mt-[20px] w-full bg-white h-[105px] px-[30px] rounded-[10px] flex items-center gap-[310px]">
        <h1 className="font-inter font-bold text-[24px] text-[#202020]">Товары</h1>
        
        <div className="w-[1020px] h-[48px] bg-[#f3f3f3] rounded-[8px] flex items-center p-[12px_20px] gap-[8px]">
          <Search className="w-[24px] h-[24px]" />
          <input 
            type="text"
            name='search'
            value={localSearchValue}
            onChange={(e) => setLocalSearchValue(e.target.value)}
            placeholder="Найти" 
            className="bg-transparent outline-none w-full font-inter font-medium text-[14px]/[171%] placeholder-[#999]"
          />
        </div>
      </header>

      <main className="mt-[30px] p-[30px] rounded-[12px] bg-white">
        
        <div className="flex items-center justify-between">
          <h2 className="font-inter font-bold text-[20px]/[100%] text-[#333]">Все позиции</h2>
          
          <div className="flex items-center gap-[8px]">
            <button 
              onClick={() => window.location.reload()} 
              className="cursor-pointer w-[42px] h-[42px] border-[1px] border-solid border-[#ececeb] rounded-[8px] p-[10px] flex items-center justify-center hover:bg-[#f9f9f9] transition-colors"
            >
              <Update className="w-[22px] h-[22px]" />
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer w-[147px] h-[42px] p-[10px_20px] bg-[#242edb] font-inter font-semibold text-[14px] text-[#ebf3ea] rounded-[6px] flex items-center justify-center gap-[12px] hover:bg-[#1e26b8] transition-colors"
            >
              <Plus className="w-[22px] h-[22px]" />
              Добавить
            </button>
          </div>
        </div>

        <div className={`${gridTemplate} mt-[40px] h-[48px]`}>
          <Checkbox checked={isAllSelected} onChange={handleSelectAll} />
          
          <div onClick={() => handleSort('title')} className="col-span-2 flex items-center gap-1 cursor-pointer select-none group">
            <span className="text-[16px] font-inter font-bold text-[#b2b3b9] group-hover:text-[#7076dd] transition-colors">Наименование</span>
            <span className="text-[12px] text-[#7076dd]">{getSortIndicator('title')}</span>
          </div>

          <div onClick={() => handleSort('brand')} className="flex items-center gap-1 cursor-pointer select-none group">
            <span className="text-[16px] font-inter font-bold text-[#b2b3b9] group-hover:text-[#7076dd] transition-colors">Вендор</span>
            <span className="text-[12px] text-[#7076dd]">{getSortIndicator('brand')}</span>
          </div>

          <div onClick={() => handleSort('sku')} className="flex items-center gap-1 cursor-pointer select-none group">
            <span className="text-[16px] font-inter font-bold text-[#b2b3b9] group-hover:text-[#7076dd] transition-colors">Артикул</span>
            <span className="text-[12px] text-[#7076dd]">{getSortIndicator('sku')}</span>
          </div>

          <div onClick={() => handleSort('rating')} className="flex items-center gap-1 cursor-pointer select-none group">
            <span className="text-[16px] font-inter font-bold text-[#b2b3b9] group-hover:text-[#7076dd] transition-colors">Оценка</span>
            <span className="text-[12px] text-[#7076dd]">{getSortIndicator('rating')}</span>
          </div>

          <div onClick={() => handleSort('price')} className="flex items-center gap-1 cursor-pointer select-none group">
            <span className="text-[16px] font-inter font-bold text-[#b2b3b9] group-hover:text-[#7076dd] transition-colors">Цена, ₽</span>
            <span className="text-[12px] text-[#7076dd]">{getSortIndicator('price')}</span>
          </div>

          <span className="text-[16px] font-inter font-bold text-[#b2b3b9]"></span>
        </div>

        <div className="flex flex-col mt-[16px]">
          {(isLoading || isFetching) ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <TableRowSkeleton key={idx} gridTemplate={gridTemplate} />
            ))
          ) : (
            displayProducts.map((product) => (
              <div 
                key={product.id} 
                className={`${gridTemplate} h-[71px] border-b-[1px] border-t-[1px] border-solid border-[#e2e2e2] hover:bg-[#fafafa] transition-colors`}
              >
                <Checkbox 
                  checked={selectedIds.has(product.id)} 
                  onChange={() => toggleSelect(product.id)} 
                />
                
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-[48px] h-[48px] rounded-[8px] object-cover bg-[#d9d9d9]" 
                  />
                ) : (
                  <div className="w-[48px] h-[48px] rounded-[8px] bg-[#d9d9d9] flex items-center justify-center text-[10px] text-[#999]">
                    Нет фото
                  </div>
                )}
                
                <div className="flex flex-col justify-center">
                  <span className="font-inter font-bold text-[16px] text-[#161919] line-clamp-1" title={product.name}>
                    {product.name}
                  </span>
                  <span className="font-inter font-normal text-[14px] text-[#b2b3b9]">{product.category}</span>
                </div>

                <span className="font-inter font-bold text-[16px] text-[#000]">{product.vendor}</span>

                <span className="font-inter font-normal text-[16px] text-[#000]">{product.article || '-'}</span>

                <span className={`font-inter text-[16px] font-normal ${product.rating < 4.0 ? 'text-[#f11010]' : 'text-[#000]'}`}>
                  {product.rating}<span className='text-[#000]'>/5</span>
                </span>

                <PriceDisplay price={product.price} />

                <div className="flex items-center justify-end gap-[12px]">
                  <button className="cursor-pointer w-[52px] h-[27px] bg-[#242edb] rounded-[23px] p-[4px] flex items-center justify-center hover:bg-[#1e26b8] transition-colors">
                    <OutlinePlus className="w-[24px] h-[24px]" />
                  </button>
                  <button className="cursor-pointer w-[32px] h-[32px] flex items-center justify-center rounded-[50%] hover:bg-[#f0f0f0]">
                    <ThreeDots className="w-[32px] h-[32px]" />
                  </button>
                </div>
              </div>
            ))
          )}
          
          {!isLoading && displayProducts.length === 0 && (
            <div className="py-10 text-center text-[#999] font-inter">
              Ничего не найдено
            </div>
          )}
        </div>

        <div className="mt-[40px] mb-[20px] flex items-center justify-between">
          <span className="font-inter font-normal text-[18px] text-[#969b9f]">
            Показано <span className="text-[#333]">{startItem}-{endItem}</span> из <span className="text-[#333]">{totalItems}</span>
          </span>

          <div className="flex items-center gap-[8px]">
            <button 
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="cursor-pointer w-[32px] h-[32px] flex items-center justify-center hover:bg-[#f5f5f5] rounded-[8px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CaretLeft className="w-[20px] h-[20px]" />
            </button>
            
            {renderPaginationButtons()}

            <button 
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="cursor-pointer w-[32px] h-[32px] flex items-center justify-center hover:bg-[#f5f5f5] rounded-[8px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CaretRight className="w-[20px] h-[20px]" />
            </button>
          </div>
        </div>

      </main>
    </div>
  );
};