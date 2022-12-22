# Conduit

View it [here](http://conduits.ml/).

An article sharing platform similar to Medium.

The frontend is developed in React, with the backend developed in NestJS plus a PostgreSQL database. Other tools involved: React-Query, Zustand, TypeORM.

The project is deployed as a Kubernetes Cluster on Google Kubernetes Engine. There is a Nginx Ingress Controller for routing and seperate Nginx server for serving static files. The cluster is built from Docker containers.

It is part of a take home [real world](https://realworld-docs.netlify.app/docs/intro) project - an initiative that goes above and beyond simple todo lists. This was a great challenge and allowed me to explore new relational features like following, liking, and commenting.

Most people decide to only do a frontend or backend implementation, but I decided to both. 

A good opportunity to learn new tools and frameworks like NestJS, React-Query and Zustand.  

## Features
- JWT authentication with cookies for traditional sign on
- OAuth integration with Google for quick login/register
- CRU\* users (register up & settings page - no deleting)
- CR\*D Articles
- CR\*\* Comments on articles (no updating)
- List articles
- Favorite articles
- Filter articles by tag
- Filter articles by feed (shows followed users articles)
- Follow other users
- Caching to reduce latency and improve user experience
- Server-side article pagination
- File upload to S3 Bucket for profile pictures

## To Dos

- Total user follower list with unfollowing functionality (like Instagram)
- Delete comments on logged in user basis
- Tinker with styling to sooth perfectionism
- Full text search

## Database

![image](https://user-images.githubusercontent.com/50192239/202843975-2820871c-35af-4afb-be7b-f94c2419c648.png)
