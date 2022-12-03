# Conduit

View it [here](http://conduits.ml/).

An article sharing platform similar to Medium.

The frontend is developed in [React](https://reactjs.org/), with the backend developed in [NestJS](https://nestjs.com/), connected to a PostgreSQL database with [TypeORM](https://typeorm.io/). [React-Query](https://tanstack.com/query/v4/?from=reactQueryV3&original=https://react-query-v3.tanstack.com/) is used for data fetching and [Zustand](https://github.com/pmndrs/zustand) is used to store (minimal) global state. The frontend is styled with [TailwindCSS](https://tailwindcss.com/).

The project is hosted on [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine) as a [Kubernetes Cluster](https://kubernetes.io/) with an [Nginx Ingress Controller](https://docs.nginx.com/nginx-ingress-controller/) for routing, and Nginx Server for serving the static build folder for the frontend.

It is part of a take home [real world](https://realworld-docs.netlify.app/docs/intro) project - an initiative that goes above and beyond simple todo lists. This was a great challenge and allowed me to explore new relational features like following, liking, and commenting.

Most people decide to only do a frontend or backend implementation, but I decided to both and use technologies like NestJS, React-Query and Zustand for the first time.

## Features

- Authentication via cookie-based JWT (access, refresh, token revoke, http interceptors)
- CRU\* users (register up & settings page - no deleting)
- CR\*D Articles
- CR\*\* Comments on articles (no updating)
- List articles and switch between user feed or selected tag
- Favorite articles
- Follow other users
- Filter articles by tag
- Filter articles by feed (shows followed users articles)
- Caching to reduce latency and improve user experience
- Server-side article pagination

## To Dos

- Total user follower list with unfollowing functionality (like Instagram)
- Delete comments on logged in user basis
- Tinker with styling to sooth perfectionism

## Database

![image](https://user-images.githubusercontent.com/50192239/202843975-2820871c-35af-4afb-be7b-f94c2419c648.png)
