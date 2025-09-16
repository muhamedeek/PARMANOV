# Investment Portfolio (Embed-ready)

Этот проект готов для деплоя на Vercel/Netlify и вставки в WordPress через `<iframe>`.

## Быстрый старт
1. Загрузите весь архив в новый GitHub-репозиторий.
2. На **Vercel**: *New Project → Import Git Repository* → Framework: **Vite**, Build: `npm run build`, Output: `dist` → Deploy.
3. В WordPress добавьте блок **Пользовательский HTML** и вставьте:
```html
<div style="position:relative;width:100%;min-height:100vh;">
  <iframe src="https://ВАШ-ДОМЕН.vercel.app/" style="border:0;width:100%;height:100vh;" loading="lazy"></iframe>
</div>
```

## Примечания
- Tailwind подключён через CDN, поэтому внешний вид сохраняется без отдельной сборки Tailwind.
- Компоненты `Button`/`Card` заменены простыми заглушками в `src/ui-stubs.tsx`.
- Логика калькулятора и графики — как в исходном коде.
