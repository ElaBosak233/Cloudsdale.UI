<template>
	<v-card
		width="17rem"
		height="8rem"
		elevation="3"
		class="rounded-lg no-select"
		@click="$router.push('/teams/')"
	>
		<div class="pa-4 d-flex justify-center">
			<div class="d-flex align-center">
				<TAvatar :team-id="teamId" :size="70" />
			</div>
			<div class="flex-1-1">
				<div class="d-flex justify-center my-2">
					<div
						style="
							font-size: 1.2rem;
							font-weight: bold;
							text-overflow: ellipsis;
							white-space: nowrap;
							overflow: hidden;
							max-width: 13vh;
						"
					>
						{{ name }}
						<v-tooltip activator="parent" location="top center">{{
							name
						}}</v-tooltip>
					</div>
				</div>
				<div class="d-flex align-center justify-start mx-5">
					<div class="d-flex justify-start">
						<div v-for="user in top3Users" :key="user?.id">
							<v-tooltip
								:text="user?.nickname"
								location="top center"
							>
								<template #activator="{ props: tooltip }">
									<IAvatar
										v-bind="tooltip"
										:user-id="user.id"
										:size="30"
										class="avatar-group-item"
									/>
								</template>
							</v-tooltip>
						</div>
					</div>
				</div>
			</div>
		</div>
		<v-tooltip v-if="isCaptain" text="队长" location="top center">
			<template #activator="{ props: tooltip }">
				<v-icon
					color="yellow-darken-3"
					style="position: absolute; right: 15px; top: 15px"
					icon="mdi-star"
					v-bind="tooltip"
				/>
			</template>
		</v-tooltip>
		<v-icon
			size="100"
			style="
				position: absolute;
				right: 2rem;
				bottom: 0;
				z-index: -1;
				opacity: 0.05;
			"
			icon="mdi-account-group"
		/>
	</v-card>
</template>

<script setup lang="ts">
import TAvatar from "@/components/images/TAvatar.vue";
import IAvatar from "@/components/images/IAvatar.vue";
import type { User } from "@/types/user";

interface Props {
	name: string;
	isCaptain: boolean;
	users: Array<User>;
	teamId: number;
}

const props = defineProps<Props>();

const top3Users = computed(() => {
	return props.users.slice(0, 7);
});
</script>

<style scoped lang="scss">
.avatar-group-item {
	border-radius: 50%;
	object-fit: cover;
	margin-right: -15px;
}
</style>
