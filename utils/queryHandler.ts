import { computed, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export function useQueryHandler(): { value: any } {
  const router = useRouter()
  const route = useRoute()

  const value = computed({
    get() {
      return route.query
    },
    set(newValue: any) {
      const newQuery = { ...route.query }

      for (const [key, val] of Object.entries(newValue)) {
        if (val !== undefined && val !== null && val !== '') {
          console.log(newQuery)
          newQuery[key] = val as string
        } else {
          delete newQuery[key as string]
        }
      }
      router.replace({ ...route, query: newQuery })
    },
  })

  return reactive({
    value: value,
  })
}
