import { EventEmitter } from 'events'

function ticker(number, cb) {
  let ticks = 0
  const eventEmitter = new EventEmitter()

  function tick() {
    if (Date.now() % 5 === 0) {
      const error = new Error('Current timestamp is divisibled by 5')
      eventEmitter.emit('error', error)
      return cb(error)
    }

    eventEmitter.emit('tick', ticks)
    ticks += 1

    setTimeout(() => {
      if (ticks * 50 >= number) {
        eventEmitter.emit('finished', ticks)
        return cb(null, ticks)
      }

      tick()
    }, 50)
  }

  process.nextTick(tick)

  return eventEmitter
}

ticker(100, (err, ticks) => {
  if (err) {
    return console.error(err.message)
  }
  console.log('Ticks:', ticks)
}).on('tick', () => console.log('Tick'))
