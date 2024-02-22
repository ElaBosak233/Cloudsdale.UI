import axios from "axios";
import { useAuthStore } from "@/store/auth";
import { useConfigStore } from "@/store/config";

// 定义一个 useAuthFetch 函数，接收 url 和 options 作为参数
export async function useAuthFetch(url: string, options = {}) {
	// 定义一个响应式的 data，用于存储请求返回的数据
	const data: Ref<any> = ref(null);
	// 定义一个响应式的 error，用于存储请求出错的信息
	const error: Ref<any> = ref(null);
	// 定义一个响应式的 loading，用于表示请求的状态
	const loading: Ref<boolean> = ref(false);

	// 获取 authStore 和 configStore 的实例
	const authStore = useAuthStore();
	const configStore = useConfigStore();

	loading.value = true;
	try {
		// 使用 axios 实例发送请求，传入 url 和 options
		const response = await axios(configStore.apiUrl + url, {
			// 设置请求头，添加 token
			headers: {
				Authorization: authStore.pgsToken,
			},
			// 合并其他选项
			...options,
		});
		// 设置 data 为响应数据
		data.value = response.data;
		// 设置 error 为 null
		error.value = null;
	} catch (err: any) {
		// 设置 data 为 null
		data.value = null;
		// 设置 error 为错误信息
		error.value = err.message;
	} finally {
		// 设置 loading 为 false
		loading.value = false;
	}

	// 返回 data，error，loading 和 fetchData
	return {
		data,
		error,
		loading,
	};
}
