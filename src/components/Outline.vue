<script setup lang="ts">
import { h, ref, type Component, onMounted } from 'vue'

import { useEditorStore } from '@/store'
import { storeToRefs } from 'pinia'

const editorStore = useEditorStore()
const { headings } = storeToRefs(editorStore)
const props = defineProps<{
    editor: any
}>()
const emit = defineEmits(['heading-click']);

const handleHeadingClick = (heading) => {
    console.log(heading);
    
    emit('heading-click', heading);
    editorStore.setActiveHeading(heading.text)
}

const scrollTarget = ref()
</script>

<template>
    <div class="outline__list">
        <h2>大纲</h2>
        <template v-for="(heading, index) in headings" :key="index">
            <div @click="handleHeadingClick(heading)" class="outline__item" :class="`outline__item${heading.level}`">
                {{ heading.text }}
                <el-icon v-if="heading.icon">
                    <component :is="heading.icon" />
                </el-icon>
            </div>
        </template>
    </div>
</template>

<style scoped lang="scss">
.outline {
    // opacity: 0.75;
    // border-radius: 0.5rem;
    // padding: 0.75rem;
    // background: rgba(black, 0.1);

    &__list {
        display: flex;
        flex-direction: column;
        list-style: none;
        font-size: 18px;
        padding: 0;
        padding-bottom:10px;

        h2 {
            text-align: center;
            width: 96%;
            // border: 1px solid black;
            background-color: #4ecafb;
            box-shadow: 0px 0px 8px 2px rgba(0, 0, 0, 0.1);
            border-radius: 15px;
        }
    }

    &__item {
        opacity: 0.85;
        max-width: 98%;
        cursor: pointer;
        border-radius: 6px;
        transition: all .2s ease-in-out;
        padding: 5px 2px;
        word-break: break-all;
        /* 允许在任意字符间断行 */
        hyphens: auto;
        /* 允许自动连字符 */

        &1 {
            font-size: 18px;
            padding-left: 0rem;
        }

        &1:hover {
            font-size: calc(100% + 1px) !important;
        }

        &2 {
            font-size: 15px;
            padding-left: 1rem;
        }

        &2:hover {
            font-size: calc(80% + 1px) !important;
        }

        &3 {
            font-size: 13px;
            padding-left: 2rem;
        }

        &4 {
            font-size: 13px;
            padding-left: 3rem;
        }

        &5 {
            font-size: 13px;
            padding-left: 4rem;
        }

        &6 {
            font-size: 13px;
            padding-left: 5rem;
        }
    }

    &__item:hover {
        opacity: 1;
        background-color: #ECF5FF;
        color: #409EFF;
        font-weight: 700;
        font-size: 14px;
    }
}
</style>
