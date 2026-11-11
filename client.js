window.__ModuleLoader__.load({
  id: 'dsh-clippy-companion',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    const NS = 'clippy-companion';
    const MARGIN = 12;
    const TOP_INSET = 56;
    const BUBBLE_MS = 7000;
    const LONG_PRESS_MS = 550;
    const SLEEP_MS = 5 * 60 * 1000;
    const POKE_WINDOW_MS = 2200;
    const POKE_BUBBLE_MS = 4600;
    const DOUBLE_TAP_MS = 240;
    const SLOW_TOOL_MS = 10000;
    const ASSET_BASE = '/clippy-companion/assets/';
    const STORAGE_POSITION = 'dsh.clippy-companion.position.v1';
    const STORAGE_PRESET = 'dsh.clippy-companion.preset.v1';
    const DEFAULT_PRESET = 'openclippy';

    // Adding a pack means adding its directory under assets/ and one row here.
    const PRESETS = [
      { id: 'openclippy', dir: 'openclippy' },
      { id: 'doom', dir: 'doom' },
    ];

    const DICTS = {
      en: {
        aria: 'Companion. Drag to move. Press Enter for a comment.',
        ariaAsleep: 'Companion, asleep. Press Enter to wake.',
        hint: 'Drag me — or press Enter to chat',
        hintAsleep: 'Zzz — click to wake me',
        menuTitle: 'Companion',
        menuAria: 'Choose a companion',
        settingsTitle: 'Companion',
        settingsDescription: 'Character shown in the chat area.',
        'preset.openclippy': 'Clippy',
        'preset.doom': 'Doomguy',
        'clippy.line1': "It looks like you're writing code. Want some help with that?",
        'clippy.line2': 'I found a semicolon hiding behind the sofa.',
        'clippy.line3': 'Drag me anywhere in the chat. I promise to stay out of the sidebar.',
        'clippy.line4': 'The tests pass. I checked twice.',
        'clippy.line5': 'Have you tried turning the tool call off and on again?',
        'clippy.line6': "I'm not saying it's a race condition, but it only happens sometimes.",
        'clippy.line7': "That's a nice commit message. Very descriptive.",
        'clippy.line8': "Would you like me to explain that stack trace? It's a long one.",
        'clippy.line9': "I see you're reading the docs. Bold move.",
        'clippy.line10': "Your token budget called. It's nervous.",
        'clippy.line11': 'Everything is under control. Probably.',
        'clippy.line12': "I can help! I just can't reach the keyboard.",
        'clippy.line13': 'Have you considered a smaller diff?',
        'clippy.line14': 'This is the part where I pretend to understand the regex.',
        'clippy.line15': "I've been standing here since the last deployment.",
        'clippy.line16': 'One does not simply merge into main on a Friday.',
        'clippy.line17': 'I like your workspace. Very... spacious.',
        'clippy.line18': 'Warning: I am 90% paperclip, 10% moral support.',
        'clippy.line19': "Shall we name the bug? I suggest 'Gerald'.",
        'clippy.line20': "You look like you could use a rubber duck. I'm close enough.",
        'doom.line1': 'Rip and tear... the TODOs.',
        'doom.line2': "I've seen scarier stack traces.",
        'doom.line3': 'Hurt me plenty. I can take a failed test.',
        'doom.line4': 'That bug? Already dead.',
        'doom.line5': 'Your diff is huge. That means your changes are huge.',
        'doom.line6': 'Shotgun debugging works. Ship it.',
        'doom.line7': 'No rest for the wicked. Or for CI.',
        'doom.line8': "I'm too young to die. You're on your own.",
        'doom.line9': 'This code is giving me BFG ideas.',
        'doom.line10': 'You call that a merge conflict?',
        'doom.line11': "I don't do pull requests. I do breaches.",
        'doom.line12': 'Wake me when the build is green.',
        'doom.meme1': 'AAAAAAAAA. Sorry, that was the context window filling up.',
        'doom.meme2': "I'm sure that regex is fine.",
        'doom.meme3': 'Finally, a bug worth shooting.',
        'doom.meme4': 'I cannot see the bug. The bug cannot see me.',
        'doom.meme5': 'The context window is a lie.',
        'doom.meme6': 'I brought a pumpkin to the code review.',
        'clippy.poke1': "Hey — I'm a paperclip, not a button.",
        'clippy.poke2': 'That tickles. Please stop.',
        'clippy.poke3': "Poke me once more and I'm filing a bug report.",
        'clippy.pokeMad': "That's it. I'm telling the user.",
        'doom.poke1': 'Poke me again. See what happens.',
        'doom.poke2': 'You want a piece of me?',
        'doom.poke3': 'Keep poking. It only feeds the rage.',
        'doom.pokeMad': 'That was your last poke.',
        'sleep.z': 'Zzz…',
      },
      ru: {
        aria: 'Компаньон. Перетащите, чтобы переместить. Нажмите Enter для комментария.',
        ariaAsleep: 'Компаньон спит. Нажмите Enter, чтобы разбудить.',
        hint: 'Перетащите меня — или нажмите Enter',
        hintAsleep: 'Zzz — нажмите, чтобы разбудить',
        menuTitle: 'Компаньон',
        menuAria: 'Выберите компаньона',
        settingsTitle: 'Компаньон',
        settingsDescription: 'Персонаж в области чата.',
        'preset.openclippy': 'Клиппи',
        'preset.doom': 'Думгай',
        'clippy.line1': 'Похоже, вы пишете код. Нужна помощь?',
        'clippy.line2': 'Я нашёл точку с запятой за диваном.',
        'clippy.line3': 'Тащите меня куда угодно в чате. В сайдбар я не полезу.',
        'clippy.line4': 'Тесты проходят. Я проверил дважды.',
        'clippy.line5': 'Вы пробовали выключить и включить этот вызов инструмента?',
        'clippy.line6': 'Не то чтобы это была гонка, но происходит только иногда.',
        'clippy.line7': 'Отличное сообщение коммита. Очень описательное.',
        'clippy.line8': 'Хотите, объясню стектрейс? Он длинный.',
        'clippy.line9': 'Вижу, вы читаете документацию. Смелый ход.',
        'clippy.line10': 'Ваш бюджет токенов звонил. Он нервничает.',
        'clippy.line11': 'Всё под контролем. Наверное.',
        'clippy.line12': 'Я бы помог! Просто не дотягиваюсь до клавиатуры.',
        'clippy.line13': 'Может, сделать диф поменьше?',
        'clippy.line14': 'А вот здесь я делаю вид, что понимаю регулярку.',
        'clippy.line15': 'Я стою тут с прошлого деплоя.',
        'clippy.line16': 'Нельзя просто так взять и влить в main в пятницу.',
        'clippy.line17': 'Уютное у вас рабочее пространство. Просторное.',
        'clippy.line18': 'Предупреждение: я на 90% скрепка и на 10% моральная поддержка.',
        'clippy.line19': 'Давайте назовём баг. Предлагаю «Геральд».',
        'clippy.line20': 'Похоже, вам нужна резиновая уточка. Я почти подхожу.',
        'doom.line1': 'Рви и мечи… TODO.',
        'doom.line2': 'Я видел стектрейсы и пострашнее.',
        'doom.line3': 'Сделай мне больно. Проваленный тест я выдержу.',
        'doom.line4': 'Этот баг? Уже мёртв.',
        'doom.line5': 'Диф у тебя огромный. Значит, и изменения огромные.',
        'doom.line6': 'Отладка дробовиком работает. Шипи.',
        'doom.line7': 'Нет покоя злодеям. И CI.',
        'doom.line8': 'Я слишком молод, чтобы умирать. Дальше сам.',
        'doom.line9': 'Этот код наводит на мысли о BFG.',
        'doom.line10': 'Ты называешь это конфликтом слияния?',
        'doom.line11': 'Я не делаю пул-реквесты. Я делаю прорывы.',
        'doom.line12': 'Разбуди, когда сборка станет зелёной.',
        'doom.meme1': 'ААААААА. Простите, это заполняется контекстное окно.',
        'doom.meme2': 'Я уверен, эта регулярка в порядке.',
        'doom.meme3': 'Наконец-то баг, который стоит пристрелить.',
        'doom.meme4': 'Я не вижу баг. Баг не видит меня.',
        'doom.meme5': 'Контекстное окно лжёт.',
        'doom.meme6': 'Я принёс тыкву на код-ревью.',
        'clippy.poke1': 'Эй, я скрепка, а не кнопка.',
        'clippy.poke2': 'Щекотно. Прекратите.',
        'clippy.poke3': 'Ещё раз — и я напишу баг-репорт.',
        'clippy.pokeMad': 'Всё. Я всё расскажу пользователю.',
        'doom.poke1': 'Ткни ещё. Посмотрим, что будет.',
        'doom.poke2': 'Хочешь кусок меня?',
        'doom.poke3': 'Тыкай дальше. Это только кормит ярость.',
        'doom.pokeMad': 'Это был твой последний тык.',
        'sleep.z': 'Zzz…',
      },
    };

    const CSS = `
.dscc-root{position:fixed;z-index:30;pointer-events:none}
.dscc-button{display:block;box-sizing:border-box;width:100%;height:100%;margin:0;padding:0;border:0;border-radius:14px;background:transparent;cursor:grab;touch-action:none;user-select:none;-webkit-user-select:none;pointer-events:auto;outline:none}
.dscc-root[data-dragging="true"] .dscc-button{cursor:grabbing}
.dscc-button:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,#247bbf);outline-offset:4px}
.dscc-sprite{background-repeat:no-repeat;filter:drop-shadow(0 7px 11px rgba(0,0,0,.22));transition:transform 120ms ease,filter 120ms ease}
.dscc-button:hover .dscc-sprite{transform:translateY(-1px);filter:drop-shadow(0 10px 14px rgba(0,0,0,.26))}
.dscc-root[data-pressed="true"] .dscc-sprite{transform:translateY(1px) scale(.94);filter:drop-shadow(0 3px 6px rgba(0,0,0,.2))}
.dscc-bubble{position:absolute;left:50%;bottom:calc(100% + 14px);transform:translateX(-50%);box-sizing:border-box;width:max-content;max-width:min(260px,calc(100vw - 32px));padding:9px 12px;border:.5px solid var(--dsw-alias-border-l2,rgba(0,0,0,.16));border-radius:12px;background:var(--dsw-alias-bg-overlay,#fff);color:var(--dsw-alias-label-primary,#1b1b1d);box-shadow:0 10px 28px rgba(0,0,0,.22);font-family:var(--dsh-font-family-text,system-ui,-apple-system,"Segoe UI",sans-serif);font-size:12.5px;line-height:18px;text-align:left;pointer-events:auto;cursor:default}
.dscc-bubbleBelow{top:calc(100% + 14px);bottom:auto}
.dscc-tail{position:absolute;left:50%;bottom:-6px;width:12px;height:12px;margin-left:-6px;transform:rotate(45deg);background:var(--dsw-alias-bg-overlay,#fff);border-right:.5px solid var(--dsw-alias-border-l2,rgba(0,0,0,.16));border-bottom:.5px solid var(--dsw-alias-border-l2,rgba(0,0,0,.16))}
.dscc-bubbleBelow .dscc-tail{top:-6px;bottom:auto;border:0;border-left:.5px solid var(--dsw-alias-border-l2,rgba(0,0,0,.16));border-top:.5px solid var(--dsw-alias-border-l2,rgba(0,0,0,.16))}
.dscc-menu{position:absolute;z-index:6;box-sizing:border-box;width:210px;padding:6px;border:.5px solid var(--dsw-alias-border-l2,rgba(0,0,0,.16));border-radius:12px;background:var(--dsw-alias-bg-overlay,#fff);box-shadow:0 14px 34px rgba(0,0,0,.28);color:var(--dsw-alias-label-primary,#1b1b1d);font-family:var(--dsh-font-family-text,system-ui,-apple-system,"Segoe UI",sans-serif);pointer-events:auto}
.dscc-menuTitle{padding:6px 8px 4px;font-size:10.5px;font-weight:500;letter-spacing:.05em;text-transform:uppercase;color:var(--dsw-alias-label-tertiary,var(--dsw-alias-label-secondary,#6b7280))}
.dscc-menuItem{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;padding:7px 8px;border:0;border-radius:8px;background:transparent;color:inherit;font:inherit;font-size:13px;line-height:20px;text-align:left;cursor:pointer}
.dscc-menuItem:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.12))}
.dscc-menuItem[aria-checked="true"]{background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.12));font-weight:500}
.dscc-menuItem:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,#247bbf);outline-offset:-2px}
.dscc-check{flex:none;color:var(--dsw-alias-brand-primary,#247bbf)}
.dscc-checkEmpty{flex:none;width:14px;height:14px}
.dscc-setting{display:flex;align-items:center;justify-content:space-between;gap:16px;box-sizing:border-box;min-height:40px;padding:10px 0}
.dscc-settingText{min-width:0}
.dscc-settingTitle{font-size:14px;line-height:22px;color:var(--dsw-alias-label-primary,#1b1b1d)}
.dscc-settingDesc{margin-top:1px;font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary,var(--dsw-alias-label-secondary,#6b7280))}
.dscc-segment{display:inline-flex;flex:none;border:.5px solid var(--dsw-alias-border-l3,var(--dsw-alias-border-l2,rgba(0,0,0,.16)));border-radius:8px;overflow:hidden}
.dscc-segment button{height:32px;padding:0 12px;border:0;background:transparent;color:var(--dsw-alias-label-secondary,#4b5563);font-family:inherit;font-size:13px;line-height:20px;white-space:nowrap;cursor:pointer}
.dscc-segment button+button{border-left:.5px solid var(--dsw-alias-border-l3,var(--dsw-alias-border-l2,rgba(0,0,0,.16)))}
.dscc-segment button:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.12))}
.dscc-segment button[aria-checked="true"]{background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.12));color:var(--dsw-alias-label-primary,#1b1b1d);font-weight:500}
.dscc-segment button:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,#247bbf);outline-offset:-2px}
@media (prefers-reduced-motion: reduce){.dscc-sprite,.dscc-button:hover .dscc-sprite{transition:none;transform:none}}
`;

    const clamp = (value, min, max) => (value < min ? min : value > max ? max : value);

    function readFraction() {
      try {
        const raw = window.localStorage.getItem(STORAGE_POSITION);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || !Number.isFinite(parsed.fx) || !Number.isFinite(parsed.fy)) return null;
        return { fx: clamp(parsed.fx, 0, 1), fy: clamp(parsed.fy, 0, 1) };
      } catch (error) {
        return null;
      }
    }

    function persistFraction(fraction) {
      try {
        window.localStorage.setItem(STORAGE_POSITION, JSON.stringify(fraction));
      } catch (error) {
        /* storage is optional */
      }
    }

    function readPresetId() {
      try {
        const raw = window.localStorage.getItem(STORAGE_PRESET);
        if (raw && PRESETS.some((preset) => preset.id === raw)) return raw;
      } catch (error) {
        /* storage is optional */
      }
      return DEFAULT_PRESET;
    }

    function persistPresetId(id) {
      try {
        window.localStorage.setItem(STORAGE_PRESET, id);
      } catch (error) {
        /* storage is optional */
      }
    }

    function createPresetStore() {
      let current = readPresetId();
      const listeners = new Set();
      return {
        get() {
          return current;
        },
        set(id) {
          if (id === current || !PRESETS.some((preset) => preset.id === id)) return;
          current = id;
          persistPresetId(id);
          for (const listener of listeners) listener();
        },
        subscribe(listener) {
          listeners.add(listener);
          return () => listeners.delete(listener);
        },
      };
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

    function createContextStore() {
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
            value.pressureTokens === next.pressureTokens &&
            value.projectedTokens === next.projectedTokens &&
            value.contextWindow === next.contextWindow
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

    const EMPTY_ACTIVITY = {
      running: false,
      waiting: false,
      toolName: null,
      toolPhase: '',
      resultSeq: null,
      resultError: false,
      queued: 0,
    };

    function createActivityStore() {
      let value = EMPTY_ACTIVITY;
      const listeners = new Set();
      return {
        get() {
          return value;
        },
        set(next) {
          if (value === next) return;
          if (
            value.running === next.running &&
            value.waiting === next.waiting &&
            value.toolName === next.toolName &&
            value.toolPhase === next.toolPhase &&
            value.resultSeq === next.resultSeq &&
            value.resultError === next.resultError &&
            value.queued === next.queued
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

    /** 0: healthy, 1: hurt, 2: badly hurt, from context pressure. */
    function contextTier(pressure) {
      if (!pressure) return 0;
      const used = Number.isFinite(pressure.projectedTokens)
        ? pressure.projectedTokens
        : pressure.pressureTokens;
      const capacity = pressure.contextWindow;
      if (!Number.isFinite(used) || !Number.isFinite(capacity) || capacity <= 0) return 0;
      const ratio = used / capacity;
      if (ratio >= 0.65) return 2;
      if (ratio >= 0.35) return 1;
      return 0;
    }

    const DAMAGE_SUFFIXES = ['', 'Hurt', 'Bad'];

    function resolveAnimationName(manifest, base, tier) {
      if (!manifest || !base) return base;
      for (let level = Math.min(tier, 2); level >= 0; level -= 1) {
        const name = base + DAMAGE_SUFFIXES[level];
        if (manifest.animations[name]) return name;
      }
      return base;
    }

    const EDIT_TOOLS = new Set(['write', 'edit']);
    const READ_TOOLS = new Set(['read', 'read_image', 'grep', 'glob']);
    const SHELL_TOOLS = new Set(['bash', 'pwsh']);

    function toolKind(name) {
      if (!name) return 'tool';
      if (EDIT_TOOLS.has(name)) return 'edit';
      if (READ_TOOLS.has(name)) return 'read';
      if (SHELL_TOOLS.has(name) || name.startsWith('terminal_') || name.startsWith('job_')) {
        return 'shell';
      }
      return 'tool';
    }

    function firstAnimation(manifest, names) {
      for (const name of names) {
        if (manifest.animations[name]) return name;
      }
      return null;
    }

    function activityBase(assets, activity) {
      if (!activity) return null;
      if (activity.waiting) {
        return firstAnimation(assets.manifest, [
          'Hearing_1',
          'GetAttention',
          'LookLeft',
          'LookRight',
          'Idle',
        ]);
      }
      if (activity.toolName) {
        const kind = toolKind(activity.toolName);
        if (kind === 'edit') {
          return firstAnimation(assets.manifest, ['Writing', 'Save', 'Grin', 'Processing']);
        }
        if (kind === 'read') {
          return firstAnimation(assets.manifest, ['Searching', 'LookDown', 'LookLeft', 'LookRight']);
        }
        if (kind === 'shell') {
          return firstAnimation(assets.manifest, ['Print', 'GetWizardy', 'Scream', 'GetTechy']);
        }
        return firstAnimation(assets.manifest, ['Processing', 'GetTechy', 'Angry', 'Idle']);
      }
      if (activity.running) {
        return firstAnimation(assets.manifest, ['Thinking', 'LookUp', 'Idle', 'LookLeft']);
      }
      return null;
    }

    function activityAnimation(assets, activity, tier) {
      const base = activityBase(assets, activity);
      return base ? resolveAnimationName(assets.manifest, base, tier) : null;
    }

    function flashAnimation(assets, kind, tier) {
      let candidates;
      if (kind === 'error') candidates = ['Alert', 'Pain', 'Dead', 'GetAttention'];
      else if (kind === 'slow') candidates = ['IdleFingerTap', 'GetWizardy', 'Angry', 'GetAttention'];
      else if (kind === 'queue') candidates = ['GetAttention', 'Hearing_1', 'GestureUp', 'LookLeft'];
      else candidates = ['Congratulate', 'Grin', 'Wave'];
      const base = firstAnimation(assets.manifest, candidates);
      return base ? resolveAnimationName(assets.manifest, base, tier) : null;
    }

    function useStore(store) {
      const [value, setValue] = React.useState(() => store.get());
      React.useEffect(() => {
        setValue(store.get());
        return store.subscribe(() => setValue(store.get()));
      }, [store]);
      return value;
    }

    async function fetchJson(url, options) {
      const response = await fetch(url, { credentials: 'omit', ...(options || {}) });
      if (!response.ok) throw new Error('HTTP ' + response.status + ' for ' + url);
      return response.json();
    }

    const presetCache = new Map();

    function loadPreset(meta) {
      const cached = presetCache.get(meta.id);
      if (cached) return cached;

      const base = ASSET_BASE + meta.dir + '/';
      const promise = (async () => {
        const config = await fetchJson(base + 'preset.json', { cache: 'no-store' });
        if (!config || typeof config !== 'object') throw new Error('invalid preset descriptor');
        const suffix = '?v=' + encodeURIComponent(String(config.version || '1'));
        const manifest = await fetchJson(
          base + (config.manifest || 'sprite-data.json') + suffix,
        );
        if (
          !manifest ||
          !manifest.animations ||
          !Number.isFinite(manifest.frameWidth) ||
          !Number.isFinite(manifest.frameHeight)
        ) {
          throw new Error('invalid sprite manifest');
        }
        const scale =
          Number.isFinite(config.scale) && config.scale > 0 ? config.scale : 1;
        let sheetWidth = manifest.frameWidth;
        let sheetHeight = manifest.frameHeight;
        for (const animation of Object.values(manifest.animations)) {
          for (const frame of animation.frames) {
            sheetWidth = Math.max(sheetWidth, frame.position[0] + manifest.frameWidth);
            sheetHeight = Math.max(sheetHeight, frame.position[1] + manifest.frameHeight);
          }
        }
        return {
          id: meta.id,
          config,
          manifest,
          scale,
          spriteUrl: base + (config.sprite || 'sprite.png') + suffix,
          displayWidth: Math.round(manifest.frameWidth * scale),
          displayHeight: Math.round(manifest.frameHeight * scale),
          sheetWidth,
          sheetHeight,
        };
      })();

      presetCache.set(meta.id, promise);
      promise.catch(() => presetCache.delete(meta.id));
      return promise;
    }

    /** Measures the chat column and forwards context pressure; renders nothing. */
    function ChatBoundsProbe({
      bounds,
      context,
      activity,
      useProjection,
      useSession,
      useTrajectory,
      useInput,
    }) {
      const ref = React.useRef(null);
      const pressure =
        typeof useProjection === 'function' ? useProjection('contextPressure') : undefined;
      const inbox = typeof useProjection === 'function' ? useProjection('inbox') : undefined;
      const session = typeof useSession === 'function' ? useSession((value) => value) : undefined;
      const trajectory =
        typeof useTrajectory === 'function' ? useTrajectory((value) => value) : undefined;
      const input = typeof useInput === 'function' ? useInput((value) => value) : undefined;

      const running = !!(session && session.running);
      const calls =
        trajectory && Array.isArray(trajectory.runningCalls) ? trajectory.runningCalls : [];
      const tool = calls.length ? calls[calls.length - 1] : null;
      const events =
        trajectory && Array.isArray(trajectory.eventNodes) ? trajectory.eventNodes : [];
      const lastEvent = events.length ? events[events.length - 1] : null;
      let lastResult = null;
      for (let index = events.length - 1; index >= 0; index -= 1) {
        if (events[index] && events[index].kind === 'tool-result') {
          lastResult = events[index];
          break;
        }
      }
      const toolName = tool ? String(tool.name || '') : null;
      const toolPhase = tool ? String(tool.phase || '') : '';
      const resultSeq = lastResult && lastResult.seq !== undefined ? lastResult.seq : null;
      const resultError = lastResult ? !!lastResult.isError : false;
      // An approval or question pauses the turn with the call still unresolved.
      const waiting =
        !!(input && input.pending) ||
        (!running && !!(lastEvent && lastEvent.kind === 'tool-call'));

      // Messages sent while the turn runs land in the inbox projection, with a
      // brief client-side window before the Host rows arrive.
      const inboxRows =
        inbox && Array.isArray(inbox['next-turn']) ? inbox['next-turn'].length : 0;
      const pending = session && Array.isArray(session.pendingSubmissions)
        ? session.pendingSubmissions
        : [];
      let queuedPending = 0;
      for (const submission of pending) {
        if (submission && submission.placement === 'queued') queuedPending += 1;
      }
      // The optimistic client row and the Host inbox row overlap for a moment.
      const queued = Math.max(inboxRows, queuedPending);

      React.useEffect(() => {
        activity.set({
          running,
          waiting,
          toolName,
          toolPhase,
          resultSeq,
          resultError,
          queued,
        });
      }, [running, waiting, toolName, toolPhase, resultSeq, resultError, queued, activity]);

      React.useEffect(() => {
        context.set(pressure || null);
      }, [pressure, context]);

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
          context.set(null);
        };
      }, [bounds, context]);

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

    function CheckIcon() {
      return h(
        'svg',
        {
          className: 'dscc-check',
          width: 14,
          height: 14,
          viewBox: '0 0 16 16',
          'aria-hidden': 'true',
        },
        h('path', {
          d: 'M13 4.5 6.5 11 3 7.5',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 2,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }),
      );
    }

    function useTranslate(injectedTranslate, t) {
      return typeof t === 'function'
        ? t
        : typeof injectedTranslate === 'function'
          ? injectedTranslate
          : (key) => key;
    }

    function Companion({
      bounds: boundsStore,
      context: contextStore,
      activity: activityStore,
      presetStore,
      translate: injectedTranslate,
      t,
    }) {
      const translate = useTranslate(injectedTranslate, t);
      const reducedMotion = React.useMemo(
        () =>
          typeof window.matchMedia === 'function' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        [],
      );

      const [assets, setAssets] = React.useState(null);
      const [spec, setSpec] = React.useState(null);
      const [line, setLine] = React.useState(null);
      const [flash, setFlash] = React.useState(null);
      const [menuOpen, setMenuOpen] = React.useState(false);
      const [dragging, setDragging] = React.useState(false);
      const [asleep, setAsleep] = React.useState(false);
      const [fraction, setFractionState] = React.useState(
        () => readFraction() || { fx: 1, fy: 0.92 },
      );

      const bounds = useStore(boundsStore);
      const presetId = useStore(presetStore);
      const pressure = useStore(contextStore);
      const activity = useStore(activityStore);
      const tier = contextTier(pressure);
      const activityName = assets ? activityAnimation(assets, activity, tier) : null;

      const fractionRef = React.useRef(fraction);
      const tokenRef = React.useRef(0);
      const lineTokenRef = React.useRef(0);
      const flashTokenRef = React.useRef(0);
      const phaseRef = React.useRef('idle');
      const restBaseRef = React.useRef(null);
      const tierRef = React.useRef(tier);
      tierRef.current = tier;
      const activityNameRef = React.useRef(null);
      activityNameRef.current = activityName;
      const specRef = React.useRef(null);
      const dragRef = React.useRef(null);
      const timersRef = React.useRef({ idle: 0, bubble: 0, flash: 0, sleep: 0, poke: 0 });
      const asleepRef = React.useRef(false);
      const lineRef = React.useRef(null);
      const menuOpenRef = React.useRef(false);
      const pokeRef = React.useRef({ at: 0, count: 0 });
      const lastPressRef = React.useRef(0);
      const geoRef = React.useRef(null);
      const buttonRef = React.useRef(null);
      const menuRef = React.useRef(null);
      const prevRunningRef = React.useRef(null);
      const lastResultSeqRef = React.useRef(null);
      const lastQueuedRef = React.useRef(null);
      const resultBaselineRef = React.useRef(false);
      specRef.current = spec;
      lineRef.current = line;
      menuOpenRef.current = menuOpen;

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
        setAssets(null);
        setSpec(null);
        setLine(null);
        const meta = PRESETS.find((preset) => preset.id === presetId);
        if (!meta) return undefined;
        loadPreset(meta)
          .then((loaded) => {
            if (cancelled) return;
            new Image().src = loaded.spriteUrl;
            setAssets(loaded);
          })
          .catch((error) => {
            if (cancelled) return;
            console.error('[clippy-companion] cannot load preset "' + presetId + '":', error);
            if (presetId !== DEFAULT_PRESET) presetStore.set(DEFAULT_PRESET);
          });
        return () => {
          cancelled = true;
        };
      }, [presetId, presetStore]);

      React.useEffect(() => {
        if (!assets) return;
        clearTimer('idle');
        clearTimer('bubble');
        clearTimer('sleep');
        clearTimer('poke');
        asleepRef.current = false;
        setAsleep(false);
        setMenuOpen(false);
        setLine(null);
        setSpec(null);
        phaseRef.current = 'idle';
        pokeRef.current = { at: 0, count: 0 };
        lastPressRef.current = 0;

        const animations = assets.manifest.animations;
        const restBase =
          assets.config.rest && animations[assets.config.rest]
            ? assets.config.rest
            : Object.keys(animations)[0];
        restBaseRef.current = restBase;

        if (reducedMotion) {
          setSpec({
            name: resolveAnimationName(assets.manifest, restBase, tierRef.current),
            token: ++tokenRef.current,
          });
          return;
        }
        const greeting = assets.config.greeting;
        if (greeting && animations[greeting]) {
          phaseRef.current = 'intro';
          setSpec({
            name: resolveAnimationName(assets.manifest, greeting, tierRef.current),
            token: ++tokenRef.current,
          });
        } else {
          scheduleIdle(400);
        }
        armSleep();
      }, [assets, reducedMotion]);

      React.useEffect(
        () => () => {
          clearTimer('idle');
          clearTimer('bubble');
          clearTimer('flash');
          clearTimer('sleep');
          clearTimer('poke');
        },
        [],
      );

      React.useEffect(() => {
        if (!menuOpen) return undefined;
        const onPointerDown = (event) => {
          if (menuRef.current && menuRef.current.contains(event.target)) return;
          setMenuOpen(false);
        };
        const onKeyDown = (event) => {
          if (event.key === 'Escape') setMenuOpen(false);
        };
        document.addEventListener('pointerdown', onPointerDown, true);
        document.addEventListener('keydown', onKeyDown);
        return () => {
          document.removeEventListener('pointerdown', onPointerDown, true);
          document.removeEventListener('keydown', onKeyDown);
        };
      }, [menuOpen]);

      const scheduleIdle = (delay) => {
        clearTimer('idle');
        if (reducedMotion || !assets) return;
        timersRef.current.idle = window.setTimeout(() => {
          if (!assets) return;
          const animations = assets.manifest.animations;
          const memes = Array.isArray(assets.config.memeIdle)
            ? assets.config.memeIdle.filter((name) => animations[name])
            : [];
          const memeChance = Number(assets.config.memeChance);
          let base;
          if (memes.length && Number.isFinite(memeChance) && Math.random() < memeChance) {
            base = memes[Math.floor(Math.random() * memes.length)];
          } else {
            const list = Array.isArray(assets.config.idle)
              ? assets.config.idle.filter((name) => animations[name])
              : [];
            base = list.length
              ? list[Math.floor(Math.random() * list.length)]
              : restBaseRef.current;
          }
          if (!base) return;
          phaseRef.current = 'idle';
          setSpec({
            name: resolveAnimationName(assets.manifest, base, tierRef.current),
            token: ++tokenRef.current,
          });
        }, delay);
      };

      const beginActivity = (name) => {
        clearTimer('idle');
        phaseRef.current = 'activity';
        setSpec({ name, token: ++tokenRef.current });
      };

      const say = (entry, duration) => {
        if (!entry || typeof entry.key !== 'string') return false;
        clearTimer('bubble');
        lineTokenRef.current += 1;
        setLine({ key: entry.key, text: translate(entry.key) });
        timersRef.current.bubble = window.setTimeout(
          () => setLine(null),
          duration || BUBBLE_MS,
        );
        return true;
      };

      const reactWith = (base) => {
        if (!base || !assets) return false;
        clearTimer('idle');
        phaseRef.current = 'react';
        setSpec({
          name: resolveAnimationName(assets.manifest, base, tierRef.current),
          token: ++tokenRef.current,
        });
        return true;
      };

      const armSleep = () => {
        clearTimer('sleep');
        if (reducedMotion || !assets || asleepRef.current) return;
        timersRef.current.sleep = window.setTimeout(() => {
          if (!assets || asleepRef.current) return;
          if (dragRef.current || menuOpenRef.current || lineRef.current) {
            armSleep();
            return;
          }
          if (
            activityNameRef.current ||
            phaseRef.current === 'activity' ||
            phaseRef.current === 'flash' ||
            phaseRef.current === 'react' ||
            phaseRef.current === 'intro'
          ) {
            armSleep();
            return;
          }
          enterSleep();
        }, SLEEP_MS);
      };

      const enterSleep = () => {
        if (!assets || asleepRef.current) return;
        clearTimer('idle');
        clearTimer('bubble');
        const sleepEntry = assets.config.sleep;
        const base =
          sleepEntry && typeof sleepEntry.anim === 'string' ? sleepEntry.anim : null;
        const name =
          base && assets.manifest.animations[base]
            ? resolveAnimationName(assets.manifest, base, tierRef.current)
            : null;
        asleepRef.current = true;
        setAsleep(true);
        phaseRef.current = 'sleep';
        if (name) setSpec({ name, token: ++tokenRef.current });
        lineTokenRef.current += 1;
        setLine({ key: 'sleep.z', text: translate('sleep.z'), sleep: true });
      };

      const wake = () => {
        if (!asleepRef.current) return;
        asleepRef.current = false;
        setAsleep(false);
        setLine((current) => (current && current.sleep ? null : current));
        clearTimer('sleep');
        clearTimer('bubble');
        if (!assets) return;
        const wakeEntry = assets.config.wake;
        const base =
          wakeEntry && typeof wakeEntry.anim === 'string' && assets.manifest.animations[wakeEntry.anim]
            ? wakeEntry.anim
            : firstAnimation(assets.manifest, ['Wake', 'Hearing_1', 'GetAttention', 'Alert']);
        if (base && !reducedMotion) {
          reactWith(base);
        } else if (activityNameRef.current) {
          beginActivity(activityNameRef.current);
        } else {
          phaseRef.current = 'idle';
          scheduleIdle(600);
        }
        armSleep();
      };

      const pokeReaction = () => {
        if (!assets) return;
        const now = Date.now();
        if (now - pokeRef.current.at < POKE_WINDOW_MS) pokeRef.current.count += 1;
        else pokeRef.current.count = 1;
        pokeRef.current.at = now;

        if (pokeRef.current.count >= 3) {
          const mad = assets.config.pokeMad;
          if (mad && typeof mad.anim === 'string' && reactWith(mad.anim)) {
            say(mad, POKE_BUBBLE_MS);
            armSleep();
            return;
          }
        }
        const entries = Array.isArray(assets.config.poke)
          ? assets.config.poke.filter(
              (entry) =>
                entry &&
                typeof entry.key === 'string' &&
                typeof entry.anim === 'string' &&
                assets.manifest.animations[entry.anim],
            )
          : [];
        if (!entries.length) {
          speak();
          return;
        }
        const entry = entries[Math.floor(Math.random() * entries.length)];
        reactWith(entry.anim);
        say(entry, POKE_BUBBLE_MS);
        armSleep();
      };

      /** A double press skips the poke and throws a meme face instead. */
      const memeBurst = () => {
        if (!assets) return;
        if (asleepRef.current) wake();
        const animations = assets.manifest.animations;
        const named = Object.keys(animations).filter((name) => /^Meme\d+/.test(name));
        const memes = (Array.isArray(assets.config.memeIdle)
          ? assets.config.memeIdle
          : named
        ).filter((name) => animations[name]);
        if (!memes.length) {
          speak();
          return;
        }
        const base = memes[Math.floor(Math.random() * memes.length)];
        reactWith(base);
        const entries = Array.isArray(assets.config.speech)
          ? assets.config.speech.filter(
              (entry) => entry && typeof entry.key === 'string' && /\.meme\d+$/.test(entry.key),
            )
          : [];
        if (entries.length) say(entries[Math.floor(Math.random() * entries.length)], POKE_BUBBLE_MS);
        else clearTimer('bubble');
        armSleep();
      };

      const poke = () => {
        if (!assets) return;
        clearTimer('poke');
        if (asleepRef.current) {
          wake();
          return;
        }
        const now = Date.now();
        if (now - lastPressRef.current < DOUBLE_TAP_MS) {
          lastPressRef.current = 0;
          memeBurst();
          return;
        }
        lastPressRef.current = now;
        timersRef.current.poke = window.setTimeout(pokeReaction, DOUBLE_TAP_MS);
      };

      const handleAnimationEnd = () => {
        if (phaseRef.current === 'react') {
          phaseRef.current = 'idle';
          if (activityNameRef.current) beginActivity(activityNameRef.current);
          else scheduleIdle(2200);
        } else if (phaseRef.current === 'intro') {
          phaseRef.current = 'idle';
          if (activityNameRef.current) beginActivity(activityNameRef.current);
          else scheduleIdle(700);
        } else if (phaseRef.current === 'activity') {
          if (activityNameRef.current) {
            setSpec({ name: activityNameRef.current, token: ++tokenRef.current });
          } else {
            phaseRef.current = 'idle';
            scheduleIdle(1200);
          }
        } else if (phaseRef.current === 'flash') {
          /* the flash timer decides what comes next */
        } else if (phaseRef.current === 'sleep') {
          if (asleepRef.current && specRef.current) {
            setSpec({ name: specRef.current.name, token: ++tokenRef.current });
          } else {
            phaseRef.current = 'idle';
            scheduleIdle(1200);
          }
        } else {
          scheduleIdle(1200 + Math.random() * 2600);
        }
      };

      const frameIndex = useSpriteFrame(
        assets ? assets.manifest : null,
        spec,
        handleAnimationEnd,
      );

      React.useEffect(() => {
        if (!assets || reducedMotion) return;
        if (phaseRef.current === 'idle') scheduleIdle(250);
      }, [tier]);

      React.useEffect(() => {
        if (!assets) return undefined;
        if (reducedMotion) {
          setFlash(null);
          return undefined;
        }
        if (!flash) return undefined;
        const name = flashAnimation(assets, flash.kind, tierRef.current);
        if (!name) {
          setFlash(null);
          return undefined;
        }
        clearTimer('idle');
        phaseRef.current = 'flash';
        setSpec({ name, token: ++tokenRef.current });
        timersRef.current.flash = window.setTimeout(() => setFlash(null), 2400);
        return () => clearTimer('flash');
      }, [flash, assets]);

      React.useEffect(() => {
        if (!assets || reducedMotion) return;
        if (!resultBaselineRef.current) {
          resultBaselineRef.current = true;
          lastResultSeqRef.current = activity.resultSeq;
          return;
        }
        if (activity.resultSeq === null || activity.resultSeq === lastResultSeqRef.current) return;
        lastResultSeqRef.current = activity.resultSeq;
        if (activity.waiting) return;
        setFlash({
          kind: activity.resultError ? 'error' : 'success',
          token: ++flashTokenRef.current,
        });
      }, [assets, activity.resultSeq, activity.resultError, activity.waiting]);

      React.useEffect(() => {
        if (!assets || reducedMotion) return undefined;
        if (!activity.toolName) return undefined;
        // Fidget once when a single tool call runs unusually long.
        const timer = window.setTimeout(() => {
          setFlash({ kind: 'slow', token: ++flashTokenRef.current });
        }, SLOW_TOOL_MS);
        return () => window.clearTimeout(timer);
      }, [assets, activity.toolName, activity.resultSeq, reducedMotion]);

      React.useEffect(() => {
        if (!assets || reducedMotion) return;
        const count = activity.queued || 0;
        const previous = lastQueuedRef.current;
        lastQueuedRef.current = count;
        if (previous === null) return;
        if (count > previous) {
          setFlash({ kind: 'queue', token: ++flashTokenRef.current });
        }
      }, [assets, activity.queued, reducedMotion]);

      React.useEffect(() => {
        if (reducedMotion) return;
        const was = prevRunningRef.current;
        prevRunningRef.current = activity.running;
        if (was === true && activity.running === false && !activity.waiting) {
          setFlash({ kind: 'done', token: ++flashTokenRef.current });
        }
      }, [activity.running, activity.waiting]);

      React.useEffect(() => {
        if (!assets) return;
        const busy = !!(activity.running || activity.waiting || activity.toolName || activityName);
        if (!busy) return;
        armSleep();
        if (asleepRef.current) wake();
      }, [assets, activity.running, activity.waiting, activity.toolName, activityName]);

      React.useEffect(() => {
        if (!assets || flash || reducedMotion) return;
        if (!activityName) {
          if (phaseRef.current === 'activity' || phaseRef.current === 'flash') {
            phaseRef.current = 'idle';
            scheduleIdle(300);
          }
          return;
        }
        if (phaseRef.current === 'intro' || phaseRef.current === 'react') return;
        if (
          phaseRef.current === 'activity' &&
          specRef.current &&
          specRef.current.name === activityName
        ) {
          return;
        }
        beginActivity(activityName);
      }, [activityName, flash, assets]);

      const speak = () => {
        if (!assets) return;
        const animations = assets.manifest.animations;
        const entries = Array.isArray(assets.config.speech)
          ? assets.config.speech.filter(
              (entry) => entry && typeof entry.key === 'string' && animations[entry.anim],
            )
          : [];
        if (!entries.length) return;
        const entry = entries[Math.floor(Math.random() * entries.length)];
        clearTimer('idle');
        clearTimer('bubble');
        phaseRef.current = 'react';
        setSpec({
          name: resolveAnimationName(assets.manifest, entry.anim, tierRef.current),
          token: ++tokenRef.current,
        });
        lineTokenRef.current += 1;
        setLine({ key: entry.key, text: translate(entry.key) });
        timersRef.current.bubble = window.setTimeout(() => setLine(null), BUBBLE_MS);
        armSleep();
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

      if (!assets || !bounds) return null;

      const width = assets.displayWidth;
      const height = assets.displayHeight;
      const scale = assets.scale;
      const geo = {
        minX: bounds.left + MARGIN,
        maxX: Math.max(bounds.left + MARGIN, bounds.right - width - MARGIN),
        minY: bounds.top + MARGIN,
        maxY: Math.max(bounds.top + MARGIN, bounds.bottom - height - MARGIN),
      };
      geoRef.current = geo;

      const x = geo.minX + (geo.maxX - geo.minX) * fraction.fx;
      const y = geo.minY + (geo.maxY - geo.minY) * fraction.fy;
      const animation = spec ? assets.manifest.animations[spec.name] : null;
      const frames = animation ? animation.frames : [];
      const frame = frames.length ? frames[Math.min(frameIndex, frames.length - 1)] : null;

      const openMenu = () => {
        if (asleepRef.current) wake();
        setLine(null);
        setMenuOpen(true);
      };

      const onPointerDown = (event) => {
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        const button = event.currentTarget;
        try {
          button.setPointerCapture(event.pointerId);
        } catch (error) {
          /* capture is best-effort */
        }
        const drag = {
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          originX: x,
          originY: y,
          moved: false,
          suppressClick: false,
          longPress: 0,
        };
        if (event.pointerType !== 'mouse') {
          drag.longPress = window.setTimeout(() => {
            drag.suppressClick = true;
            openMenu();
          }, LONG_PRESS_MS);
        }
        dragRef.current = drag;
        setDragging(true);
        if (asleepRef.current) wake();
        armSleep();
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
        if (drag.longPress) {
          window.clearTimeout(drag.longPress);
          drag.longPress = 0;
        }
        const rangeX = geo.maxX - geo.minX;
        const rangeY = geo.maxY - geo.minY;
        const nx = clamp(drag.originX + dx, geo.minX, geo.maxX);
        const ny = clamp(drag.originY + dy, geo.minY, geo.maxY);
        setFraction({
          fx: rangeX > 0 ? (nx - geo.minX) / rangeX : 0,
          fy: rangeY > 0 ? (ny - geo.minY) / rangeY : 0,
        });
      };

      const finishPointer = (event, cancelled) => {
        const drag = dragRef.current;
        if (!drag || drag.pointerId !== event.pointerId) return;
        if (drag.longPress) window.clearTimeout(drag.longPress);
        dragRef.current = null;
        setDragging(false);
        try {
          event.currentTarget.releasePointerCapture(event.pointerId);
        } catch (error) {
          /* capture is best-effort */
        }
        if (cancelled) {
          if (drag.moved) persistFraction(fractionRef.current);
          return;
        }
        if (drag.moved) {
          persistFraction(fractionRef.current);
        } else if (!drag.suppressClick) {
          poke();
        }
      };

      const onKeyDown = (event) => {
        if (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10')) {
          event.preventDefault();
          openMenu();
          return;
        }
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
          if (asleepRef.current) wake();
          else speak();
          return;
        }
        if (event.key === 'Escape') {
          if (menuOpen) setMenuOpen(false);
          else if (!asleepRef.current) setLine(null);
        }
      };

      const hint = translate(asleep ? 'hintAsleep' : 'hint');
      const bubbleBelow = y - bounds.top < 120;
      const bubbleStyle = {};
      const halfWidth = width / 2;
      const center = x + halfWidth;
      // Keep the tail on the sprite's centre even when the bubble is clamped to
      // a chat-column edge and no longer centred on the sprite.
      let tailLeft = '50%';
      if (center + 140 > bounds.right - 4) {
        bubbleStyle.left = 'auto';
        bubbleStyle.right = '0px';
        bubbleStyle.transform = 'none';
        bubbleStyle.minWidth = Math.ceil(halfWidth + 24) + 'px';
        tailLeft = 'max(12px, calc(100% - ' + halfWidth + 'px))';
      } else if (center - 140 < bounds.left + 4) {
        bubbleStyle.left = '0px';
        bubbleStyle.transform = 'none';
        bubbleStyle.minWidth = Math.ceil(halfWidth + 24) + 'px';
        tailLeft = 'min(calc(100% - 12px), ' + halfWidth + 'px)';
      }

      const menuWidth = 210;
      const menuLeft =
        clamp(center - menuWidth / 2, bounds.left + 8, bounds.right - menuWidth - 8) - x;
      const menuStyle = { left: Math.round(menuLeft) + 'px' };
      if (y - bounds.top < 170) menuStyle.top = 'calc(100% + 10px)';
      else menuStyle.bottom = 'calc(100% + 10px)';

      const menu = menuOpen
        ? h(
            'div',
            {
              key: 'menu',
              ref: menuRef,
              className: 'dscc-menu',
              style: menuStyle,
              role: 'menu',
              'aria-label': translate('menuAria'),
              onContextMenu: (event) => event.preventDefault(),
            },
            [
              h('div', { key: 'title', className: 'dscc-menuTitle' }, translate('menuTitle')),
              ...PRESETS.map((meta) => {
                const current = meta.id === presetId;
                return h(
                  'button',
                  {
                    key: meta.id,
                    type: 'button',
                    className: 'dscc-menuItem',
                    role: 'menuitemradio',
                    'aria-checked': current ? 'true' : 'false',
                    onClick: () => {
                      presetStore.set(meta.id);
                      setMenuOpen(false);
                    },
                  },
                  [
                    h('span', { key: 'label' }, translate('preset.' + meta.id)),
                    current
                      ? h(CheckIcon, { key: 'check' })
                      : h('span', { key: 'space', className: 'dscc-checkEmpty' }),
                  ],
                );
              }),
            ],
          )
        : null;

      return h(
        'div',
        {
          className: 'dscc-root',
          'data-dragging': dragging ? 'true' : 'false',
          'data-pressed': dragging ? 'true' : 'false',
          'data-asleep': asleep ? 'true' : 'false',
          style: {
            left: Math.round(x) + 'px',
            top: Math.round(y) + 'px',
            width: width + 'px',
            height: height + 'px',
          },
        },
        [
          h(
            'button',
            {
              key: 'button',
              ref: buttonRef,
              type: 'button',
              className: 'dscc-button',
              'aria-label': translate(asleep ? 'ariaAsleep' : 'aria'),
              'aria-haspopup': 'menu',
              'aria-expanded': menuOpen ? 'true' : 'false',
              title: hint,
              onPointerDown,
              onPointerMove,
              onPointerUp: (event) => finishPointer(event, false),
              onPointerCancel: (event) => finishPointer(event, true),
              onKeyDown,
              onContextMenu: (event) => {
                event.preventDefault();
                openMenu();
              },
            },
            h('div', {
              className: 'dscc-sprite',
              'aria-hidden': 'true',
              style: frame
                ? {
                    width: width + 'px',
                    height: height + 'px',
                    backgroundImage: 'url("' + assets.spriteUrl + '")',
                    backgroundSize:
                      assets.sheetWidth * scale + 'px ' + assets.sheetHeight * scale + 'px',
                    backgroundPosition:
                      -frame.position[0] * scale + 'px ' + -frame.position[1] * scale + 'px',
                    imageRendering: assets.config.pixelated ? 'pixelated' : 'auto',
                  }
                : {
                    width: width + 'px',
                    height: height + 'px',
                    visibility: 'hidden',
                  },
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
                  onClick: () => {
                    if (asleepRef.current) wake();
                    else setLine(null);
                  },
                },
                line.text,
                h('span', {
                  key: 'tail',
                  className: 'dscc-tail',
                  style: { left: tailLeft },
                  'aria-hidden': 'true',
                }),
              )
            : null,
          menu,
        ],
      );
    }

    function CompanionSettings({ presetStore, translate: injectedTranslate, t }) {
      const translate = useTranslate(injectedTranslate, t);
      const current = useStore(presetStore);

      return h('div', { className: 'dscc-setting' }, [
        h('div', { key: 'text', className: 'dscc-settingText' }, [
          h('div', { key: 'title', className: 'dscc-settingTitle' }, translate('settingsTitle')),
          h(
            'div',
            { key: 'desc', className: 'dscc-settingDesc' },
            translate('settingsDescription'),
          ),
        ]),
        h(
          'div',
          {
            key: 'control',
            className: 'dscc-segment',
            role: 'radiogroup',
            'aria-label': translate('menuAria'),
          },
          PRESETS.map((meta) =>
            h(
              'button',
              {
                key: meta.id,
                type: 'button',
                role: 'radio',
                'aria-checked': meta.id === current ? 'true' : 'false',
                onClick: () => presetStore.set(meta.id),
              },
              translate('preset.' + meta.id),
            ),
          ),
        ),
      ]);
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
        const context = createContextStore();
        const activity = createActivityStore();
        const presetStore = createPresetStore();
        let translate = null;
        try {
          translate = ctx.locale.bind(NS);
        } catch (error) {
          translate = null;
        }

        ctx.effect(() => registerLocale(ctx));

        ctx.effect(() => {
          const tag = document.createElement('style');
          tag.dataset.plugin = 'dsh-clippy-companion';
          tag.textContent = CSS;
          document.head.appendChild(tag);
          return () => tag.remove();
        });

        ctx.slots.inject('shell.overlay', () =>
          ctx.slots.register(
            {
              name: 'shell.overlay',
              id: 'clippy-companion',
              order: 20,
              locale: NS,
              inject: () => ({ bounds, context, activity, presetStore, translate }),
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
              inject: () => ({ bounds, context, activity }),
            },
            ChatBoundsProbe,
          ),
        );

        ctx.slots.inject('settings.general.item', () =>
          ctx.slots.register(
            {
              name: 'settings.general.item',
              id: 'clippy-companion',
              order: 22,
              locale: NS,
              inject: () => ({ presetStore, translate }),
            },
            CompanionSettings,
          ),
        );
      },
    };
  },
});
