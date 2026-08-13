<template>
  <section class="liang-calibrator" :class="{ dark: stageIndex >= 4, ancestor: stageIndex === 5 }" :style="{ '--strength': strength, '--blend': blend }">
    <header class="masthead">
      <div><p class="eyebrow">{{ config.eyebrow }}</p><h1>{{ config.title }}</h1></div>
      <div class="meter"><span>{{ config.intensityLabel }}</span><output>{{ pad(level) }} / 30</output></div>
      <button class="settings-button" type="button" @click="openSettings">设置</button>
    </header>

    <div class="portrait-zone">
      <div class="ghost" aria-hidden="true">{{ stage.name }}</div>
      <div class="portrait-shell">
        <div class="halo"></div>
        <img class="portrait" :src="stage.image" :alt="'当前形态：' + stage.name" @error="imageError = true" />
        <img v-if="stageIndex < 5" class="portrait next" :src="stages[stageIndex + 1].image" alt="" aria-hidden="true" />
        <div class="scan"></div><i class="corner tl"></i><i class="corner tr"></i><i class="corner bl"></i><i class="corner br"></i>
        <div v-if="imageError" class="load error">图像加载失败</div>
      </div>
      <div class="readout"><span>当前状态</span><strong>{{ stage.name }}</strong><span>阶段 {{ pad(stageIndex + 1) }} / 06</span></div>
    </div>

    <div class="controls">
      <div class="range-wrap"><div class="ticks"><i v-for="tick in 31" :key="tick" :class="{ active: tick - 1 <= roundedLevel }"></i></div><input v-model.number="level" type="range" min="0" max="30" step="0.01" @input="emitLevel" /></div>
      <ol class="markers"><li v-for="(item, index) in stages" :key="index" :class="{ passed: index < stageIndex, current: index === stageIndex }">{{ item.name }}</li></ol>
      <p class="hint">← {{ config.hint }} →</p>
    </div>
    <footer>31 级连续进化 <span>{{ config.footer }}</span></footer>

    <div v-if="settingsOpen" class="modal" @click.self="settingsOpen = false">
      <form class="card" @submit.prevent="saveSettings"><header><div><p class="eyebrow">LIANG CONFIG</p><h2>梁系设置</h2></div><button type="button" class="close" @click="settingsOpen = false">×</button></header>
        <div class="form-body"><label>标题<input v-model="draft.title" /></label><label>强度标签<input v-model="draft.intensityLabel" /></label><fieldset><legend>六个阶段</legend><div v-for="(item, index) in draft.stages" :key="index" class="stage-form"><input v-model="item.name" aria-label="阶段名称" /><input v-model="item.image" aria-label="图片地址" /><img :src="item.image" alt="预览" /></div></fieldset></div>
        <footer class="actions"><button type="button" @click="resetSettings">恢复默认</button><button class="primary" type="submit">保存设置</button></footer>
      </form>
    </div>
  </section>
</template>

<script>
const LIANG_STAGES = [
  ['小难梁', '00-laoliang.png'], ['牢梁', '01-xiaoliang.png'], ['梁子', '02-liangzi.png'],
  ['梁圣', '03-liangsheng.png'], ['梁神', '04-liangshen.png'], ['梁祖', '05-liangzu.png'],
].map(function (item) { return { name: item[0], image: 'https://raw.githubusercontent.com/Lichtspektrum/liang-intensity-calibrator/main/public/portraits/' + item[1] } })

function copy(value) { return JSON.parse(JSON.stringify(value)) }

export default {
  name: 'LiangIntensityCalibrator',
  model: { prop: 'value', event: 'input' },
  props: {
    value: { type: Number, default: 0 },
    title: { type: String, default: '滑动变祖器' },
    stageItems: { type: Array, default: function () { return copy(LIANG_STAGES) } },
  },
  data: function () { return { level: this.value, settingsOpen: false, imageError: false, draft: null } },
  computed: {
    config: function () { return { eyebrow: 'LIANG INTENSITY CALIBRATOR / VUE 2', title: this.title, intensityLabel: '梁系强度', hint: '拖动以增强梁系浓度', footer: '正脸识别协议：已启用' } },
    stages: function () { return this.stageItems },
    roundedLevel: function () { return Math.round(this.level) },
    strength: function () { return this.level / 30 },
    stageIndex: function () { return Math.min(5, Math.floor(this.level / 6)) },
    blend: function () { return this.stageIndex === 5 ? 0 : (this.level % 6) / 6 },
    stage: function () { return this.stages[this.stageIndex] },
  },
  watch: { value: function (value) { this.level = value } },
  methods: {
    pad: function (value) { return String(value).padStart(2, '0') },
    emitLevel: function () { this.$emit('input', this.level); this.$emit('change', this.level) },
    openSettings: function () { this.draft = { title: this.title, intensityLabel: '梁系强度', stages: copy(this.stageItems) }; this.settingsOpen = true },
    saveSettings: function () { this.$emit('update:config', copy(this.draft)); this.settingsOpen = false },
    resetSettings: function () { this.draft = { title: '滑动变祖器', intensityLabel: '梁系强度', stages: copy(LIANG_STAGES) } },
  },
}
</script>

<style scoped>
.liang-calibrator{--ink:#171816;--muted:#70746f;--accent:#b52b24;position:relative;isolation:isolate;display:grid;grid-template-rows:auto minmax(0,1fr) auto auto;min-height:100vh;overflow:hidden;padding:30px clamp(22px,4vw,62px) 20px;color:var(--ink);background:#e8e9e5}.liang-calibrator:before{content:"";position:absolute;inset:0;z-index:-1;opacity:calc(var(--strength)*.94);background:radial-gradient(circle at 50% 45%,#3b2c24,#111 70%)}.dark{--ink:#f4f1e8;--muted:#b8b4a9}.masthead{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}.eyebrow{margin:0 0 5px;color:var(--muted);font:10px Consolas,monospace;letter-spacing:.18em}h1{margin:0;font:900 clamp(34px,4.5vw,64px)/.95 "Songti SC",serif;letter-spacing:-.09em}.meter{min-width:118px;border-top:1px solid currentColor;padding-top:3px;text-align:right;font:10px Consolas,monospace}.meter span{display:block;color:var(--muted);letter-spacing:.14em}.meter output{display:block;margin-top:4px;font-size:20px}.settings-button,.card button{padding:8px 10px;border:1px solid currentColor;background:transparent;color:inherit;cursor:pointer;font:10px Consolas,monospace}.portrait-zone{display:flex;align-items:center;justify-content:center;flex-direction:column;min-height:0}.ghost{position:absolute;font:900 clamp(140px,25vw,400px)/.7 "Songti SC",serif;opacity:.05}.portrait-shell{position:relative;width:min(49vh,550px,76vw);aspect-ratio:1;background:#cfd1cf}.portrait{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.next{opacity:var(--blend)}.halo{position:absolute;inset:-9%;border:1px solid #c19a4988;border-radius:50%;opacity:var(--strength)}.scan{position:absolute;inset:0;background:linear-gradient(90deg,transparent 49.8%,#fff3 50%,transparent 50.2%),linear-gradient(0deg,transparent 49.8%,#fff2 50%,transparent 50.2%)}.corner{position:absolute;width:18px;height:18px;border-color:currentColor}.tl{top:-6px;left:-6px;border-top:2px solid;border-left:2px solid}.tr{top:-6px;right:-6px;border-top:2px solid;border-right:2px solid}.bl{bottom:-6px;left:-6px;border-bottom:2px solid;border-left:2px solid}.br{right:-6px;bottom:-6px;border-right:2px solid;border-bottom:2px solid}.load{position:absolute;inset:0;display:grid;place-items:center;background:#171816df;color:#fff;font:12px Consolas,monospace}.readout{display:grid;grid-template-columns:1fr auto 1fr;width:min(49vh,550px,76vw);align-items:baseline;margin-top:12px}.readout span{color:var(--muted);font:9px Consolas,monospace}.readout span:last-child{text-align:right}.readout strong{font:900 clamp(38px,5.2vh,58px)/.9 "Songti SC",serif;letter-spacing:-.08em}.controls{width:min(760px,100%);margin:6px auto 0}.range-wrap{position:relative;height:48px}.ticks{position:absolute;inset:12px 13px;display:flex;justify-content:space-between;align-items:center}.ticks i{width:1px;height:7px;background:currentColor;opacity:.2}.ticks i.active{height:13px;background:var(--accent);opacity:.95}.range-wrap input{position:absolute;inset:0;width:100%;appearance:none;background:transparent}.range-wrap input::-webkit-slider-thumb{width:26px;height:26px;border:2px solid currentColor;border-radius:50%;appearance:none;background:var(--accent)}.markers{display:flex;justify-content:space-between;margin:-2px 0 0;padding:0 13px;list-style:none}.markers li{width:0;transform:translateX(-50%);white-space:nowrap;color:var(--muted);font-size:11px}.markers .passed,.markers .current{color:var(--accent)}.hint{color:var(--muted);font-size:10px;text-align:center}section+footer{color:var(--muted);font:8px Consolas,monospace;display:flex;justify-content:space-between;border-top:1px solid #fff4;padding-top:10px}.modal{position:fixed;inset:0;z-index:20;display:grid;place-items:center;padding:20px;background:#111b;color:#171816}.card{display:grid;grid-template-rows:auto minmax(0,1fr) auto;width:min(760px,100%);max-height:90vh;background:#f1f0eb;box-shadow:0 24px 90px #0008}.card header,.card>.actions{display:flex;justify-content:space-between;align-items:center;padding:18px 22px;border-bottom:1px solid #1718162e}.card>.actions{border:0;border-top:1px solid #1718162e}.card h2{margin:0;font:30px "Songti SC",serif}.form-body{overflow:auto;padding:22px}.form-body>label{display:grid;gap:5px;margin-bottom:14px;font:11px Consolas,monospace}.form-body input{padding:9px;border:1px solid #17181652}.form-body fieldset{margin-top:20px}.stage-form{display:grid;grid-template-columns:120px 1fr 50px;gap:8px;padding:10px 0}.stage-form img{width:50px;height:50px;object-fit:cover}.actions{display:flex;justify-content:flex-end;gap:8px}.primary{background:var(--accent)!important;color:#fff!important;border-color:var(--accent)!important}
</style>
