<template>
    <div class="root">
        <el-table :data="paginatedAndSortedResourceList" style="width: 100%" height="477">
            <!-- 展开行 -->
            <el-table-column type="expand">
                <template #default="props">
                    <h5>文件处理结果：</h5>
                    <div>{{ props.row.content }}</div>
                </template>
            </el-table-column>
            
            <!-- 文件名 -->
            <el-table-column label="文件名"  width="280px" prop="fileName" sortable />
            
            <!-- 文件类型 -->
            <el-table-column 
                label="文件类型" 
                prop="type" 
                sortable 
                width="160px"
                :filters="fileTypeFilters" 
                :filter-method="filterByFileType" 
            />
            
            <!-- 上传日期 -->
            <el-table-column 
                label="上传日期" 
                prop="date" 
                sortable 
                width="160px"
                :filters="uploadDateFilters" 
                :filter-method="filterByUploadDate" 
            />
            
            <!-- 上传时间 -->
            <el-table-column 
                label="上传时间" 
                prop="time" 
                sortable 
                width="160px"
            />
            
            <!-- 操作列 -->
            <el-table-column align="center">
                <template #header>
                    <el-input v-model="search" size="medium" placeholder="搜索" />
                </template>
                <template #default="scope">
                    <el-popconfirm 
                        title="确认删除吗？" 
                        confirm-button-text="确认" 
                        cancel-button-text="取消"
                        cancel-button-type="info"
                        @confirm="handleDelete(scope.$index, scope.row)"
                    >
                        <template #reference>
                            <el-button size="small" type="danger">
                                删除
                            </el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-block">
            <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[10, 20, 30, 50, 100, 200]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="filteredResourceList.length"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import http from '@/utils/request';
import { ElMessage, ElPopconfirm } from 'element-plus';

const props = defineProps({
    update_resource_list: Boolean
});
const resourceList = reactive([]);
const fileTypeFilters = ref([]);
const uploadDateFilters = ref([]);
const search = ref('');
const currentPage = ref(1);
const pageSize = ref(10);

// 格式化时间
const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 获取资源列表
const getResourceList = async () => {
    const res = await http.request({
        url: '/rag/list',
        method: 'GET',
    });
    console.log(res.data);
    res.data.map(item => {
        const resource = {
            id: item.ID,
            fileName: item.FileName,
            type: item.Type,
            date: formatDateTime(item.CreatedAt).split(' ')[0],
            time: formatDateTime(item.CreatedAt).split(' ')[1],
            content: item.Content,
        };
        resourceList.push(resource);
        if (!fileTypeFilters.value.some(filter => filter.value === resource.type)) {
            fileTypeFilters.value.push({ text: resource.type, value: resource.type });
        }
        if (!uploadDateFilters.value.some(filter => filter.value === resource.date)) {
            uploadDateFilters.value.push({ text: resource.date, value: resource.date });
        }
    });
};
getResourceList();

watch(() => props.update_resource_list, (newVal) => {
    console.log(newVal)
    if (newVal) {
        resourceList.splice(0, resourceList.length);
        fileTypeFilters.value.splice(0, fileTypeFilters.value.length);
        uploadDateFilters.value.splice(0, uploadDateFilters.value.length);
        getResourceList();
    }
});

// 排序和筛选处理
const sortProp = ref('');
const sortOrder = ref('ascending');
const filteredResourceList = computed(() => {
    let filtered = [...resourceList];

    if (search.value) {
        filtered = filtered.filter(item =>
            item.fileName.includes(search.value) ||
            item.type.includes(search.value) ||
            item.date.includes(search.value) ||
            item.time.includes(search.value)
        );
    }

    if (fileTypeFilters.value.length) {
        filtered = filtered.filter(item => fileTypeFilters.value.some(filter => filter.value === item.type));
    }

    if (uploadDateFilters.value.length) {
        filtered = filtered.filter(item => uploadDateFilters.value.some(filter => filter.value === item.date));
    }

    return filtered;
});

const paginatedAndSortedResourceList = computed(() => {
    let sorted = [...filteredResourceList.value];

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

const filterByFileType = (value, row) => {
    if (!value) return true;
    return row.type === value;
};

const filterByUploadDate = (value, row) => {
    if (!value) return true;
    return row.date === value;
};

const handleDelete = async (index, row) => {
    console.log(index, row.id)
    // try {
    //     await http.request({
    //         url: '/rag/item',
    //         method: 'DELETE',
    //         data: { doc_id: row.id },
    //     });
    //     ElMessage({
    //         type: 'success',
    //         message: '删除成功',
    //     });
    //     getResourceList()
    // } catch (error) {
    //     ElMessage({
    //         type: 'error',
    //         message: '删除失败',
    //     });
    // }
};
</script>

<style lang="scss" scoped>
.root {
    padding: 20px;
}
.demo-pagination-block {
    margin-top: 20px;
}
</style>
