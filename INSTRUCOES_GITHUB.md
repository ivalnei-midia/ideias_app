# 📋 Como Configurar o GitHub

## 1. Criar Repositório no GitHub

1. Acesse [github.com](https://github.com)
2. Clique em "New repository" (botão verde) ou no "+"
3. Configure:
   - **Repository name:** `ideias_app`
   - **Description:** `Aplicativo para gerenciamento de ideias com API completa`
   - **Visibility:** Public (recomendado para deploy gratuito)
   - **NÃO marque "Initialize with README"**
4. Clique em "Create repository"

## 2. Conectar Repositório Local

Após criar, copie a URL do repositório (exemplo: `https://github.com/SEU_USUARIO/ideias_app.git`)

Execute os comandos:

```bash
git remote add origin https://github.com/SEU_USUARIO/ideias_app.git
git branch -M main
git push -u origin main
```

## 3. Verificar Upload

Acesse seu repositório no GitHub e confirme que todos os arquivos foram enviados.

## 4. Próximo Passo: Deploy

Após confirmar que está tudo no GitHub, podemos prosseguir com o deploy no Render!

---

**Status:** Aguardando criação do repositório GitHub 📋 