# my-app-template

WebAPP用テンプレート

## 環境

- FE：honox
- Runtime：deno
- DB：supabase

## 起動

```bash
curl -fsSL https://deno.land/install.sh | sh
# Supabase のイメージをセットアップするので、初回のみ時間がかかる
task db-up
task front-up
```
