<template>
	<v-card width="full" height="12rem">
		<div class="pa-5">
			<div class="d-flex align-center">
				<v-avatar
					color="surface-variant"
					image="http://mao.ctf.homes/media/879d1104df34a02a092a6eb2dc6cb14cafc6cce5bc6fe6d1a9eef78583e769ef/avatar"
					size="56"
				/>
				<div class="ml-3 font-weight-bold text-h6">灵曄兮</div>
			</div>
			<v-divider class="my-3" />
			<div class="d-flex justify-space-between align-center mx-10 mb-3">
				<div class="d-flex flex-column align-center">
					<div class="font-weight-bold">5</div>
					<div class="text-caption">排名</div>
				</div>
				<div class="d-flex flex-column align-center">
					<div class="font-weight-bold">525</div>
					<div class="text-caption">得分</div>
				</div>
				<div class="d-flex flex-column align-center">
					<div class="font-weight-bold">1</div>
					<div class="text-caption">攻克数量</div>
				</div>
			</div>
			<v-progress-linear
				model-value="10"
				color="blue-darken-3"
				height="10"
				:striped="true"
				:rounded="true"
			></v-progress-linear>
		</div>
	</v-card>
</template>
<script setup lang="ts"></script>
