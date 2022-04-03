import { EventEmitter } from 'events'

function ticker(number, cb) {
  let ticks = 0
  const eventEmitter = new EventEmitter()

  function tick() {
    eventEmitter.emit('tick', ticks)
    ticks += 1

    if (ticks * 50 >= number) {
      eventEmitter.emit('finished', ticks)
      cb(ticks)
    } else {
      scheduleTick()
    }
  }

  function scheduleTick() {
    setTimeout(tick, 50)
  }

  process.nextTick(tick)
  return eventEmitter
}

ticker(100, (ticks) => {
  console.log('Ticks:', ticks)
}).on('tick', () => console.log('Tick'))
