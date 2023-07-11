<script setup>
import { computed } from "vue";

import { TREND_TYPE } from "./utils/constant";

import { useOrderStore } from "./store/order";
import { useLastPriceStore } from "./store/lastPrice";

import LastPrice from "./components/Lastprice.vue";
import AskOrder from "./components/AskOrder.vue";
import BidOrder from "./components/BidOrder.vue";

// store
const orderStore = useOrderStore();
const lastPriceStore = useLastPriceStore();
orderStore.initConnect();
lastPriceStore.initConnect();
</script>

<template>
  <div class="order-book">
    <!-- header -->
    <div class="header">Order Book</div>

    <!-- table title -->
    <div class="table-title row">
      <div>Price(USD)</div>
      <div class="text-right">Size</div>
      <div class="text-right">Total</div>
    </div>

    <!-- sell -->
    <AskOrder />
    <!-- current price -->
    <LastPrice />
    <!-- buy -->
    <BidOrder />
  </div>
</template>

<style scoped lang="scss">
.order-book {
  width: 360px;
  min-height: 602px;
  background: var(--color-bg);
  border: 1px solid var(--color-table-header);
  padding-bottom: 10px;

  .header {
    padding: 6px 10px;
    font-size: 18px;
    font-weight: bold;
    border-bottom: 1px solid var(--color-table-header);
  }

  .row {
    display: grid;
    grid-template-columns: 30% 25% 45%;
    padding: 2px 10px;
    transition: 0.2s;
    &:hover:not(.table-title) {
      background-color: var(--bg-quote-hover);
    }
  }

  .table-title {
    color: var(--color-table-header);
  }
}
</style>
