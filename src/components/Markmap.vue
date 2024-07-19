<template>
    <textarea class="w-full h-full border border-gray-400" v-model="value" placeholder="输入markdown生成思维导图"/>
    <svg ref="svgRef" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUpdated, watch, defineExpose } from 'vue';
import { Markmap } from 'markmap-view';
import { loadJS, loadCSS } from 'markmap-common';
import { Transformer } from 'markmap-lib';
import { Toolbar } from "markmap-toolbar";
import { useMarkdownStore } from '@/store';

const transformer = new Transformer();
const { scripts, styles } = transformer.getAssets();
loadCSS(styles);
loadJS(scripts);

const markdownStore = useMarkdownStore()

const svgRef = ref<SVGSVGElement | null>(null);
console.log(markdownStore.markdown)
const value = ref<string>('');
let mm: any; // Adjust the type according to Markmap's typings

const update = () => {
    const { root } = transformer.transform(value.value);
    mm.setData(root);
    mm.fit();
};

defineExpose({
    svgRef,
    value,
    update
});

onMounted(() => {
mm = Markmap.create(svgRef.value!);
update();
});

onUpdated(update);

watch(() => markdownStore.markdown, (newMarkdown) => {
  value.value = newMarkdown;
  update(); // 确保在markdownStore.markdown更新后，思维导图也更新
});

</script>

<style scoped lang=scss>
    textarea {
        resize: none;
        width: 100%;
        height:110px;
        overflow: auto;
        border: 1px solid #ccc;
        outline: none;
        margin-bottom: 10px;
        border-radius: 15px;
        padding: 5px;
    }

    svg {
        width: 100%;
        height: 410px;
        border: 2px dotted;
        border-radius: 10px;
    }
</style>