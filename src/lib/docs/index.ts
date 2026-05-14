import { DOC_NAV, DOC_PAGES, DOC_API_PAGES, type DocPageMeta } from '@/content/docs/navigation';

export type { DocPageMeta } from '@/content/docs/navigation';

export function getAllDocPages() {
  return DOC_PAGES;
}

export function getAllApiPages() {
  return DOC_API_PAGES;
}

export function getDocByHref(href: string): DocPageMeta | undefined {
  return DOC_PAGES.find((page) => page.href === href) || DOC_API_PAGES.find((page) => page.href === href);
}

export function getDocsGroupByHref(href: string) {
  return DOC_NAV.find((group) => group.items.some((item) => item.href === href));
}

export function getDocsBreadcrumbs(href: string) {
  const page = getDocByHref(href);
  const group = getDocsGroupByHref(href);

  return [
    { label: 'Docs', href: '/docs' },
    group ? { label: group.title, href } : null,
    page ? { label: page.title, href } : null,
  ].filter(Boolean) as Array<{ label: string; href: string }>;
}

export function flattenDocIndex() {
  return [...DOC_PAGES, ...DOC_API_PAGES];
}
