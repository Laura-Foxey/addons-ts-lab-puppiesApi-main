import app from './app';
const port = 3001;

app.listen(port, (): void => {
  console.log(`App listening on port ${port}`);
});
