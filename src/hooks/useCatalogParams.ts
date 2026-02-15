import { useSearchParams } from 'react-router';
import { useCallback } from 'react';

export const useCatalogParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('q') || '';
  
  const setPage = useCallback((newPage: number) => {
    setSearchParams((prev) => {
      const current = Number(prev.get('page')) || 1;
      if (current === newPage) return prev;

      const newParams = new URLSearchParams(prev);
      newParams.set('page', String(newPage));
      return newParams;
    });
  }, [setSearchParams]);

  const setSearch = useCallback((query: string) => {
    setSearchParams((prev) => {
      const current = prev.get('q') || '';
      if (current === query) return prev;

      const newParams = new URLSearchParams(prev);
      if (query) {
        newParams.set('q', query);
      } else {
        newParams.delete('q');
      }
      newParams.set('page', '1');
      return newParams;
    });
  }, [setSearchParams]);

  return {
    page,
    search,
    setPage,
    setSearch,
  };
};