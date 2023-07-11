import { defineStore } from 'pinia'
import { useWebSocket } from '@vueuse/core'
import { TREND_TYPE } from '../utils/constant'

const ORDER_TYPE = {
  SNAPSHOT: 'snapshot',
  DELTA: 'delta'
}

let lastSeqNum = ''

export const useOrderStore = defineStore('order', {
  state: () => ({
    askPrizeSizeMap: {}, // 賣
    bidPrizeSizeMap: {}, // 買
  }),
  actions: {
    // 建立連線
    initConnect() {
      const url = 'wss://ws.btse.com/ws/oss/futures'
      const { send } = useWebSocket(url, {
        autoReconnect: true,
        onMessage: (message, event) => { this.handleMessage(JSON.parse(event.data)) }
      })
      send(JSON.stringify({
        op: 'subscribe',
        args: ['update:BTCPFC'],
      }))
    },
    // message handler
    handleMessage(data) {
      if (!data.topic) return;
      switch (data.data.type) {
        case ORDER_TYPE.SNAPSHOT: // snapshot
          data.data.asks.forEach(ask => {
            const [price, size] = ask
            this.askPrizeSizeMap[price] = { price, size, trend: TREND_TYPE.NONE }
          })
          data.data.bids.forEach(bid => {
            const [price, size] = bid
            this.bidPrizeSizeMap[price] = { price, size, trend: TREND_TYPE.NONE }
          })
          break
        case ORDER_TYPE.DELTA: // delta
          // resubscribe
          if (lastSeqNum && lastSeqNum !== data.data.prevSeqNum) {
            send(JSON.stringify({
              op: "unsubscribe",
              args: ["update:BTCPFC"],
            }))
            send(JSON.stringify({
              op: "subscribe",
              args: ["update:BTCPFC"],
            }))
            return
          }

          // 更新 lastSeqNum
          lastSeqNum = data.data.seqNum

          // ask
          data.data.asks.forEach(ask => {
            const [price, size] = ask
            const foundOrder = this.askPrizeSizeMap[price]
            if (foundOrder) {
              const trend =
                foundOrder.size === size ? TREND_TYPE.NONE
                  : foundOrder.size > size ? TREND_TYPE.DOWN
                    : TREND_TYPE.UP
              this.askPrizeSizeMap[price] = {
                price,
                size,
                trend
              }
            } else {
              this.askPrizeSizeMap[price] = { price, size, trend: TREND_TYPE.NONE }
            }
          })
          // bid
          data.data.bids.forEach(bid => {
            const [price, size] = bid
            const foundOrder = this.bidPrizeSizeMap[price]
            if (foundOrder) {
              const trend =
                foundOrder.size === size ? TREND_TYPE.NONE
                  : foundOrder.size > size ? TREND_TYPE.DOWN
                    : TREND_TYPE.UP
              this.bidPrizeSizeMap[price] = {
                price,
                size,
                trend
              }
            } else {
              this.bidPrizeSizeMap[price] = { size, trend: TREND_TYPE.NONE }
            }
          })
          break
        default:
          return
      }
    }
  }
})
