let mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/portfolio_query', { useNewUrlParser: true, useUnifiedTopology: true })
    // mongoose.connect(`mongodb+srv://amit_kumar:sapple@123@cluster0.zdwko.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
const db = mongoose.connection;
db.on('error', (error) => {
    console.log('Database could not be connected ' + error)
});

// db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
    console.log('Database is connected');
});