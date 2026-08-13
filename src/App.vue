<script setup>
import { computed, reactive, ref, watch } from 'vue'

const defaultSettings = {
  eyebrow: 'IKUN INTENSITY CALIBRATOR / VUE 3',
  title: '坤坤历险记',
  intensityLabel: '坤系浓度',
  loadingLabel: '载入连续坤力…',
  hint: '拖动以增强坤系浓度',
  footer: '舞台能量协议：已启用',
  stages: [
    { name: '练习生', image: '/portraits/00-liang.png' },
    { name: '初舞台', image: '/portraits/01-liang.png' },
    { name: '鸡哥', image: '/portraits/02-liang.png' },
    { name: '顶流坤', image: '/portraits/03-liang.png' },
    { name: '舞台王者', image: '/portraits/04-liang.png' },
    { name: '宗主', image: '/portraits/05-liang.png' },
  ],
}

const liangSettings = {
  ...defaultSettings,
  eyebrow: 'LIANG INTENSITY CALIBRATOR / VUE 3',
  title: '滑动变祖器',
  intensityLabel: '梁系强度',
  loadingLabel: '载入连续祖力…',
  hint: '拖动以增强梁系浓度',
  footer: '正脸识别协议：已启用',
  stages: [
    { name: '小难梁', image: 'https://raw.githubusercontent.com/Lichtspektrum/liang-intensity-calibrator/main/public/portraits/00-laoliang.png' },
    { name: '牢梁', image: 'https://raw.githubusercontent.com/Lichtspektrum/liang-intensity-calibrator/main/public/portraits/01-xiaoliang.png' },
    { name: '梁子', image: 'https://raw.githubusercontent.com/Lichtspektrum/liang-intensity-calibrator/main/public/portraits/02-liangzi.png' },
    { name: '梁圣', image: 'https://raw.githubusercontent.com/Lichtspektrum/liang-intensity-calibrator/main/public/portraits/03-liangsheng.png' },
    { name: '梁神', image: 'https://raw.githubusercontent.com/Lichtspektrum/liang-intensity-calibrator/main/public/portraits/04-liangshen.png' },
    { name: '梁祖', image: 'https://raw.githubusercontent.com/Lichtspektrum/liang-intensity-calibrator/main/public/portraits/05-liangzu.png' },
  ],
}

function clone(value) { return JSON.parse(JSON.stringify(value)) }
function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem('intensity-calibrator-settings'))
    if (saved?.stages?.length === 6) return { ...clone(defaultSettings), ...saved, stages: saved.stages }
  } catch (_) { /* Use defaults when saved data is invalid. */ }
  return clone(defaultSettings)
}

const settings = reactive(loadSettings())
const draft = reactive(clone(settings))
const isSettingsOpen = ref(false)
const isProd = import.meta.env.PROD

const level = ref(0)
const loading = ref(true)
const loadFailed = ref(false)
const stageIndex = computed(() => Math.min(5, Math.floor(level.value / 6)))
const stage = computed(() => settings.stages[stageIndex.value].name)
const intensity = computed(() => level.value / 30)
const nextIndex = computed(() => Math.min(5, stageIndex.value + 1))
const blend = computed(() => stageIndex.value === 5 ? 0 : (level.value % 6) / 6)
const appStyle = computed(() => ({ '--strength': intensity.value, '--blend': blend.value }))

function imageLoaded() { loading.value = false }
function imageError() { loading.value = false; loadFailed.value = true }
function openSettings() { Object.assign(draft, clone(settings)); isSettingsOpen.value = true }
function saveSettings() {
  Object.assign(settings, clone(draft))
  localStorage.setItem('intensity-calibrator-settings', JSON.stringify(settings))
  loading.value = true
  loadFailed.value = false
  isSettingsOpen.value = false
}
function resetSettings() { Object.assign(draft, clone(defaultSettings)) }
function useLiangSettings() { Object.assign(draft, clone(liangSettings)) }
function closeSettings() { isSettingsOpen.value = false }
watch(isSettingsOpen, (open) => { document.body.style.overflow = open ? 'hidden' : '' })
</script>

<template>
  <main class="experience" :class="{ 'is-dark': stageIndex >= 4, 'is-ancestor': stageIndex === 5 }" :style="appStyle">
    <header class="masthead">
      <div>
        <p class="eyebrow">{{ settings.eyebrow }}</p>
        <h1>{{ settings.title }}</h1>
      </div>
      <div class="level-meter" aria-live="polite">
        <span>{{ settings.intensityLabel }}</span>
        <output>{{ String(Math.round(level)).padStart(2, '0') }} / 30</output>
      </div>
      <button class="settings-button" type="button" aria-label="打开设置" @click="openSettings">设置</button>
    </header>

    <section class="portrait-zone" aria-label="当前坤系状态">
      <p class="stage-ghost" aria-hidden="true">{{ stage }}</p>
      <div class="portrait-shell">
        <div class="imperial-halo" aria-hidden="true"></div>
        <img class="portrait portrait-base" :src="settings.stages[stageIndex].image" :alt="`当前形态：${stage}`" @load="imageLoaded" @error="imageError" />
        <img v-if="stageIndex < 5" class="portrait portrait-next" :src="settings.stages[nextIndex].image" alt="" aria-hidden="true" />
        <div class="scan-grid" aria-hidden="true"></div>
        <i v-for="corner in ['tl', 'tr', 'bl', 'br']" :key="corner" class="frame-corner" :class="`frame-corner--${corner}`" aria-hidden="true"></i>
        <div v-if="loading || loadFailed" class="load-state" :class="{ error: loadFailed }">{{ loadFailed ? '图像加载失败，请检查网络' : settings.loadingLabel }}</div>
      </div>
      <div class="stage-readout">
        <span>当前状态</span>
        <p>{{ stage }}</p>
        <span>阶段 {{ String(stageIndex + 1).padStart(2, '0') }} / 06</span>
      </div>
    </section>

    <section class="control-panel" aria-label="坤系浓度控制">
      <div class="range-wrap">
        <div class="tick-track" aria-hidden="true"><i v-for="tick in 31" :key="tick" :class="{ active: tick - 1 <= Math.round(level) }"></i></div>
        <input v-model.number="level" class="strength-slider" type="range" min="0" max="30" step="0.01" aria-label="坤系浓度" />
      </div>
      <ol class="stage-markers"><li v-for="(item, index) in settings.stages" :key="index" :class="{ passed: index < stageIndex, current: index === stageIndex }">{{ item.name }}</li></ol>
      <p class="drag-hint"><span>←</span> {{ settings.hint }} <span>→</span></p>
    </section>

    <footer><span>31 级连续进化</span><span>{{ settings.footer }}</span></footer>

    <Teleport to="body">
      <div v-if="isSettingsOpen" class="settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-title" @click.self="closeSettings">
        <form class="settings-card" @submit.prevent="saveSettings">
          <header><div><p class="eyebrow">CALIBRATOR CONFIG</p><h2 id="settings-title">主题设置</h2></div><button type="button" class="icon-button" aria-label="关闭设置" @click="closeSettings">×</button></header>
          <div class="settings-scroll">
            <label>主标题<input v-model.trim="draft.title" maxlength="20" required /></label>
            <label>顶部英文<input v-model.trim="draft.eyebrow" maxlength="60" /></label>
            <label>强度标签<input v-model.trim="draft.intensityLabel" maxlength="12" required /></label>
            <label>加载提示<input v-model.trim="draft.loadingLabel" maxlength="24" /></label>
            <label>滑杆提示<input v-model.trim="draft.hint" maxlength="24" /></label>
            <label>底部提示<input v-model.trim="draft.footer" maxlength="24" /></label>
            <fieldset><legend>六个阶段</legend><div v-for="(item, index) in draft.stages" :key="index" class="stage-editor"><span>{{ String(index + 1).padStart(2, '0') }}</span><label>名称<input v-model.trim="item.name" maxlength="10" required /></label><label>图片地址<input v-model.trim="item.image" required placeholder="/portraits/00-liang.png 或 https://..." /></label><img :src="item.image" alt="图片预览" /></div></fieldset>
          </div>
          <footer><div class="preset-actions"><button type="button" class="secondary-button" @click="resetSettings">恢复默认</button><button v-if="!isProd" type="button" class="secondary-button liang-button" @click="useLiangSettings">liang</button></div><div><button type="button" class="secondary-button" @click="closeSettings">取消</button><button class="primary-button" type="submit">保存设置</button></div></footer>
        </form>
      </div>
    </Teleport>
  </main>
</template>
