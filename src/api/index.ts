import { ref, onMounted } from "vue";
import { getFileList } from "../../api/index";

export default {
  setup() {
    onMounted(() => {
      getTest().then((res: any) => {
        console.log(res);
      });
    });
  },
};
