# Site Amazona Pinturas

## Estrutura
```
index.html          página única (secções: início, serviços, porquê, obras, parceiros e processo, orçamento, contactos)
css/style.css       estilos (responsivo, com modo escuro automático)
js/config.js        configuração: URL do Google Sheets e número de WhatsApp
js/main.js          menu móvel e envio do formulário
assets/             logótipo, ícone e fotos (assets/obras/obra-1.jpg ... obra-6.jpg)
apps-script/Code.gs script que grava os pedidos na folha de cálculo
```

## 1. Ligar o formulário ao Google Sheets (10 minutos)
1. Em sheets.google.com crie uma folha nova com o nome "Pedidos Amazona".
2. Menu **Extensões > Apps Script**. Apague o código que lá está e cole o conteúdo de `apps-script/Code.gs`.
3. No topo do código confirme o email que recebe o aviso de cada pedido (`NOTIFY_EMAIL`). Deixe `''` para não receber emails.
4. **Implementar > Nova implementação > Tipo: Aplicação Web.** Execute como: **Eu**. Quem tem acesso: **Qualquer pessoa**. Autorize quando o Google pedir.
5. Copie o **URL da aplicação Web** (termina em `/exec`).
6. Abra `js/config.js` e cole o URL em `SHEETS_ENDPOINT`.
7. Teste: envie um pedido pelo site. Deve aparecer uma linha na folha "Pedidos" (a primeira linha com os cabeçalhos é criada sozinha).

Se alterar o código do Apps Script, faça **Implementar > Gerir implementações > Editar > Nova versão**, senão o site continua a usar a versão antiga.

## 2. Fotos das obras
Guarde as fotos em `assets/obras/` com os nomes `obra-1.jpg` a `obra-6.jpg` (formato horizontal, até 200 KB cada). Aparecem automaticamente no lugar da moldura "Foto da obra".

## 3. Publicar
Envie a pasta inteira para o alojamento do domínio amazonapinturas.com (ou para Netlify, Cloudflare Pages ou GitHub Pages). O `index.html` tem de ficar na raiz.

## 4. Privacidade
O formulário recolhe nome, telefone e dados da obra. Use esses dados só para responder aos pedidos e restrinja o acesso à folha de cálculo a quem precisa.
