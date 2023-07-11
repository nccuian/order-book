<script setup>
import { computed } from "vue";

import { useLastPriceStore } from "../store/lastPrice";
import { TREND_TYPE } from "../utils/constant";

import ArrowImg from "../assets/arrow-down.svg";

// store
const lastPriceStore = useLastPriceStore();

const trendClass = computed(() => {
  const trend = lastPriceStore.trend;
  return trend === TREND_TYPE.UP
    ? "up"
    : trend === TREND_TYPE.DOWN
    ? "down"
    : "same";
});
</script>

<template>
  <div class="last-price" :class="trendClass">
    {{ $filter.formatCommas(lastPriceStore.lastPrice.toFixed(1)) }}
    <ArrowImg />
  </div>
</template>

<style scoped lang="scss">
.last-price {
  padding: 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
  background-color: var(--bg-last-price);

  svg {
    margin-left: 4px;
    stroke-width: 3px;
  }

  &.same {
    color: var(--color-text);
    background-color: var(--bg-last-price);
    svg {
      opacity: 0;
    }
  }
  &.up {
    color: var(--color-buy-price);
    background-color: var(--bg-buy-size-bar);
    svg {
      transform: rotate(180deg);
    }
  }
  &.down {
    color: var(--color-sell-price);
    background-color: var(--bg-sell-size-bar);
  }
}
</style>