# TREASURIO

[![My Skills](https://skillicons.dev/icons?i=ts,next,tailwind,react)](https://skillicons.dev)

[Aller sur le site ici](https://treasurehunt-jet.vercel.app/)

## Pourquoi Treasurio ?

Organisant régulièrement des courses d'orientation avec des proches, nous nous sommes rendus compte qu'il n'existait pas de solution pour le faire avec un outil dédié, en ligne, qui permette à chacun d'utiliser son téléphone pour s'orienter. Treasurio vient combler ce manque.

## Technologies pour la partie web

- Nextjs
- React
- Drizzle ORM
- tRPC
- PostgreSQL
- Google Maps API
- Clerk
- Tailwind
- Typescript
- Bun

### Plus de détail sur les technologies choisies

Le principal défi du site est de réaliser une application réactive tout en conservant un lien avec le serveur. L'ensemble des requêtes mettent à profit React Query et son cache local pour ne pas bloquer l'utilisateur. Ainsi, à chaque requête l'interface utilisateur est mise à jour immédiatement, pendant qu'en fond la requête est exécutée, pour ensuite rétablir les données en cas d'erreur et conserver la synchronisation avec la base de données.

Next et React permettent de réaliser un site performant et interactif. Environ la moitié du site est composé de React Server Components, l'autre moitié contient l'interactivité.
Drizzle permet de connecter l'application à la base de données de manière simple et en conservant les types pour Typescript. tRPC facilite la mise en place de requêtes, avec la complétion automatique dans l'éditeur et en offrant deux méthodes d'appel des requêtes très similaires que l'on soit côté serveur ou côté client.
La base de donnée PostgreSQL est une base de données standard choisie principalement par familiarité.
Pour l'authentification, Clerk offre une solution simple d'utilisation qui convient à une application de ce calibre.
