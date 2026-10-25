# Prismal — landing page

Page de présentation de la suite d'outils Revit **Prismal**, avec formulaire de contact.

- Site statique (HTML / CSS / JS), sans étape de build. Déployé par GitHub Pages depuis `main`.
- Le formulaire envoie ses données à la fonction Supabase `contact` (table `contacts`).
  Le SQL (`08_contacts.sql`) et la fonction sont dans le dépôt `Prismal-CSharp`, dossier `Licence/supabase`.
- Les demandes se consultent dans la page d'administration (onglet **Renseignements**), dépôt `prismal-compte`.

## Développer en local

```
node -e "require('http').createServer((q,r)=>require('fs').createReadStream('.'+(q.url==='/'?'/index.html':q.url.split('?')[0])).on('error',()=>r.end()).pipe(r)).listen(8765)"
```

puis ouvrir http://localhost:8765/
