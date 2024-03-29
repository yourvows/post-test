<script setup lang="ts">
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {
  DropdownMenuTrigger,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
  DropdownMenuContent,
  DropdownMenu
} from "@/components/ui/dropdown-menu"
import {SelectArrow} from "radix-vue";

type Post = {
  userId: number
  id: number
  title: string
  body: string
}

const posts = ref<Post[]>([])
fetch("https://jsonplaceholder.typicode.com/posts")
    .then((response) => response.json()).then((data) => posts.value = data)
    .catch((error) => console.error(error))

const toUpperCase = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

</script>

<template>
  <div class="grid gap-6">
    <div class="container px-4 md:px-6">
      <div class="flex flex-col gap-4 md:gap-8">
        <div class="grid gap-1">
          <h1 class="text-3xl font-bold tracking-tight">All Posts</h1>
          <p class="text-gray-500 dark:text-gray-400">Browse all of our blog posts.</p>
        </div>
        <div class="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
          <div class="flex-1 grid gap-2">
            <div class="relative">

              <Input class="pl-8 border w-fit shadow-none" placeholder="Search posts..." type="search"/>
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
                <DropdownMenuRadioItem value="newest">Newest</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="oldest">Oldest</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="title">Title</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div class="grid gap-6 md:gap-8">
        <div v-for="post in posts" :key="post.id"
             class="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
          <div class="grid gap-1">
            <h2 class="text-xl font-semibold tracking-tight">{{ toUpperCase(post.title) }}</h2>
            <p class="text-gray-500 dark:text-gray-400">
              {{ toUpperCase(post.body) }}
            </p>
          </div>
          <NuxtLink :to="`/post/${post.id}`" class="ml-auto font-semibold shrink-0 inline-flex items-center gap-2">
            Read More
          </NuxtLink>
        </div>
      </div>
      <div class="flex justify-center">
        <NuxtLink class="border-2 border-gray-200 rounded-lg py-2 px-4 text-sm" href="#">
          Previous
        </NuxtLink>
        <NuxtLink class="border-2 border-gray-200 bg-gray-100 rounded-lg py-2 px-4 text-sm" href="#">
          1
        </NuxtLink>
        <NuxtLink class="border-2 border-gray-200 rounded-lg py-2 px-4 text-sm" href="#">
          2
        </NuxtLink>
        <NuxtLink class="border-2 border-gray-200 rounded-lg py-2 px-4 text-sm" href="#">
          3
        </NuxtLink>
        <NuxtLink class="border-2 border-gray-200 rounded-lg py-2 px-4 text-sm" href="#">
          Next
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
