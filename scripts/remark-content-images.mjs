// Build-time checks for Markdown and literal MDX images. MDX is trusted repository code.
import { visit } from 'unist-util-visit';
export function contentImages({ base = '/' } = {}) {
  return (tree, file) =>
    visit(tree, (node) => {
      if (node.type === 'image' || node.type === 'imageReference') {
        if (!node.alt?.trim())
          file.fail('Toda imagem informativa precisa de alt.', node);
        if (
          node.type === 'image' &&
          node.url.startsWith('/') &&
          !node.url.startsWith('//')
        )
          node.url = base.replace(/\/$/, '') + node.url;
      }
      if (
        (node.type === 'mdxJsxFlowElement' ||
          node.type === 'mdxJsxTextElement') &&
        node.name === 'img'
      ) {
        file.fail(
          'Use Figure (dimensões e alt obrigatórios) ou imagem Markdown em vez de <img>.',
          node,
        );
      }
      if (node.type === 'html' && /<img\b/i.test(node.value))
        file.fail('Use imagem Markdown em vez de HTML <img>.', node);
    });
}
