import { EventEmitter } from 'events'
import { readFile } from 'fs'

class FindRegex extends EventEmitter {
  constructor(regex) {
    super()
    this.regex = regex
    this.files = []
  }
  addFile(file) {
    this.files.push(file)
    return this
  }
  find() {
    process.nextTick(() => this.emit('start', this.files))
    for (const file of this.files) {
      readFile(file, 'utf8', (err, content) => {
        if (err) {
          return this.emit('error', err)
        }
        this.emit('fileread', file)
        const match = content.match(this.regex)
        if (match) {
          match.forEach((elem) => this.emit('found', file, elem))
        }
      })
    }
    return this
  }
}

const findRegex = new FindRegex(/hello \w+/)

findRegex
  .addFile('hello.txt')
  .addFile('helloNode.txt')
  .find()
  .on('start', (files) => {
    console.log('starting reading:', files)
  })
  .on('fileread', (file) => {
    console.log('Reading:', file)
  })
  .on('found', (file, elem) => {
    console.log(elem)
  })
  .on('error', (error) => {
    console.error('Emits error:', error.message)
  })
