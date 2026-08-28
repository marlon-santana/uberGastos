# Como adicionar ícones de aplicativo (Android/iOS)

- Android: coloque os ícones em android/app/src/main/res/mipmap-\*/
- iOS: adicione os ícones via Xcode (Assets.xcassets > AppIcon)
- Expo: defina o caminho do ícone em app.json, exemplo:

```json
{
  "expo": {
    "icon": "./src/shared/assets/icons/icon-1024.png"
  }
}
```

Recomenda-se usar ícones modernos e em alta resolução (PNG, 1024x1024px).
