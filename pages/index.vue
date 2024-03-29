<script setup lang="ts">
  import { Input } from '@/components/ui/input'
  import { Button } from '@/components/ui/button'
  import { DropdownMenuTrigger, DropdownMenu } from '@/components/ui/dropdown-menu'
  import { toUpperCase } from '~/utils/formatter'
  import { ChevronRight } from 'lucide-vue-next'
  import { useQueryHandler } from '~/utils/queryHandler'
  import { sortTypeEnum } from '~/utils/enum'

  type sortTypes = 'ASC' | 'DESC'
  const queries = useQueryHandler()

  const sortType = ref('')
  const pagination = reactive({
    page: 1,
    count_items: 10,
    total_items: 100,
  })
  const posts = ref<Post[]>([])
  const filteredPosts = ref<Post[]>([])
  const searchInput = ref('')
  const isPending = ref(true)

  const sortPosts = (value: sortTypes) => {
    sortType.value = value
  }

  watch(sortType, (newValue) => {
    if (newValue === sortTypeEnum.desc) {
      filteredPosts.value = filteredPosts.value
        .slice()
        .sort((a, b) => b.title.localeCompare(a.title))
    } else if (newValue === sortTypeEnum.asc) {
      filteredPosts.value = filteredPosts.value
        .slice()
        .sort((a, b) => a.title.localeCompare(b.title))
    }
  })
  const searchPosts = (value: string) => {
    if (value) {
      filteredPosts.value = posts.value
      const query = value.toLowerCase()
      queries.value = { search: query }
      filteredPosts.value = posts.value.filter((post) => {
        return post.title.toLowerCase().includes(query) || post.body.toLowerCase().includes(query)
      })
    }else{
      filteredPosts.value = posts.value
      queries.value = { search: '' }
    }

  }
  const paginationHandler = (page: number) => {
    pagination.page = page
    queries.value = { page: page }
    initialFetch()
  }
  const initialFetch = async () => {
    const params = new URLSearchParams({
      _per_page: String(pagination.count_items),
      _page: queries.value.page || String(pagination.page),
    })
    await fetch(`https://jsonplaceholder.typicode.com/posts?${params}`)
      .then((response) => response.json())
      .then((data) => {
        posts.value = data
        filteredPosts.value = data
        isPending.value = false
      })
      .catch((error) => console.error(error))
    searchPosts(queries.value.search)
    searchInput.value = queries.value.search
    pagination.page = Number(queries.value.page) || pagination.page
  }

  onMounted(() => {
    initialFetch()
  })
</script>

<template>
  <div class="mt-2 grid gap-6">
    <div class="container px-4 md:px-6">
      <div class="flex flex-col gap-4 md:gap-8">
        <div class="grid gap-1">
          <h1 class="text-3xl font-bold tracking-tight">All Posts</h1>
          <p class="text-gray-500 dark:text-gray-400">Browse all of our blog posts.</p>
        </div>
        <div class="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
          <div class="flex-1 grid gap-2">
            <div class="relative">
              <Input
                class="pl-8 border w-fit shadow-none"
                @input="searchPosts(searchInput)"
                v-model="searchInput"
                placeholder="Search posts..."
                type="search"
              />
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button class="ml-auto shrink-0" id="sort" size="sm" variant="outline">
                Sort by
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup value="newest">
                <DropdownMenuRadioItem @click="sortPosts(sortTypeEnum.desc)"
                  >ASC
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem @click="sortPosts(sortTypeEnum.asc)"
                  >DESC
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div class="mt-2 grid gap-6 md:gap-8">
        <template v-if="!isPending">
          <div
            v-for="post in filteredPosts"
            :key="post.id"
            class="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8"
          >
            <div class="grid gap-1">
              <h2 class="text-xl font-semibold tracking-tight">{{ toUpperCase(post.title) }}</h2>
              <p class="text-gray-500 dark:text-gray-400">
                {{ toUpperCase(post.body) }}
              </p>
            </div>
            <NuxtLink
              :to="`/post/${post.id}`"
              class="ml-auto border rounded-md p-1 font-semibold shrink-0 inline-flex items-center gap-2"
            >
              Read More
              <ChevronRight class="w-4 h-4" />
            </NuxtLink>
          </div>
        </template>
        <template v-else>
          <div class="grid gap-6 md:gap-8">
            <div class="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
              <div class="grid gap-1">
                <h2 class="text-xl font-semibold tracking-tight">Loading...</h2>
                <p class="text-gray-500 dark:text-gray-400">Please wait a moment</p>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div v-if="!isPending" class="p-5 flex justify-center">
        <NuxtLink
          @click="paginationHandler(pagination.page - 1)"
          class="border-2 border-gray-200 rounded-lg py-2 px-4 text-sm"
        >
          Previous
        </NuxtLink>
        <NuxtLink
          class="border-2 border-gray-200 rounded-lg py-2 px-4 cursor-pointer text-sm"
          @click="paginationHandler(page)"
          :class="[page === pagination.page ? 'bg-black text-white' : 'bg-gray-100']"
          v-for="page in Math.ceil(pagination.total_items / pagination.count_items)"
        >
          {{ page }}
        </NuxtLink>
        <NuxtLink
          @click="paginationHandler(pagination.page + 1)"
          class="border-2 border-gray-200 rounded-lg py-2 px-4 text-sm"
        >
          Next
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
