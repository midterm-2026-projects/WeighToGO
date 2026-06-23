import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


export default app;