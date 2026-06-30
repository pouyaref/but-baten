// src/services/wikipedia.ts

import { SearchResult } from '../types';

export async function searchWikipedia(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`
    );
    const data = await response.json();

    if (!data.query?.search) return [];

    return data.query.search.map((item: any) => ({
      title: item.title,
      content: item.snippet?.replace(/<[^>]*>/g, '') || '',
      source: 'wikipedia-en',
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title)}`,
      relevance: 0.7,
    }));
  } catch {
    return [];
  }
}

export async function searchWikipediaFa(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetch(
      `https://fa.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`
    );
    const data = await response.json();

    if (!data.query?.search) return [];

    return data.query.search.map((item: any) => ({
      title: item.title,
      content: item.snippet?.replace(/<[^>]*>/g, '') || '',
      source: 'wikipedia-fa',
      url: `https://fa.wikipedia.org/wiki/${encodeURIComponent(item.title)}`,
      relevance: 0.7,
    }));
  } catch {
    return [];
  }
}