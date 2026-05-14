import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children, ...props }) => (
      <h1 className="scroll-mt-24 text-4xl font-black tracking-tight text-white md:text-5xl" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 className="scroll-mt-24 border-b border-zinc-800/70 pb-3 text-2xl font-bold tracking-tight text-white" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="scroll-mt-24 text-xl font-semibold tracking-tight text-white" {...props}>
        {children}
      </h3>
    ),
    p: ({ children, ...props }) => (
      <p className="leading-8 text-zinc-300" {...props}>
        {children}
      </p>
    ),
    a: ({ children, href, ...props }) => (
      <a href={href} className="font-medium text-purple-300 transition hover:text-purple-200 hover:underline" {...props}>
        {children}
      </a>
    ),
    ul: ({ children, ...props }) => (
      <ul className="ml-6 list-disc space-y-2 text-zinc-300" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="ml-6 list-decimal space-y-2 text-zinc-300" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="leading-7" {...props}>
        {children}
      </li>
    ),
    blockquote: ({ children, ...props }) => (
      <blockquote className="border-l-4 border-purple-500/40 bg-purple-500/10 px-4 py-3 text-zinc-200" {...props}>
        {children}
      </blockquote>
    ),
    hr: (props) => <hr className="border-zinc-800/70" {...props} />,
    table: ({ children, ...props }) => (
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm text-zinc-300" {...props}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }) => <thead className="border-b border-zinc-800/70 text-zinc-200" {...props}>{children}</thead>,
    tbody: ({ children, ...props }) => <tbody className="divide-y divide-zinc-800/70" {...props}>{children}</tbody>,
    tr: ({ children, ...props }) => <tr className="align-top" {...props}>{children}</tr>,
    th: ({ children, ...props }) => (
      <th className="px-4 py-3 font-semibold text-zinc-100" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td className="px-4 py-3 text-zinc-400" {...props}>
        {children}
      </td>
    ),
    code: ({ children, className, ...props }) => (
      <code className={`rounded-md border border-zinc-800 bg-zinc-950 px-1.5 py-0.5 font-mono text-[0.92em] text-purple-200 ${className || ''}`} {...props}>
        {children}
      </code>
    ),
    pre: ({ children, ...props }) => (
      <pre className="overflow-x-auto rounded-2xl border border-zinc-800/70 bg-zinc-950/90 p-4 text-sm leading-7 text-zinc-200" {...props}>
        {children}
      </pre>
    ),
    ...components,
  };
}
