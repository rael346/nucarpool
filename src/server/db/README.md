## Prisma

---

Prisma is an [ORM](https://stackoverflow.com/questions/1279613/what-is-an-orm-how-does-it-work-and-how-should-i-use-one), which lets us interact with a database without writing SQL queries as a string. This folder contains our Prisma client, which we use to interact with our mySQL database. In this codebase, the client is accessed through the [Context](../router/context.ts). "Context allows us to "bundle" together information to be passed into each API request". For a better understanding of Prisma overall, I recommend following this [guide](https://www.prisma.io/docs/getting-started/quickstart). Since you need a database for this guide, I recommend using PlanetScale, since it's easy to use and it's what Duy used. 

### Contents:

- [Usage](#usage)

---

### Usage 

Prisma is used in the [user route](../router/user.ts). Below is a code snippet that is NOT from the codebase, but it still tells you everything you need to know about Prisma. 

```typescript
// Sample router.
const fooRouter = createRouter()
  .query("name", {
    input: z.object({
      userId: z.number().int()
    }),
    resolve: async ({ ctx, input }) => {
      return ctx.prisma.user.findOne({
        where: { id: input.userId},
        select: { name: true }
      )
    }
  })
```

There are a few important things happening here. 

1. As I mentioned earlier, we access the prisma client through the context (```ctx.prisma```), which is available in every API request.  

2. In this example, we are querying data in the user table, which we can specify by saying ```prisma.user```.

3. We use the function ```findOne()```, which returns a user in the user table that matches the ID in the where "clause", and only displays the name of the user. 
    
    This is roughly equivalent to the SQL query: ```SELECT name FROM user WHERE id = userId;```