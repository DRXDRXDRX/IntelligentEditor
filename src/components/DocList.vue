<template>
    <div class="root">
        <el-table
        :data="paginatedAndSortedDocList"
        style="width: 100%"
        height="477"
        @sort-change="handleSortChange"
        >
        <el-table-column  label="文档名" prop="fileName" sortable />
        <el-table-column  label="创建日期" prop="createDate" sortable :filters="createDateFilters" :filter-method="filterByCreateDate" />
        <el-table-column  label="创建时间" prop="createTime" sortable />
        <el-table-column  label="最近修改日期" prop="updateDate" sortable :filters="updateDateFilters" :filter-method="filterByUpdateDate" />
        <el-table-column  label="最近修改时间" prop="updateTime" sortable />
        <el-table-column width="80px" label="类型" prop="type" :filters="typeFilters" :filter-method="filterByType" />
        <el-table-column align="center" width="150px">
            <template #header>
            <el-input v-model="search" size="medium" placeholder="搜索" />
            </template>
            <template #default="scope">
            <el-button size="small" type="primary" @click="chooseDoc(scope.$index)">
                选择
            </el-button>
            </template>
        </el-table-column>
        </el-table>
        <div class="pagination-block">
            <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[10, 20, 30, 50, 100, 200]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="filteredDocList.length"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import http from '@/utils/request';
import { ElMessage } from 'element-plus';

const emit = defineEmits(['closeDocListDialog']);

const docList = reactive([]);
const props = defineProps({
    update_doc_list: Boolean
});

// 初始化筛选器选项
const createDateFilters = ref([]);
const updateDateFilters = ref([]);
const typeFilters = ref([]);

// 格式化时间: 2024-07-17T00:35:24.799Z => 2024-07-17 00:35:24。ISO 8601格式的时间字符串变成正常的时间格式
const formatDateTime = (isoString, timeType: string) => {
const date = new Date(isoString);
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0');
const day = String(date.getDate()).padStart(2, '0');
const hours = String(date.getHours()).padStart(2, '0');
const minutes = String(date.getMinutes()).padStart(2, '0');
const seconds = String(date.getSeconds()).padStart(2, '0');
if (timeType === 'date') {
    return `${year}-${month}-${day}`;
} else if (timeType === 'time') {
    return `${hours}:${minutes}:${seconds}`;
}
};

const getDocList = async () => {
const res = await http.request({
    url: '/doc/list',
    method: 'GET',
});
console.log(Object.values(res.data.docs).flat(Infinity));
Object.values(res.data.docs).flat(Infinity).map(item => {
    const doc = {
        id: item.id,
        fileName: item.title,
        createDate: formatDateTime(item.created_at, 'date'),
        createTime: formatDateTime(item.created_at, 'time'),
        updateDate: formatDateTime(item.updated_at, 'date'),
        updateTime: formatDateTime(item.updated_at, 'time'),
        type: item.type
    };
    docList.push(doc);
    if (!createDateFilters.value.some(filter => filter.value === doc.createDate)) {
        createDateFilters.value.push({ text: doc.createDate, value: doc.createDate });
    }
    if (!updateDateFilters.value.some(filter => filter.value === doc.updateDate)) {
        updateDateFilters.value.push({ text: doc.updateDate, value: doc.updateDate });
    }
    if (!typeFilters.value.some(filter => filter.value === doc.type)) {
        typeFilters.value.push({ text: doc.type, value: doc.type });
    }
});
};
getDocList();

watch(() => props.update_doc_list, (newVal) => {
    console.log(newVal);
    if (newVal) {
        docList.splice(0, docList.length);
        createDateFilters.value.splice(0, createDateFilters.value.length);
        updateDateFilters.value.splice(0, updateDateFilters.value.length);
        typeFilters.value.splice(0, typeFilters.value.length);
        getDocList();
    }
});

const length = computed(() => docList.length);

// 分页
const currentPage = ref(1);
const pageSize = ref(10);
const search = ref('');

// 排序和筛选处理
const sortProp = ref('');
const sortOrder = ref('ascending');
const filteredDocList = computed(() => {
let filtered = [...docList];

if (search.value) {
    filtered = filtered.filter(item =>
        item.fileName.includes(search.value) ||
        item.createDate.includes(search.value) ||
        item.createTime.includes(search.value) ||
        item.updateDate.includes(search.value) ||
        item.updateTime.includes(search.value) ||
        item.type.includes(search.value)
    );
}

if (createDateFilters.value.length) {
    filtered = filtered.filter(item => createDateFilters.value.some(filter => filter.value === item.createDate));
}

if (updateDateFilters.value.length) {
    filtered = filtered.filter(item => updateDateFilters.value.some(filter => filter.value === item.updateDate));
}

if (typeFilters.value.length) {
    filtered = filtered.filter(item => typeFilters.value.some(filter => filter.value === item.type));
}

return filtered;
});

const paginatedAndSortedDocList = computed(() => {
let sorted = [...filteredDocList.value];

if (sortProp.value) {
    sorted.sort((a, b) => {
        let result = 0;
        if (a[sortProp.value] > b[sortProp.value]) result = 1;
        if (a[sortProp.value] < b[sortProp.value]) result = -1;
        return sortOrder.value === 'ascending' ? result : -result;
    });
}

const start = (currentPage.value - 1) * pageSize.value;
const end = start + pageSize.value;
    return sorted.slice(start, end);
});

const handleSortChange = ({ prop, order }) => {
    sortProp.value = prop;
    sortOrder.value = order;
};

const handleSizeChange = (size) => {
    pageSize.value = size;
};

const handleCurrentChange = (page) => {
    currentPage.value = page;
};

const filterByCreateDate = (value, row) => {
    if (!value) return true;
    return row.createDate === value;
};

const filterByUpdateDate = (value, row) => {
    if (!value) return true;
    return row.updateDate === value;
};

const filterByType = (value, row) => {
    if (!value) return true;
    return row.type === value;
};

const chooseDoc = (index) => {
    const doc = paginatedAndSortedDocList.value[index];
    console.log(doc.id);
    ElMessage({
        message: `已选择文档：${doc.fileName}。请在输入框输入问题进行文档提问`,
        type: 'success',
        duration: 5000,
        showClose: true
    });
    emit('closeDocListDialog', doc.id);
    search.value = '';
};
</script>

<style lang="scss" scoped>
</style>
