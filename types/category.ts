export interface Category {
	id: number;
	name: string;
	color: string;
	icon: string;
}

export interface CategoryResponse {
	code: number;
	msg: string;
	data: Array<Category>;
}
