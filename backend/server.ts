import { Application, Status } from 'https://deno.land/x/oak/mod.ts';
import { FgCyan, Reset, BgBlack, FgGreen } from './utils/console-colors.ts';

const app = new Application();
const port = 8000;

//waits for the next middleware and logs to console (logging middleware)
app.use(async(context, next) => {
  await next();
  const {
    request: {
      url: { pathname },
      method,
    },
    response: { status },
  } = context;
  console.log(`${FgCyan}${pathname}${Reset} ${method} -> ${BgBlack}${FgGreen}  ${status}  ${Reset} \n`);
});

//serves file in the static folder, in case file does not exist. passes control to next middleware
app.use(async (context, next) => {
  const root = `${Deno.cwd()}/static`;
  try {
    await context.send({ root, index: 'index.html' });
  } catch {
    next();
  }
});

//handles not found routes
app.use((context) => {
  context.response.status = Status.NotFound
  context.response.body = `"${context.request.url.pathname}" not found`
})


app.addEventListener('listen', () => {
  console.log(`Listening on: localhost:${port}`);
});


await app.listen(`127.0.0.1:${port}`);
