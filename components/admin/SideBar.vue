<template>
  <v-navigation-drawer :rail="true" :permanent="true" color="primary">
    <v-list
      theme="light"
      density="compact"
      :nav="true"
      height="100%"
      class="d-flex flex-column justify-center"
    >
      <v-list-item prepend-icon="mdi-web" @click="$router.push('/admin/global')">
        <v-tooltip activator="parent"> 全局设置 </v-tooltip>
      </v-list-item>
      <v-list-item
        prepend-icon="mdi-bookmark-box-multiple"
        @click="$router.push('/admin/challenges')"
      >
        <v-tooltip activator="parent"> 题库管理 </v-tooltip>
      </v-list-item>
      <v-list-item
        prepend-icon="mdi-package-variant"
        @click="$router.push('/admin/categories')"
      >
        <v-tooltip activator="parent"> 分类管理 </v-tooltip>
      </v-list-item>
      <v-list-item
        prepend-icon="mdi-file-document"
        @click="$router.push('/admin/articles')"
      >
        <v-tooltip activator="parent"> 文章管理 </v-tooltip>
      </v-list-item>
      <v-list-item
        prepend-icon="mdi-check-decagram"
        @click="$router.push('/admin/submissions')"
      >
        <v-tooltip activator="parent"> 提交记录管理 </v-tooltip>
      </v-list-item>
      <v-list-item prepend-icon="mdi-flag" @click="$router.push('/admin/games')">
        <v-tooltip activator="parent"> 比赛管理 </v-tooltip>
      </v-list-item>
      <v-list-item
        prepend-icon="mdi-account-multiple"
        @click="$router.push('/admin/teams')"
      >
        <v-tooltip activator="parent"> 团队管理 </v-tooltip>
      </v-list-item>
      <v-list-item prepend-icon="mdi-account" @click="$router.push('/admin/users')">
        <v-tooltip activator="parent"> 用户管理 </v-tooltip>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<script setup lang="ts"></script>
