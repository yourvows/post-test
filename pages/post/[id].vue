<script setup lang="ts">
  import { toUpperCase } from '~/utils/formatter'

  const route = useRoute()
  const postId = route.params.id
  const post = ref()
  const comments = ref<PostComment[]>()
  const isPending = ref(false)

  function fetchPost() {
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
      .then((response) => response.json())
      .then((data) => {
        post.value = data
        isPending.value = true
      })
      .catch((error) => console.error(error))
  }

  function fetchComments() {
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
      .then((response) => response.json())
      .then((data) => {
        comments.value = data
        isPending.value = true
      })
      .catch((error) => console.error(error))
  }

  onMounted(async () => {
    fetchPost()
    fetchComments()
  })
</script>

<template>
  <div class="w-full mt-4 grid gap-4">
    <div v-if="isPending" class="mx-auto max-w-2xl space-y-2">
      <div class="bg-gray-200 rounded-md p-4">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold tracking-tighter">
            {{ post?.title ? toUpperCase(post?.title) : '' }}
          </h1>
        </div>
        <div class="space-y-4 text-xl leading-relaxed">
          <p>
            {{ post?.body ? toUpperCase(post.body) : '' }}
          </p>
        </div>
      </div>
      <div>
        <p class="text-2xl border-t font-bold tracking-tighter">Comments</p>
        <div class="space-y-4 text-xl leading-relaxed">
          <div v-for="comment in comments" :key="comment.id">
            <div class="space-y-1 bg-gray-300 rounded-md p-4">
              <p class="text-lg font-bold tracking-tighter">{{ toUpperCase(comment.name) }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ comment.email }}</p>
              <div class="text-xl">{{ toUpperCase(comment.body) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="mx-auto max-w-2xl space-y-2">
      <div class="space-y-1">
        <h1 class="text-3xl font-bold tracking-tighter">Loading...</h1>
        <p class="text-gray-500 dark:text-gray-400">Please wait a moment</p>
      </div>
    </div>
  </div>
</template>
