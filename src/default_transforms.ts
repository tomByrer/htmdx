import { JSXTransform, Components } from './types';

export const classNameTransform: JSXTransform = (
  type: string,
  props: any,
  children: any[]
) => {
  if (props != null && 'class' in props) {
    props.className = props.class;
    delete props.class;
  }
  return [type, props, children];
};

export const getComponentTransform: (
  components: Components<any>
) => JSXTransform = components => (
  type: string,
  props: any,
  children: any[]
) => {
  if (typeof type === 'string' && components[type]) {
    // remap uppercase-leading tags to defined components
    type = components[type];
  }
  return [type, props, children];
};

export function performTransFormJSXToHTM(m: string): string {
  // transform JSX expressions to HTM expressions, but not in fenced blocks.
  return m.replace(/(```+)[\s\S]*?\2|={/g, (str, fence) =>
    fence ? str : '=${'
  );
}
