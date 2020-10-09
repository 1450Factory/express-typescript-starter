import app from './app';

const port = parseInt(process.env.PORT || '3000');
const hostname = process.env.HOST || '0.0.0.0';
const mode = process.env.NODE_ENV

/* Start Express server */
const server = app.listen(port, hostname, () => {
  console.log(`  App is running at http://${hostname}:${port} in ${mode} mode`);
  console.log('  Press CTRL-C to stop\n');
});

export default server;
