<script setup>
import { computed, ref } from 'vue'

const stages = ['小难梁', '牢梁', '梁子', '梁圣', '梁神', '梁祖']
const portraits = [
  '/portraits/00-laoliang.png',
  '/portraits/01-xiaoliang.png',
  '/portraits/02-liangzi.png',
  '/portraits/03-liangsheng.png',
  '/portraits/04-liangshen.png',
  '/portraits/05-liangzu.png',
]

const level = ref(0)
const loading = ref(true)
const loadFailed = ref(false)
const stageIndex = computed(() => Math.min(5, Math.floor(level.value / 6)))
const stage = computed(() => stages[stageIndex.value])
const intensity = computed(() => level.value / 30)
const nextIndex = computed(() => Math.min(5, stageIndex.value + 1))
const blend = computed(() => stageIndex.value === 5 ? 0 : (level.value % 6) / 6)
const appStyle = computed(() => ({ '--strength': intensity.value, '--blend': blend.value }))

function imageLoaded() { loading.value = false }
function imageError() { loading.value = false; loadFailed.value = true }
</script>

<template>
  <main class="experience" :class="{ 'is-dark': stageIndex >= 4, 'is-ancestor': stageIndex === 5 }" :style="appStyle">
    <header class="masthead">
      <div>
        <p class="eyebrow">LIANG INTENSITY CALIBRATOR / VUE 3</p>
        <h1>滑动变祖器</h1>
      </div>
      <div class="level-meter" aria-live="polite">
        <span>梁系强度</span>
        <output>{{ String(Math.round(level)).padStart(2, '0') }} / 30</output>
      </div>
    </header>

    <section class="portrait-zone" aria-label="当前梁系状态">
      <p class="stage-ghost" aria-hidden="true">{{ stage }}</p>
      <div class="portrait-shell">
        <div class="imperial-halo" aria-hidden="true"></div>
        <img class="portrait portrait-base" :src="portraits[stageIndex]" :alt="`当前形态：${stage}`" @load="imageLoaded" @error="imageError" />
        <img v-if="stageIndex < 5" class="portrait portrait-next" :src="portraits[nextIndex]" alt="" aria-hidden="true" />
        <div class="scan-grid" aria-hidden="true"></div>
        <i v-for="corner in ['tl', 'tr', 'bl', 'br']" :key="corner" class="frame-corner" :class="`frame-corner--${corner}`" aria-hidden="true"></i>
        <div v-if="loading || loadFailed" class="load-state" :class="{ error: loadFailed }">{{ loadFailed ? '图像加载失败，请检查网络' : '载入连续祖力…' }}</div>
      </div>
      <div class="stage-readout">
        <span>当前状态</span>
        <p>{{ stage }}</p>
        <span>阶段 {{ String(stageIndex + 1).padStart(2, '0') }} / 06</span>
      </div>
    </section>

    <section class="control-panel" aria-label="梁系强度控制">
      <div class="range-wrap">
        <div class="tick-track" aria-hidden="true"><i v-for="tick in 31" :key="tick" :class="{ active: tick - 1 <= Math.round(level) }"></i></div>
        <input v-model.number="level" class="strength-slider" type="range" min="0" max="30" step="0.01" aria-label="梁系强度" />
      </div>
      <ol class="stage-markers"><li v-for="(name, index) in stages" :key="name" :class="{ passed: index < stageIndex, current: index === stageIndex }">{{ name }}</li></ol>
      <p class="drag-hint"><span>←</span> 拖动以增强梁系浓度 <span>→</span></p>
    </section>

    <footer><span>31 级连续进化</span><span>正脸识别协议：已启用</span></footer>
  </main>
</template>
