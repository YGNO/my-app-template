# my-app-template

WebAPP用テンプレート

## 環境

- FE：honox + react
- BE：hono + graphql
- DB：drizzle + supabase
- Runtime：deno

## dev起動

```bash
curl -fsSL https://deno.land/install.sh | sh
# Supabase のイメージをセットアップするので、初回のみ時間がかかる
task sb-up
# .env.local にローカルの supabase 設定を記入
task front-up
```

## ビルドのプレビュー

```bash
# .env.preview に接続先の supabase 設定を記入
# IPv4 環境から supabase にアクセスする場合は、IPv4 が許可されたURLを記載する
task front-prev
```
