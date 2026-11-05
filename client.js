window.__ModuleLoader__.load({
  id: '@local/dsh-clippy-companion',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    const NS = 'clippy-companion';
    const FRAME_W = 124;
    const FRAME_H = 93;
    const MARGIN = 12;
    const TOP_INSET = 56;
    const STORAGE_KEY = 'dsh.clippy-companion.position.v1';
    const SPRITE_URL = '/clippy-companion/clippy-map.png';
    const MANIFEST_URL = '/clippy-companion/sprite-data.json';
    const BUBBLE_MS = 7000;

    // Idle loops are short and unobtrusive; the long sleep animations would
    // make the companion look frozen, so they are left out.
    const IDLE_ANIMATIONS = [
      'Idle1_1',
      'IdleSideToSide',
      'IdleHeadScratch',
      'IdleFingerTap',
      'IdleEyeBrowRaise',
      'IdleAtom',
      'LookLeft',
      'LookRight',
      'LookUp',
      'LookDown',
      'LookUpLeft',
      'LookUpRight',
      'LookDownLeft',
      'LookDownRight',
    ];

    const SPEECH = [
      { key: 'line1', anim: 'Thinking' },
      { key: 'line2', anim: 'Searching' },
      { key: 'line3', anim: 'GestureLeft' },
      { key: 'line4', anim: 'Congratulate' },
      { key: 'line5', anim: 'Explain' },
      { key: 'line6', anim: 'Alert' },
      { key: 'line7', anim: 'Writing' },
      { key: 'line8', anim: 'GetAttention' },
      { key: 'line9', anim: 'CheckingSomething' },
      { key: 'line10', anim: 'GetTechy' },
      { key: 'line11', anim: 'GestureUp' },
      { key: 'line12', anim: 'Hearing_1' },
      { key: 'line13', anim: 'GestureRight' },
      { key: 'line14', anim: 'Processing' },
      { key: 'line15', anim: 'GetWizardy' },
      { key: 'line16', anim: 'GestureDown' },
      { key: 'line17', anim: 'Save' },
      { key: 'line18', anim: 'Print' },
      { key: 'line19', anim: 'SendMail' },
      { key: 'line20', anim: 'Wave' },
    ];

    const DICTS = {
      en: {
        aria: 'Clippy companion. Drag to move. Press Enter for a comment.',
        hint: 'Drag me — or press Enter to chat',
        line1: "It looks like you're writing code. Want some help with that?",
        line2: 'I found a semicolon hiding behind the sofa.',
        line3: 'Drag me anywhere in the chat. I promise to stay out of the sidebar.',
        line4: 'The tests pass. I checked twice.',
        line5: 'Have you tried turning the tool call off and on again?',
        line6: "I'm not saying it's a race condition, but it only happens sometimes.",
        line7: "That's a nice commit message. Very descriptive.",
        line8: "Would you like me to explain that stack trace? It's a long one.",
        line9: "I see you're reading the docs. Bold move.",
        line10: "Your token budget called. It's nervous.",
        line11: 'Everything is under control. Probably.',
        line12: "I can help! I just can't reach the keyboard.",
        line13: 'Have you considered a smaller diff?',
        line14: 'This is the part where I pretend to understand the regex.',
        line15: "I've been standing here since the last deployment.",
        line16: 'One does not simply merge into main on a Friday.',
        line17: 'I like your workspace. Very... spacious.',
        line18: 'Warning: I am 90% paperclip, 10% moral support.',
        line19: "Shall we name the bug? I suggest 'Gerald'.",
        line20: "You look like you could use a rubber duck. I'm close enough.",
      },
      ru: {
        aria: 'Компаньон Клиппи. Перетащите, чтобы переместить. Нажмите Enter для комментария.',
        hint: 'Перетащите меня — или нажмите Enter',
        line1: 'Похоже, вы пишете код. Нужна помощь?',
        line2: 'Я нашёл точку с запятой за диваном.',
        line3: 'Тащите меня куда угодно в чате. В сайдбар я не полезу.',
        line4: 'Тесты проходят. Я проверил дважды.',
        line5: 'Вы пробовали выключить и включить этот вызов инструмента?',
        line6: 'Не то чтобы это была гонка, но происходит только иногда.',
        line7: 'Отличное сообщение коммита. Очень описательное.',
        line8: 'Хотите, объясню стектрейс? Он длинный.',
        line9: 'Вижу, вы читаете документацию. Смелый ход.',
        line10: 'Ваш бюджет токенов звонил. Он нервничает.',
        line11: 'Всё под контролем. Наверное.',
        line12: 'Я бы помог! Просто не дотягиваюсь до клавиатуры.',
        line13: 'Может, сделать диф поменьше?',
        line14: 'А вот здесь я делаю вид, что понимаю регулярку.',
        line15: 'Я стою тут с прошлого деплоя.',
        line16: 'Нельзя просто так взять и влить в main в пятницу.',
        line17: 'Уютное у вас рабочее пространство. Просторное.',
        line18: 'Предупреждение: я на 90% скрепка и на 10% моральная поддержка.',
        line19: 'Давайте назовём баг. Предлагаю «Геральд».',
        line20: 'Похоже, вам нужна резиновая уточка. Я почти подхожу.',
      },
    };

    const CSS = `
.dscc-root{position:fixed;width:${FRAME_W}px;height:${FRAME_H}px;z-index:30;pointer-events:none}
.dscc-button{display:block;box-sizing:border-box;width:100%;height:100%;margin:0;padding:0;border:0;border-radius:14px;background:transparent;cursor:grab;touch-action:none;user-select:none;-webkit-user-select:none;pointer-events:auto;outline:none}
.dscc-root[data-dragging="true"] .dscc-button{cursor:grabbing}
.dscc-button:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,#247bbf);outline-offset:4px}
.dscc-sprite{width:${FRAME_W}px;height:${FRAME_H}px;background-repeat:no-repeat;filter:drop-shadow(0 7px 11px rgba(0,0,0,.22));transition:transform 120ms ease,filter 120ms ease}
.dscc-button:hover .dscc-sprite{transform:translateY(-1px);filter:drop-shadow(0 10px 14px rgba(0,0,0,.26))}
.dscc-bubble{position:absolute;left:50%;bottom:calc(100% + 14px);transform:translateX(-50%);box-sizing:border-box;width:max-content;max-width:min(260px,calc(100vw - 32px));padding:9px 12px;border:.5px solid var(--dsw-alias-border-l2,rgba(0,0,0,.16));border-radius:12px;background:var(--dsw-alias-bg-overlay,#fff);color:var(--dsw-alias-label-primary,#1b1b1d);box-shadow:0 10px 28px rgba(0,0,0,.22);font-family:var(--dsh-font-family-text,system-ui,-apple-system,"Segoe UI",sans-serif);font-size:12.5px;line-height:18px;text-align:left;pointer-events:auto;cursor:default}
.dscc-bubbleBelow{top:calc(100% + 14px);bottom:auto}
.dscc-tail{position:absolute;left:50%;bottom:-6px;width:12px;height:12px;margin-left:-6px;transform:rotate(45deg);background:var(--dsw-alias-bg-overlay,#fff);border-right:.5px solid var(--dsw-alias-border-l2,rgba(0,0,0,.16));border-bottom:.5px solid var(--dsw-alias-border-l2,rgba(0,0,0,.16))}
.dscc-bubbleBelow .dscc-tail{top:-6px;bottom:auto;border:0;border-left:.5px solid var(--dsw-alias-border-l2,rgba(0,0,0,.16));border-top:.5px solid var(--dsw-alias-border-l2,rgba(0,0,0,.16))}
@media (prefers-reduced-motion: reduce){.dscc-sprite,.dscc-button:hover .dscc-sprite{transition:none;transform:none}}
`;

    const clamp = (value, min, max) => (value < min ? min : value > max ? max : value);
    const clamp01 = (value) => clamp(value, 0, 1);

    function readFraction() {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || !Number.isFinite(parsed.fx) || !Number.isFinite(parsed.fy)) return null;
        return { fx: clamp01(parsed.fx), fy: clamp01(parsed.fy) };
      } catch (error) {
        return null;
      }
    }

    function persistFraction(fraction) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fraction));
      } catch (error) {
        /* storage is optional */
      }
    }

    function createBoundsStore() {
      let value = null;
      const listeners = new Set();
      return {
        get() {
          return value;
        },
        set(next) {
          if (value === next) return;
          if (
            value &&
            next &&
            value.left === next.left &&
            value.right === next.right &&
            value.top === next.top &&
            value.bottom === next.bottom
          ) {
            return;
          }
          value = next;
          for (const listener of listeners) listener();
        },
        subscribe(listener) {
          listeners.add(listener);
          return () => listeners.delete(listener);
        },
      };
    }

    function useBounds(store) {
      const [value, setValue] = React.useState(() => store.get());
      React.useEffect(() => {
        setValue(store.get());
        return store.subscribe(() => setValue(store.get()));
      }, [store]);
      return value;
    }

    /** Measures the chat column around its own slot entry; it renders nothing. */
    function ChatBoundsProbe({ bounds }) {
      const ref = React.useRef(null);

      React.useEffect(() => {
        const element = ref.current;
        if (!element) return undefined;
        const host = element.parentElement;
        if (!host) return undefined;

        let frame = 0;
        const measure = () => {
          frame = 0;
          if (!element.isConnected) return;

          // The slot entry sits inside one or more zero-sized wrappers. Walk up
          // to the composed chat column: the first ancestor wide enough to be
          // the column supplies the horizontal range, and the tallest one
          // supplies the top of the scrolling conversation.
          let column = null;
          let tallest = null;
          let node = element.parentElement;
          for (let i = 0; node && i < 6; i += 1) {
            const rect = node.getBoundingClientRect();
            if (rect.width > 80 && rect.height > 0) {
              if (!column) column = rect;
              if (!tallest || rect.height > tallest.height) tallest = rect;
            }
            node = node.parentElement;
          }
          if (!column || column.right - column.left < 120) return;

          const top = tallest ? Math.max(TOP_INSET, tallest.top + MARGIN) : TOP_INSET;
          const bottom = Math.max(top, column.top - MARGIN);
          bounds.set({
            left: column.left,
            right: column.right,
            top,
            bottom,
          });
        };
        const schedule = () => {
          if (frame) return;
          frame = window.requestAnimationFrame(measure);
        };

        schedule();
        window.addEventListener('resize', schedule);
        const observer =
          typeof ResizeObserver === 'function' ? new ResizeObserver(schedule) : null;
        if (observer) {
          observer.observe(host);
          if (host.parentElement) observer.observe(host.parentElement);
          observer.observe(document.documentElement);
        }
        const settle = window.setTimeout(schedule, 300);

        return () => {
          window.clearTimeout(settle);
          if (frame) window.cancelAnimationFrame(frame);
          window.removeEventListener('resize', schedule);
          if (observer) observer.disconnect();
          bounds.set(null);
        };
      }, [bounds]);

      return h('span', {
        ref,
        'aria-hidden': 'true',
        style: { display: 'none' },
      });
    }

    function useSpriteFrame(manifest, spec, onEnd) {
      const [frameIndex, setFrameIndex] = React.useState(0);
      const onEndRef = React.useRef(onEnd);
      onEndRef.current = onEnd;
      const animation = manifest && spec ? manifest.animations[spec.name] : null;

      React.useEffect(() => {
        if (!animation) return undefined;
        let index = 0;
        let timer = 0;
        let disposed = false;
        setFrameIndex(0);

        const step = () => {
          const entry = animation.frames[index];
          const delay = Math.max(60, Number(entry && entry.duration) || 100);
          timer = window.setTimeout(() => {
            if (disposed) return;
            index += 1;
            if (index >= animation.frames.length) {
              if (onEndRef.current) onEndRef.current();
              return;
            }
            setFrameIndex(index);
            step();
          }, delay);
        };
        step();

        return () => {
          disposed = true;
          window.clearTimeout(timer);
        };
      }, [animation, spec && spec.token]);

      return frameIndex;
    }

    function Companion({ bounds: boundsStore, translate: injectedTranslate, t }) {
      const translate =
        typeof t === 'function'
          ? t
          : typeof injectedTranslate === 'function'
            ? injectedTranslate
            : (key) => key;
      const reducedMotion = React.useMemo(
        () =>
          typeof window.matchMedia === 'function' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        [],
      );

      const [manifest, setManifest] = React.useState(null);
      const [spec, setSpec] = React.useState(null);
      const [line, setLine] = React.useState(null);
      const [dragging, setDragging] = React.useState(false);
      const [fraction, setFractionState] = React.useState(
        () => readFraction() || { fx: 1, fy: 0.92 },
      );
      const bounds = useBounds(boundsStore);

      const fractionRef = React.useRef(fraction);
      const tokenRef = React.useRef(0);
      const lineTokenRef = React.useRef(0);
      const phaseRef = React.useRef('idle');
      const dragRef = React.useRef(null);
      const timersRef = React.useRef({ idle: 0, bubble: 0 });
      const geoRef = React.useRef(null);

      const setFraction = (next) => {
        fractionRef.current = next;
        setFractionState(next);
      };

      const clearTimer = (key) => {
        if (timersRef.current[key]) {
          window.clearTimeout(timersRef.current[key]);
          timersRef.current[key] = 0;
        }
      };

      React.useEffect(() => {
        let cancelled = false;
        new Image().src = SPRITE_URL; /* warm the sheet before the first frame */
        fetch(MANIFEST_URL, { credentials: 'omit' })
          .then((response) => {
            if (!response.ok) throw new Error('HTTP ' + response.status);
            return response.json();
          })
          .then((data) => {
            if (cancelled) return;
            if (!data || !data.animations || !data.animations.Greeting) {
              throw new Error('unexpected sprite manifest');
            }
            setManifest(data);
          })
          .catch((error) => {
            console.error('[clippy-companion] cannot load the sprite manifest:', error);
          });
        return () => {
          cancelled = true;
        };
      }, []);

      React.useEffect(() => {
        if (!manifest) return;
        if (reducedMotion) {
          phaseRef.current = 'idle';
          setSpec({ name: 'RestPose', token: ++tokenRef.current });
          return;
        }
        phaseRef.current = 'intro';
        setSpec({ name: 'Greeting', token: ++tokenRef.current });
      }, [manifest, reducedMotion]);

      React.useEffect(
        () => () => {
          clearTimer('idle');
          clearTimer('bubble');
        },
        [],
      );

      const scheduleIdle = (delay) => {
        clearTimer('idle');
        if (reducedMotion) return;
        timersRef.current.idle = window.setTimeout(() => {
          if (!manifest) return;
          const name = IDLE_ANIMATIONS[Math.floor(Math.random() * IDLE_ANIMATIONS.length)];
          phaseRef.current = 'idle';
          setSpec({ name, token: ++tokenRef.current });
        }, delay);
      };

      const handleAnimationEnd = () => {
        if (phaseRef.current === 'react') {
          phaseRef.current = 'idle';
          scheduleIdle(2200);
        } else if (phaseRef.current === 'intro') {
          phaseRef.current = 'idle';
          scheduleIdle(700);
        } else {
          scheduleIdle(1200 + Math.random() * 2600);
        }
      };

      const frameIndex = useSpriteFrame(manifest, spec, handleAnimationEnd);

      const sheetSize = React.useMemo(() => {
        let width = FRAME_W;
        let height = FRAME_H;
        if (manifest) {
          for (const candidate of Object.values(manifest.animations)) {
            for (const item of candidate.frames) {
              width = Math.max(width, item.position[0] + FRAME_W);
              height = Math.max(height, item.position[1] + FRAME_H);
            }
          }
        }
        return { width, height };
      }, [manifest]);

      const speak = () => {
        if (!manifest) return;
        const entry = SPEECH[Math.floor(Math.random() * SPEECH.length)];
        const animation = manifest.animations[entry.anim] ? entry.anim : 'GestureUp';
        clearTimer('idle');
        clearTimer('bubble');
        phaseRef.current = 'react';
        setSpec({ name: animation, token: ++tokenRef.current });
        lineTokenRef.current += 1;
        setLine({ key: entry.key, text: translate(entry.key) });
        timersRef.current.bubble = window.setTimeout(() => setLine(null), BUBBLE_MS);
      };

      const moveBy = (dx, dy) => {
        const geo = geoRef.current;
        if (!geo) return;
        const rangeX = geo.maxX - geo.minX;
        const rangeY = geo.maxY - geo.minY;
        const current = fractionRef.current;
        const x = clamp(geo.minX + rangeX * current.fx + dx, geo.minX, geo.maxX);
        const y = clamp(geo.minY + rangeY * current.fy + dy, geo.minY, geo.maxY);
        const next = {
          fx: rangeX > 0 ? (x - geo.minX) / rangeX : 0,
          fy: rangeY > 0 ? (y - geo.minY) / rangeY : 0,
        };
        setFraction(next);
        persistFraction(next);
      };

      if (!manifest || !bounds) return null;

      const geo = {
        minX: bounds.left + MARGIN,
        maxX: Math.max(bounds.left + MARGIN, bounds.right - FRAME_W - MARGIN),
        minY: bounds.top + MARGIN,
        maxY: Math.max(bounds.top + MARGIN, bounds.bottom - FRAME_H - MARGIN),
      };
      geoRef.current = geo;

      const x = geo.minX + (geo.maxX - geo.minX) * fraction.fx;
      const y = geo.minY + (geo.maxY - geo.minY) * fraction.fy;
      const animation = spec ? manifest.animations[spec.name] : null;
      const frames = animation ? animation.frames : [];
      const frame = frames.length ? frames[Math.min(frameIndex, frames.length - 1)] : null;

      const onPointerDown = (event) => {
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        const button = event.currentTarget;
        try {
          button.setPointerCapture(event.pointerId);
        } catch (error) {
          /* capture is best-effort */
        }
        dragRef.current = {
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          originX: x,
          originY: y,
          moved: false,
        };
        setDragging(true);
        try {
          button.focus({ preventScroll: true });
        } catch (error) {
          /* focus is best-effort */
        }
        event.preventDefault();
      };

      const onPointerMove = (event) => {
        const drag = dragRef.current;
        if (!drag || drag.pointerId !== event.pointerId) return;
        const dx = event.clientX - drag.startX;
        const dy = event.clientY - drag.startY;
        if (!drag.moved && Math.abs(dx) + Math.abs(dy) < 4) return;
        drag.moved = true;
        const rangeX = geo.maxX - geo.minX;
        const rangeY = geo.maxY - geo.minY;
        const nx = clamp(drag.originX + dx, geo.minX, geo.maxX);
        const ny = clamp(drag.originY + dy, geo.minY, geo.maxY);
        setFraction({
          fx: rangeX > 0 ? (nx - geo.minX) / rangeX : 0,
          fy: rangeY > 0 ? (ny - geo.minY) / rangeY : 0,
        });
      };

      const onPointerUp = (event) => {
        const drag = dragRef.current;
        if (!drag || drag.pointerId !== event.pointerId) return;
        dragRef.current = null;
        setDragging(false);
        try {
          event.currentTarget.releasePointerCapture(event.pointerId);
        } catch (error) {
          /* capture is best-effort */
        }
        if (drag.moved) {
          persistFraction(fractionRef.current);
        } else {
          speak();
        }
      };

      const onPointerCancel = (event) => {
        const drag = dragRef.current;
        if (!drag || drag.pointerId !== event.pointerId) return;
        dragRef.current = null;
        setDragging(false);
        if (drag.moved) persistFraction(fractionRef.current);
      };

      const onKeyDown = (event) => {
        const step = event.shiftKey ? 48 : 12;
        let dx = 0;
        let dy = 0;
        if (event.key === 'ArrowLeft') dx = -step;
        else if (event.key === 'ArrowRight') dx = step;
        else if (event.key === 'ArrowUp') dy = -step;
        else if (event.key === 'ArrowDown') dy = step;
        if (dx !== 0 || dy !== 0) {
          event.preventDefault();
          moveBy(dx, dy);
          return;
        }
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          speak();
          return;
        }
        if (event.key === 'Escape') {
          setLine(null);
        }
      };

      const hint = translate('hint');
      const bubbleBelow = y - bounds.top < 120;
      const bubbleStyle = {};
      const center = x + FRAME_W / 2;
      if (center + 140 > bounds.right - 4) {
        bubbleStyle.left = 'auto';
        bubbleStyle.right = '0px';
        bubbleStyle.transform = 'none';
      } else if (center - 140 < bounds.left + 4) {
        bubbleStyle.left = '0px';
        bubbleStyle.transform = 'none';
      }

      return h(
        'div',
        {
          className: 'dscc-root',
          'data-dragging': dragging ? 'true' : 'false',
          style: { left: Math.round(x) + 'px', top: Math.round(y) + 'px' },
        },
        [
          h('style', { key: 'style' }, CSS),
          h(
            'button',
            {
              key: 'button',
              type: 'button',
              className: 'dscc-button',
              'aria-label': translate('aria'),
              title: hint,
              onPointerDown,
              onPointerMove,
              onPointerUp,
              onPointerCancel,
              onKeyDown,
              onContextMenu: (event) => event.preventDefault(),
            },
            h('div', {
              className: 'dscc-sprite',
              'aria-hidden': 'true',
              style: frame
                ? {
                    backgroundImage: 'url("' + SPRITE_URL + '")',
                    backgroundSize: sheetSize.width + 'px ' + sheetSize.height + 'px',
                    backgroundPosition:
                      -frame.position[0] + 'px ' + -frame.position[1] + 'px',
                  }
                : { visibility: 'hidden' },
            }),
          ),
          line
            ? h(
                'div',
                {
                  key: 'bubble-' + lineTokenRef.current,
                  className: bubbleBelow ? 'dscc-bubble dscc-bubbleBelow' : 'dscc-bubble',
                  style: bubbleStyle,
                  role: 'status',
                  'aria-live': 'polite',
                  onClick: () => setLine(null),
                },
                line.text,
                h('span', { key: 'tail', className: 'dscc-tail', 'aria-hidden': 'true' }),
              )
            : null,
        ],
      );
    }

    function registerLocale(ctx) {
      const disposers = [];
      for (const [locale, dict] of Object.entries(DICTS)) {
        try {
          disposers.push(ctx.locale.register(NS, locale, dict));
        } catch (error) {
          /* this build has no dictionary for that language */
        }
      }
      return () => {
        for (const dispose of disposers) dispose();
      };
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        const bounds = createBoundsStore();
        let translate = null;
        try {
          translate = ctx.locale.bind(NS);
        } catch (error) {
          translate = null;
        }

        ctx.effect(() => registerLocale(ctx));

        ctx.slots.inject('shell.overlay', () =>
          ctx.slots.register(
            {
              name: 'shell.overlay',
              id: 'clippy-companion',
              order: 20,
              locale: NS,
              inject: () => ({ bounds, translate }),
            },
            Companion,
          ),
        );

        ctx.slots.inject('conversation.input.dock', () =>
          ctx.slots.register(
            {
              name: 'conversation.input.dock',
              id: 'clippy-companion-probe',
              order: 90,
              inject: () => ({ bounds }),
            },
            ChatBoundsProbe,
          ),
        );
      },
    };
  },
});
