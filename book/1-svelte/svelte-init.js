// This code was copied from node_modules/svelte/internal/index.js.
function init(
  component,
  options,
  instance,
  create_fragment,
  not_equal,
  prop_names
) {
  const parent_component = exports.current_component;
  set_current_component(component);
  const props = options.props || {};

  const $$ = (component.$$ = {
    fragment: null,
    ctx: null,
    // state
    props: prop_names,
    update: noop,
    not_equal,
    bound: blank_object(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    before_update: [],
    after_update: [],
    context: new Map(parent_component ? parent_component.$$.context : []),
    // everything else
    callbacks: blank_object(),
    dirty: null
  });

  let ready = false;

  $$.ctx = instance
    ? instance(component, props, (key, ret, value = ret) => {
        if ($$.ctx && not_equal($$.ctx[key], ($$.ctx[key] = value))) {
          if ($$.bound[key]) $$.bound[key](value);
          if (ready) make_dirty(component, key);
        }
        return ret;
      })
    : props;

  $$.update();

  ready = true;

  run_all($$.before_update);

  $$.fragment = create_fragment($$.ctx);

  if (options.target) {
    if (options.hydrate) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      $$.fragment.l(children(options.target));
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      $$.fragment.c();
    }
    if (options.intro) transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor);
    flush();
  }

  set_current_component(parent_component);
}

if (typeof HTMLElement !== 'undefined') {
  exports.SvelteElement = class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
      // @ts-ignore todo: improve typings
      for (const key in this.$$.slotted) {
        // @ts-ignore todo: improve typings
        this.appendChild(this.$$.slotted[key]);
      }
    }

    attributeChangedCallback(attr, _oldValue, newValue) {
      this[attr] = newValue;
    }

    $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop;
    }

    $on(type, callback) {
      // TODO should this delegate to addEventListener?
      const callbacks =
        this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return () => {
        const index = callbacks.indexOf(callback);
        if (index !== -1) callbacks.splice(index, 1);
      };
    }

    $set() {
      // overridden by instance, if it has props
    }
  };
}
