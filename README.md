# GitHub Social

A social media platform for GitHub users built mostly with Experimental Edge stacks.

> **Warning**
> This project is using Next.js App Router, which is not production-ready yet. This project is built for learning/testing these stacks

## Features

- You can follow/unfollow users, fork/star repositories and everything will sync-up with your GitHub account
- You can share repositories in a post to share/promote/discuss it with your GitHub followers
- Users can scroll through timeline in homepage to view the latest posts, trending posts and posts made by the users that you followed on GitHub
- Notifications feature - view notifications in real-time when someone starring your repositories, share it in a post, comment or like your posts
- User profile - you can view users profile, followers, following, posts, repositories, liked posts and comments

## Tech-stacks

- [Next.js App Router](https://beta.nextjs.org/docs)
- [Shadcn UI](https://ui.shadcn.com/)
- [tRPC](https://trpc.io/)
- [Clerk](https://clerk.com/)
- [Drizzle Orm](https://github.com/drizzle-team/drizzle-orm)
- [PlanetScale's Database.js](https://github.com/planetscale/database-js)

## Deployments/Hosting

- Next.js: [Vercel](https://vercel.com/)
- Database (MySQL): [PlanetScale](https://planetscale.com/)
- Real-time Notifications: [Pusher](https://pusher.com/)

## Others

- [GitHub API](https://github.com/)

## Reference

I would like to shoutout [ploskovytskyy](https://github.com/ploskovytskyy) for open-sourcing his [edge project](https://github.com/ploskovytskyy/next-app-router-trpc-drizzle-planetscale-edge) which helped me a lot in configuring these edge stacks

## Getting Started

### Clone or fork the repository

To clone

```
git clone https://github.com/amirfakhrullah/gh-social.git
```

### Install

Copy `.env.example` to `.env` and update the credentials

```
cp .env.example .env
```

Install the dependencies (I'm using `pnpm`)

```
pnpm i
```

Run

```
pnpm dev
```