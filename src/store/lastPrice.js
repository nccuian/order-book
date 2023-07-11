import { defineStore } from 'pinia'
import { useWebSocket } from '@vueuse/core'
import { TREND_TYPE } from '../utils/constant'

export const useLastPriceStore = defineStore('lastPrice', {
  state: () => ({
    lastPrice: 0, // 最新成交價
    trend: TREND_TYPE.NONE, // 變化
  }),
  actions: {
    // 建立連線
    initConnect() {
      const url = 'wss://ws.btse.com/ws/futures'
      const { send } = useWebSocket(url, {
        autoReconnect: true,
        onMessage: (message, event) => { this.handleMessage(JSON.parse(event.data)) }
      })
      send(JSON.stringify({
        op: 'subscribe',
        args: ['tradeHistoryApi:BTCPFC'],
      }))
    },
    // message handler
    handleMessage(data) {
      if (!data.topic) return;
      if (data.topic === 'tradeHistoryApi') {
        const currentPrice = data.data[0].price
        if (this.lastPrice) {
          this.trend =
            this.lastPrice === currentPrice ? TREND_TYPE.NONE
              : this.lastPrice > currentPrice ? TREND_TYPE.DOWN
                : TREND_TYPE.UP
        }
        this.lastPrice = currentPrice
      }
    }
  }
})
