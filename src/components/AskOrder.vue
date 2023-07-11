<script setup>
import { computed } from "vue";

import { useOrderStore } from "../store/order";
import { TREND_TYPE } from "../utils/constant";
import { getSizeBarWidth } from "../utils/helpers";

// store
const orderStore = useOrderStore();

// 顯示出來的ask
const displayAsks = computed(() => {
  const obj = orderStore.askPrizeSizeMap;
  const arr = Object.keys(obj);
  return arr
    .filter((key) => +obj[key].size !== 0)
    .sort((a, b) => obj[a].price - obj[b].price)
    .slice(0, 8)
    .reverse()
    .map((key) => ({
      price: obj[key].price,
      size: obj[key].size,
      trend: obj[key].trend,
    }));
});

// ask累積數量
const totalAskSizeArr = computed(() => {
  const arr = [];
  // 從後加到前
  for (let i = displayAsks.value.length - 1; i >= 0; i--) {
    if (i === displayAsks.value.length - 1) arr[i] = +displayAsks.value[i].size;
    else arr[i] = arr[i + 1] + +displayAsks.value[i].size;
    // 出現過的存起來
    existAsks.add(displayAsks.value[i].price);
  }
  return arr;
});

// 紀錄出現過的ask
const existAsks = new Set();
</script>

<template >
  <template v-for="(ask, i) in displayAsks" :key="ask.price">
    <div class="ask row" :class="{ 'flash-red': !existAsks.has(ask.price) }">
      <div>{{ $filter.formatCommas(ask.price) }}</div>
      <div
        class="text-right"
        :class="{
          'flash-green': ask.trend === TREND_TYPE.UP,
          'flash-red': ask.trend === TREND_TYPE.DOWN,
        }"
      >
        {{ $filter.formatCommas(ask.size) }}
      </div>
      <div class="text-right">
        {{ $filter.formatCommas(totalAskSizeArr[i]) }}
        <span
          class="size-bar"
          :style="{
            width: getSizeBarWidth(totalAskSizeArr[i], totalAskSizeArr[0]),
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

.ask {
  div:first-child {
    color: var(--color-sell-price);
  }
  div:last-child {
    position: relative;
    margin-left: 15px;
    .size-bar {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      background-color: var(--bg-sell-size-bar);
    }
  }
}
</style>