
const mongoose = require('mongoose')
if (process.argv.length < 3 ) {
    console.log('needs more args')
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@cluster0.8yx9p.mongodb.net/phonebook?retryWrites=true&w=majority`
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })
  
const Person = mongoose.model('Person', personSchema)
  
if (process.argv.length > 3) {
    const name = process.argv[3]
    const num = process.argv[4]

    const person = new Person({
        name: name,
        number: num,
    })

    person.save().then(res => {
        console.log(`Added person ${name} with number ${num} to phonebook`)
        mongoose.connection.close()
    })
}
if (process.argv.length === 3) {
    console.log('phonebook:')
    Person.find({}).then(res => {
        res.forEach(per => console.log(per.name, per.number))
        mongoose.connection.close()
    })

}



