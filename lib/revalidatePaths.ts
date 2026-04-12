import { revalidatePath } from 'next/cache'

const APP_LOCALES = ['en', 'bn'] as const

/** Home + admin for each locale (App Router `[lang]` paths are not covered by `revalidatePath('/')` alone). */
export function revalidateCatalogAndAdmin() {
  for (const lang of APP_LOCALES) {
    revalidatePath(`/${lang}`)
    revalidatePath(`/${lang}/admin`)
  }
}
