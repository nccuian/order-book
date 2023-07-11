<script setup>
import { computed } from "vue";

import { useOrderStore } from "../store/order";
import { TREND_TYPE } from "../utils/constant";
import { getSizeBarWidth } from "../utils/helpers";

// store
const orderStore = useOrderStore();

// 顯示出來的bid
const displayBids = computed(() => {
  const obj = orderStore.bidPrizeSizeMap;
  return Object.keys(obj)
    .filter((key) => +obj[key].size !== 0)
    .sort((a, b) => obj[b].price - obj[a].price)
    .slice(0, 8)
    .map((key) => ({
      price: obj[key].price,
      size: obj[key].size,
      trend: obj[key].trend,
    }));
});

// bid累積數量
const totalBidSizeArr = computed(() => {
  const arr = [];
  // 從前加到後
  for (let i = 0; i < displayBids.value.length; i++) {
    if (i === 0) arr[i] = +displayBids.value[i].size;
    else arr[i] = arr[i - 1] + +displayBids.value[i].size;
    // 出現過的存起來
    existBids.add(displayBids.value[i].price);
  }
  return arr;
});

// 紀錄出現過的bid
const existBids = new Set();
</script>

<template>
  <template v-for="(bid, i) in displayBids" :key="bid.price">
    <div class="bid row" :class="{ 'flash-green': !existBids.has(bid.price) }">
      <div>{{ $filter.formatCommas(bid.price) }}</div>
      <div
        class="text-right"
        :class="{
          'flash-green': bid.trend === TREND_TYPE.UP,
          'flash-red': bid.trend === TREND_TYPE.DOWN,
        }"
      >
        {{ $filter.formatCommas(bid.size) }}
      </div>
      <div class="text-right">
        {{ $filter.formatCommas(totalBidSizeArr[i]) }}
        <span
          class="size-bar"
          :style="{
            width: getSizeBarWidth(
              totalBidSizeArr[i],
              totalBidSizeArr[totalBidSizeArr.length - 1]
            ),
          }"
        />
      </div>
    </div>
  </template>
</template>

<style scoped lang="scss">
.row {
  display: grid;
  grid-template-columns: 30% 25% 45%;
  padding: 2px 10px;
  transition: 0.2s;
  &:hover:not(.table-title) {
    background-color: var(--bg-quote-hover);
  }
}

.bid {
  div:first-child {
    color: var(--color-buy-price);
  }
  div:last-child {
    position: relative;
    margin-left: 15px;
    .size-bar {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      background-color: var(--bg-buy-size-bar);
    }
  }
}
</style>